import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { product } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/server/admin-guard';

export default async function handler(req: Request, res: Response) {
  const guard = await requireAdmin(req, res);
  if (!guard) return;

  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid product id' });

  const { name, description, price, badge, type, category, active } = req.body;

  try {
    await db.update(product).set({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: String(price) }),
      ...(badge !== undefined && { badge }),
      ...(type !== undefined && { type }),
      ...(category !== undefined && { category }),
      ...(active !== undefined && { active }),
    }).where(eq(product.id, id));

    const [updated] = await db.select().from(product).where(eq(product.id, id)).limit(1);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product', message: String(err) });
  }
}
