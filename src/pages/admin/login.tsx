import { Helmet } from '@dr.pogodin/react-helmet';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { authClient } from '@/lib/auth/auth-client';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('classicalueue@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message || 'Invalid credentials');
        setLoading(false);
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Login — Ethereal Psyche</title>
        <meta name="description" content="Admin login for Ethereal Psyche boutique management." />
        <link rel="canonical" href="/admin/login" />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <main
        className="flex items-center justify-center"
        style={{ minHeight: '100vh', background: 'hsl(var(--background))', padding: '24px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-2xl"
          style={{
            maxWidth: '400px',
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            padding: '40px 32px',
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-8 text-center">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: '52px', height: '52px', background: 'hsl(var(--primary) / 0.15)', border: '1px solid hsl(var(--primary) / 0.3)' }}
            >
              <Lock size={22} style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>
                Admin Portal
              </h1>
              <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '13px', margin: 0 }}>
                Ethereal Psyche — Dream Blue Moonlight
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-email" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--secondary))', fontSize: '13px' }}>
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl"
                style={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  padding: '12px 16px',
                  minHeight: '48px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-password" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--secondary))', fontSize: '13px' }}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl"
                style={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  padding: '12px 16px',
                  minHeight: '48px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 rounded-xl"
                style={{ background: 'hsl(var(--destructive) / 0.1)', border: '1px solid hsl(var(--destructive) / 0.3)', padding: '10px 14px' }}
              >
                <AlertCircle size={16} style={{ color: 'hsl(var(--destructive))', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--destructive))', fontSize: '13px' }}>{error}</span>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-full flex items-center justify-center gap-2"
              style={{
                background: loading ? 'hsl(var(--muted))' : 'hsl(var(--primary))',
                color: loading ? 'hsl(var(--muted-foreground))' : 'hsl(var(--primary-foreground))',
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                padding: '14px',
                minHeight: '50px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '4px',
              }}
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : 'Sign in 🌙'}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </>
  );
}
