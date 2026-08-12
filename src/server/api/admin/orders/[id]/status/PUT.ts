import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { order } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/server/admin-guard';

const VALID_STATUSES = ['pending', 'processing', 'delivered', 'cancelled'];

export default async function handler(req: Request, res: Response) {
  const guard = await requireAdmin(req, res);
  if (!guard) return;

  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid order id' });

  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    await db.update(order).set({ status }).where(eq(order.id, id));
    const [updated] = await db.select().from(order).where(eq(order.id, id)).limit(1);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status', message: String(err) });
  }
}
