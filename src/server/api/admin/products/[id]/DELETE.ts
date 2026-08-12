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

  try {
    await db.delete(product).where(eq(product.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product', message: String(err) });
  }
}
