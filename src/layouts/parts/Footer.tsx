import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';

const reminders = [
  'clients for entertainment prems (shared) must fill up monitoring forms (see rules)',
  'send a vouch to one of the owners (tg: @marieldcc / @velleonix) within 24 hours to activate your warranty',
  'no vouch, no warranty',
  'not following rules = void warranty',
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'hsl(var(--background))', borderTop: '1px solid hsl(var(--border) / 0.6)' }}
    >
      {/* Top glow */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0"
        style={{
          width: '600px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), transparent)',
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          top: '-40px',
          width: '500px',
          height: '100px',
          background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.08) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative z-10 mx-auto" style={{ maxWidth: '860px', padding: '56px 24px 36px' }}>

        {/* Brand + links row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-10">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'hsl(var(--foreground))',
                  fontSize: '22px',
                  letterSpacing: '0.1em',
                  margin: 0,
                }}
              >
                <span style={{ color: 'hsl(var(--primary))' }}>✦</span> Ethereal Psyche
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'hsl(var(--muted-foreground))',
                  fontSize: '12px',
                  margin: '4px 0 0',
                  letterSpacing: '0.06em',
                }}
              >
                Dream Blue Moonlight Digital Shop
              </p>
            </motion.div>

            <div className="flex items-center gap-3 mt-1">
              <motion.a
                href="https://t.me/etherzonee"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: '0 0 16px hsl(var(--primary) / 0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full"
                style={{
                  background: 'hsl(var(--primary) / 0.12)',
                  border: '1px solid hsl(var(--primary) / 0.3)',
                  color: 'hsl(var(--primary))',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  textDecoration: 'none',
                  minHeight: '40px',
                }}
              >
                <Send size={13} />
                Main Channel
              </motion.a>
              <motion.a
                href="https://t.me/etherzonee/5"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full"
                style={{
                  background: 'transparent',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--muted-foreground))',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  textDecoration: 'none',
                  minHeight: '40px',
                }}
              >
                📜 Rules
              </motion.a>
            </div>
          </div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-2"
          >
            <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px' }}>
              Navigate
            </p>
            {[
              { label: 'Home', to: '/' },
              { label: 'Catalog', to: '/catalog' },
              { label: 'Satchel', to: '/cart' },
              { label: 'Admin', to: '/admin/login' },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'hsl(var(--secondary))',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                className="hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Reminders block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl mb-8"
          style={{
            background: 'hsl(var(--card) / 0.5)',
            border: '1px solid hsl(var(--border) / 0.6)',
            padding: '20px 24px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p
            className="m-0 mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'hsl(var(--secondary))',
              fontSize: '13px',
              letterSpacing: '0.06em',
            }}
          >
            𖤓 reminders, whispered gently
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '6px 24px' }}>
            {reminders.map((reminder, i) => (
              <p
                key={i}
                className="m-0 flex items-start gap-2"
                style={{
                  color: 'hsl(var(--muted-foreground) / 0.7)',
                  fontSize: '12px',
                  lineHeight: '1.65',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span style={{ color: 'hsl(var(--primary) / 0.5)', flexShrink: 0, marginTop: '2px' }}>〰</span>
                {reminder}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid hsl(var(--border) / 0.4)', paddingTop: '20px' }}
        >
          <p
            className="m-0"
            style={{
              color: 'hsl(var(--muted-foreground) / 0.4)',
              fontSize: '11px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            © 2026 Ethereal Psyche · Digital files only · All rights reserved
          </p>
          <p
            className="m-0"
            style={{
              color: 'hsl(var(--muted-foreground) / 0.3)',
              fontSize: '11px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            🌙 crafted under moonlight
          </p>
        </div>
      </div>
    </footer>
  );
}
