import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { product } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/server/admin-guard';

export default async function handler(req: Request, res: Response) {
  const guard = await requireAdmin(req, res);
  if (!guard) return;

  const { name, description, price, badge, type, category, active } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'name and price are required' });
  }

  try {
    const result = await db.insert(product).values({
      name,
      description: description || null,
      price: String(price),
      badge: badge || null,
      type: type || 'Shared Premium',
      category: category || 'Entertainment Premiums',
      active: active !== false,
    });
    const insertId = Number(result[0].insertId);
    const [created] = await db.select().from(product).where(eq(product.id, insertId)).limit(1);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product', message: String(err) });
  }
}
