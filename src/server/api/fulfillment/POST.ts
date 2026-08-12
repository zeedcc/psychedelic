/**
 * POST /api/fulfillment
 *
 * Called by the Paymongo payment.paid webhook to trigger digital-file delivery.
 * Sends a transactional email to the customer's delivery_email with their
 * purchased items listed, plus a note that files will follow from the owner.
 *
 * Expected body (from Paymongo webhook or internal trigger):
 * {
 *   delivery_email: string,
 *   customer_name?: string,
 *   cart_items: { item: string; price: number }[],
 *   total_amount: string,   // e.g. "₱299.00"
 *   shop_id?: string,
 * }
 */
import type { Request, Response } from 'express';
import { sendEmail } from '@/server/email';

interface FulfillmentItem {
  item: string;
  price: number;
}

interface FulfillmentBody {
  delivery_email: string;
  customer_name?: string;
  cart_items: FulfillmentItem[];
  total_amount: string;
  shop_id?: string;
}

function buildOrderRows(items: FulfillmentItem[]): string {
  return items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #1e3060;color:#C9D6E8;font-family:sans-serif;font-size:14px;">${i.item}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #1e3060;color:#7C9DD9;font-family:sans-serif;font-size:14px;text-align:right;">₱${i.price.toFixed(2)}</td>
        </tr>`,
    )
    .join('');
}

function buildHtml(name: string, items: FulfillmentItem[], total: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Your Ethereal Psyche Order</title></head>
<body style="margin:0;padding:0;background:#0B1739;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B1739;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111f4d;border-radius:16px;border:1px solid #1e3060;overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid #1e3060;">
            <p style="margin:0 0 8px;font-size:28px;">🌙</p>
            <h1 style="margin:0;color:#C9D6E8;font-size:22px;font-weight:700;letter-spacing:0.04em;">
              Your order is confirmed
            </h1>
            <p style="margin:8px 0 0;color:#7C9DD9;font-size:14px;">
              Ethereal Psyche — Dream Blue Moonlight
            </p>
          </td>
        </tr>
        <!-- Greeting -->
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0;color:#C9D6E8;font-size:15px;line-height:1.7;">
              Hi <strong>${name}</strong>, your payment has been received. ✨<br>
              The owner will deliver your digital files to this email shortly.
            </p>
          </td>
        </tr>
        <!-- Order table -->
        <tr>
          <td style="padding:20px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1e3060;border-radius:8px;overflow:hidden;">
              <thead>
                <tr style="background:#0B1739;">
                  <th style="padding:10px 12px;text-align:left;color:#7C9DD9;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;font-weight:600;">Item</th>
                  <th style="padding:10px 12px;text-align:right;color:#7C9DD9;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;font-weight:600;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${buildOrderRows(items)}
              </tbody>
              <tfoot>
                <tr style="background:#0B1739;">
                  <td style="padding:12px;color:#C9D6E8;font-size:14px;font-weight:600;">Total</td>
                  <td style="padding:12px;color:#7C9DD9;font-size:18px;font-weight:700;text-align:right;">${total}</td>
                </tr>
              </tfoot>
            </table>
          </td>
        </tr>
        <!-- Reminders -->
        <tr>
          <td style="padding:0 32px 24px;">
            <div style="background:#0B1739;border:1px solid #1e3060;border-radius:8px;padding:16px 20px;">
              <p style="margin:0 0 10px;color:#7C9DD9;font-size:12px;letter-spacing:0.04em;">𖤓 reminders, whispered gently</p>
              <p style="margin:0 0 6px;color:#8899bb;font-size:12px;line-height:1.65;">〰 clients for entertainment prems (shared) must fill up monitoring forms (see rules)</p>
              <p style="margin:0 0 6px;color:#8899bb;font-size:12px;line-height:1.65;">〰 send a vouch to one of the owners (tg: @marieldcc / @velleonix) within 24 hours to activate your warranty</p>
              <p style="margin:0 0 6px;color:#8899bb;font-size:12px;line-height:1.65;">〰 no vouch, no warranty</p>
              <p style="margin:0;color:#8899bb;font-size:12px;line-height:1.65;">〰 not following rules = void warranty</p>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px 32px;text-align:center;border-top:1px solid #1e3060;">
            <p style="margin:0;color:#4a5a7a;font-size:12px;line-height:1.6;">
              Ethereal Psyche · Digital Shop<br>
              Questions? Reach us on Telegram: <a href="https://t.me/etherzonee" style="color:#7C9DD9;text-decoration:none;">@etherzonee</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildText(name: string, items: FulfillmentItem[], total: string): string {
  const lines = items.map((i) => `  - ${i.item}: ₱${i.price.toFixed(2)}`).join('\n');
  return `Hi ${name},

Your Ethereal Psyche order is confirmed! ✨
The owner will deliver your digital files to this email shortly.

ORDER SUMMARY
${lines}
Total: ${total}

Reminders:
- Clients for entertainment prems (shared) must fill up monitoring forms (see rules)
- Send a vouch to one of the owners (tg: @marieldcc / @velleonix) within 24 hours to activate your warranty
- No vouch, no warranty
- Not following rules = void warranty

Questions? Reach us on Telegram: https://t.me/etherzonee

— Ethereal Psyche`;
}

export default async function handler(req: Request, res: Response) {
  try {
    const body = req.body as FulfillmentBody;
    const { delivery_email, customer_name, cart_items, total_amount } = body;

    if (!delivery_email || !cart_items?.length) {
      return res.status(400).json({ error: 'Missing delivery_email or cart_items.' });
    }

    const name = customer_name || 'Stargazer';
    const total = total_amount || `₱${cart_items.reduce((s, i) => s + i.price, 0).toFixed(2)}`;

    await sendEmail({
      fromName: 'Ethereal Psyche',
      to: delivery_email,
      subject: '🌙 Your Ethereal Psyche order is confirmed',
      html: buildHtml(name, cart_items, total),
      text: buildText(name, cart_items, total),
    });

    console.log('fulfillment.email.sent', { delivery_email, items: cart_items.length });
    return res.status(200).json({ success: true, delivered_to: delivery_email });
  } catch (err) {
    console.error('fulfillment.email.failed', err);
    return res.status(500).json({ error: 'Fulfillment email failed.', message: String(err) });
  }
}
