/**
 * POST /cart
 *
 * Webhook endpoint for checkout payments.
 * Called by the checkout flow after a successful Paymongo payment.
 *
 * Expected body:
 * {
 *   customer_name: string,
 *   delivery_email: string,
 *   cart_items: Array<{ id: string; name: string; price: number }>,
 *   total_amount: number,
 *   currency: string
 * }
 */
import type { Request, Response } from 'express';

interface PaymentWebhookBody {
  customer_name?: string;
  delivery_email?: string;
  cart_items?: Array<{ id: string; name: string; price: number }>;
  total_amount?: number;
  currency?: string;
  action?: string;
  webhook_endpoint?: string;
}

export default async function handler(req: Request, res: Response) {
  const body = req.body as PaymentWebhookBody;

  // Validate required fields
  if (!body.delivery_email || !body.cart_items?.length) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: delivery_email and cart_items',
    });
  }

  try {
    // Log the payment webhook for auditing
    const itemCount = body.cart_items.length;
    const totalAmount = body.total_amount || 0;
    const currency = body.currency || 'PHP';

    console.log('payment.webhook.received', {
      customer: body.customer_name || 'Anonymous',
      email: body.delivery_email,
      items: itemCount,
      total: totalAmount,
      currency,
    });

    // Return success response with order confirmation
    // This response is displayed on the checkout success page
    return res.status(200).json({
      success: true,
      message: 'Payment received and order confirmed',
      orderId: `ORD-${Date.now()}`,
      customer: body.customer_name || 'Stargazer',
      email: body.delivery_email,
      items: itemCount,
      total: `${currency} ${totalAmount.toFixed(2)}`,
      status: 'confirmed',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('payment.webhook.error', err);
    return res.status(500).json({
      success: false,
      error: 'Payment webhook processing failed',
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
