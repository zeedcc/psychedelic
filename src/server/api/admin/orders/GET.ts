import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { order, orderItem } from '@/server/db/schema';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '@/server/admin-guard';

export default async function handler(req: Request, res: Response) {
  const guard = await requireAdmin(req, res);
  if (!guard) return;

  try {
    const orders = await db.select().from(order).orderBy(desc(order.createdAt));
    const items = await db.select().from(orderItem);

    const result = orders.map((o) => ({
      ...o,
      items: items.filter((i) => i.orderId === o.id),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', message: String(err) });
  }
}
