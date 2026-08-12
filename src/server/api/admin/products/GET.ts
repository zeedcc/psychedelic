import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { product } from '@/server/db/schema';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '@/server/admin-guard';

export default async function handler(req: Request, res: Response) {
  const guard = await requireAdmin(req, res);
  if (!guard) return;

  try {
    const products = await db.select().from(product).orderBy(desc(product.createdAt));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', message: String(err) });
  }
}
