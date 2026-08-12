/**
 * Admin guard — verifies the request carries a valid BetterAuth session
 * and that the session user has isAdmin = true.
 *
 * Returns the session on success, or sends a 401/403 and returns null.
 */
import type { Request, Response } from 'express';
import { getAuth } from '@/lib/auth/auth';

export async function requireAdmin(req: Request, res: Response) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as Record<string, string>),
    });

    if (!session?.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return null;
    }

    // BetterAuth surfaces additionalFields on the user object
    const isAdmin = (session.user as { isAdmin?: boolean }).isAdmin;
    if (!isAdmin) {
      res.status(403).json({ error: 'Admin access required' });
      return null;
    }

    return session;
  } catch (err) {
    res.status(500).json({ error: 'Auth check failed', message: String(err) });
    return null;
  }
}
