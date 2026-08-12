import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { order, orderItem } from '@/server/db/schema';

interface CartItem {
  item: string;
  price: number;
}

interface CheckoutPayload {
  customer_name?: string;
  delivery_email: string;
  cart_items: CartItem[];
  total_amount: number;
  currency: string;
}

export default async function handler(req: Request, res: Response) {
  try {
    const { customer_name, delivery_email, cart_items, total_amount, currency } =
      req.body as CheckoutPayload;

    if (!delivery_email || !cart_items?.length || !total_amount) {
      return res.status(400).json({ error: 'Missing required checkout fields.' });
    }

    const webhookPayload = {
      action: 'trigger_checkout_webhook',
      gateway: 'paymongo',
      webhook_endpoint: 'https://etherealpsyche.com/cart',
      payload: {
        shop_id: 'ethereal_psyche',
        theme_data: 'dream_blue_moonlight',
        customer_name: customer_name || 'Guest',
        delivery_email,
        cart_items,
        total_amount: `₱${total_amount.toFixed(2)}`,
        currency: currency || 'PHP',
      },
    };

    let webhookDispatched = false;
    let webhookStatus = 0;
    let webhookResponse: Record<string, unknown> | null = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch('https://etherealpsyche.com/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      webhookDispatched = resp.ok;
      webhookStatus = resp.status;

      // Capture the webhook response body
      try {
        const responseText = await resp.text();
        if (responseText) {
          webhookResponse = JSON.parse(responseText);
        }
      } catch {
        // If response isn't JSON, just skip
      }
    } catch {
      // Webhook unreachable — still proceed
    }

    // Persist order to database
    let savedOrderId: number | null = null;
    try {
      const result = await db.insert(order).values({
        deliveryEmail: delivery_email,
        customerName: customer_name || null,
        totalAmount: String(total_amount.toFixed(2)),
        currency: currency || 'PHP',
        status: 'pending',
        webhookDispatched,
        webhookStatus: webhookStatus || null,
      });
      savedOrderId = Number(result[0].insertId);

      if (savedOrderId) {
        await db.insert(orderItem).values(
          cart_items.map((i) => ({
            orderId: savedOrderId!,
            productName: i.item,
            price: String(i.price.toFixed(2)),
          }))
        );
      }
    } catch (dbErr) {
      console.error('checkout.db.save-failed', String(dbErr));
      // Don't block checkout if DB save fails
    }

    return res.status(200).json({
      success: true,
      orderId: savedOrderId,
      webhookPayload,
      webhookResponse,
      webhookDispatched,
      webhookStatus,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Checkout failed.', message: String(err) });
  }
}
