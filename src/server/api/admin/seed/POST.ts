/**
 * POST /api/admin/seed
 *
 * One-time setup: creates the admin account for classicalueue@gmail.com
 * and marks them as isAdmin in the DB.
 *
 * Body: { password: string }
 * Protected: only runs if no admin user exists yet.
 */
import type { Request, Response } from 'express';
import { getAuth } from '@/lib/auth/auth';
import { db } from '@/server/db/client';
import { user } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

const ADMIN_EMAIL = 'classicalueue@gmail.com';
const DEFAULT_ADMIN_PASSWORD = 'Rinchanhai0912!';

export default async function handler(req: Request, res: Response) {
  const { password } = req.body as { password?: string };
  const resolvedPassword = password || DEFAULT_ADMIN_PASSWORD;

  if (!resolvedPassword || resolvedPassword.length < 8) {
    return res.status(400).json({ error: 'password must be at least 8 characters' });
  }

  try {
    // Check if admin already exists
    const [existing] = await db.select().from(user).where(eq(user.email, ADMIN_EMAIL)).limit(1);
    if (existing) {
      return res.status(409).json({ error: 'Admin account already exists. Use /api/admin/seed/reset to change the password.' });
    }

    const auth = getAuth();
    await auth.api.signUpEmail({
      body: {
        email: ADMIN_EMAIL,
        password: resolvedPassword,
        name: 'Admin',
      },
    });

    // Mark as admin
    await db.update(user).set({ isAdmin: true }).where(eq(user.email, ADMIN_EMAIL));

    return res.status(201).json({ success: true, message: `Admin account created for ${ADMIN_EMAIL}` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create admin', message: String(err) });
  }
}
