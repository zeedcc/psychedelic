import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { home } from 'virtual:content';

// ── Ambient glow orb ──────────────────────────────────────────────────────

function GlowOrb({
  size, top, left, delay = 0, opacity = 0.18,
}: { size: number; top: string; left: string; delay?: number; opacity?: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: `radial-gradient(circle, hsl(var(--primary) / ${opacity}) 0%, transparent 70%)`,
        filter: 'blur(48px)',
      }}
      animate={{ y: [0, -20, 0], scale: [1, 1.07, 1], opacity: [opacity, opacity * 1.4, opacity] }}
      transition={{ duration: 7 + delay, delay, repeat: Infinity, ease: 'easeInOut' as const }}
    />
  );
}

// ── Star field ────────────────────────────────────────────────────────────

function StarField() {
  const stars = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    x: (i * 37 + 13) % 100,
    y: (i * 53 + 7) % 100,
    size: i % 3 === 0 ? 2 : 1,
    delay: (i * 0.17) % 4,
    duration: 2.5 + (i % 3),
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: 'hsl(var(--primary))',
          }}
          animate={{ opacity: [0.1, 0.7, 0.1] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' as const }}
        />
      ))}
    </div>
  );
}

// ── Torii watermark ───────────────────────────────────────────────────────

function ToriiWatermark() {
  return (
    <svg
      viewBox="0 0 120 100"
      className="pointer-events-none absolute"
      style={{ width: '220px', height: '180px', opacity: 0.035, right: '4%', top: '50%', transform: 'translateY(-50%)' }}
      aria-hidden="true"
    >
      <rect x="5" y="18" width="110" height="8" rx="4" fill="currentColor" />
      <rect x="12" y="10" width="96" height="6" rx="3" fill="currentColor" />
      <rect x="22" y="26" width="8" height="74" rx="4" fill="currentColor" />
      <rect x="90" y="26" width="8" height="74" rx="4" fill="currentColor" />
      <rect x="30" y="40" width="60" height="5" rx="2.5" fill="currentColor" />
    </svg>
  );
}

// ── Feature pill ─────────────────────────────────────────────────────────

function FeaturePill({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="inline-flex items-center gap-2 rounded-full"
      style={{
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        padding: '8px 16px',
        fontFamily: 'var(--font-sans)',
        color: 'hsl(var(--secondary))',
        fontSize: '13px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const siteUrl = 'https://etherealpsyche.com';

  return (
    <>
      <Helmet>
        <title>Ethereal Psyche — Cheap Premium Digital Subscriptions Philippines</title>
        <meta
          name="description"
          content="Affordable shared &amp; solo premium accounts in the Philippines — Netflix, Spotify, ChatGPT, Canva, Grammarly &amp; more. PHP pricing, fast email delivery, warranty included."
        />
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta property="og:title" content="Ethereal Psyche — Cheap Premium Digital Subscriptions Philippines" />
        <meta property="og:description" content="Affordable shared &amp; solo premium accounts in the Philippines — Netflix, Spotify, ChatGPT, Canva, Grammarly &amp; more. PHP pricing, fast email delivery." />
        <meta property="og:image" content={`${siteUrl}/og-image.svg`} />
        <meta property="og:url" content={`${siteUrl}/`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ethereal Psyche — Cheap Premium Digital Subscriptions Philippines" />
        <meta name="twitter:description" content="Affordable shared &amp; solo premium accounts in the Philippines — Netflix, Spotify, ChatGPT, Canva &amp; more. PHP pricing, fast email delivery." />
        <meta name="twitter:image" content={`${siteUrl}/og-image.svg`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': `${siteUrl}/#website`,
              name: 'Ethereal Psyche',
              url: `${siteUrl}/`,
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/catalog` },
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@type': 'OnlineStore',
              '@id': `${siteUrl}/#organization`,
              name: 'Ethereal Psyche',
              url: `${siteUrl}/`,
              description: 'Affordable shared and solo premium digital subscriptions in the Philippines — streaming, AI tools, productivity, and creative apps.',
              areaServed: 'PH',
              currenciesAccepted: 'PHP',
              image: `${siteUrl}/og-image.svg`,
            },
            {
              '@type': 'WebPage',
              '@id': `${siteUrl}/#webpage`,
              url: `${siteUrl}/`,
              name: 'Ethereal Psyche — Cheap Premium Digital Subscriptions Philippines',
              description: 'Affordable shared and solo premium accounts in the Philippines — Netflix, Spotify, ChatGPT, Canva, Grammarly and more.',
              isPartOf: { '@id': `${siteUrl}/#website` },
              about: { '@id': `${siteUrl}/#organization` },
              datePublished: '2026-08-12',
              dateModified: '2026-08-12',
            },
          ],
        })}</script>
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section
          className="relative flex flex-col items-center justify-center overflow-hidden text-center"
          style={{
            minHeight: '94vh',
            background: 'radial-gradient(ellipse 120% 80% at 50% 0%, hsl(var(--muted)) 0%, hsl(var(--background)) 60%)',
            padding: '100px 24px 80px',
          }}
        >
          <StarField />
          <GlowOrb size={400} top="-5%" left="-10%" delay={0} opacity={0.16} />
          <GlowOrb size={280} top="50%" left="72%" delay={2.5} opacity={0.13} />
          <GlowOrb size={200} top="78%" left="10%" delay={4.5} opacity={0.1} />
          <ToriiWatermark />

          {/* Floating moon */}
          <motion.div
            className="mb-6 relative"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const }}
          >
            <span style={{ fontSize: '52px', lineHeight: 1, filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.5))' }}>🌙</span>
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full"
            style={{
              background: 'hsl(var(--primary) / 0.1)',
              border: '1px solid hsl(var(--primary) / 0.25)',
              padding: '6px 16px',
              fontFamily: 'var(--font-sans)',
              color: 'hsl(var(--primary))',
              fontSize: '12px',
              letterSpacing: '0.08em',
            }}
          >
            <Sparkles size={12} />
            <span>Digital Shop · Est. 2026</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' as const }}
            className="m-0 mb-5"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'hsl(var(--foreground))',
              fontSize: 'clamp(30px, 6.5vw, 58px)',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '0.01em',
              maxWidth: '700px',
            }}
          >
            {home.hero.greeting}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' as const }}
            className="m-0 mb-10"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'hsl(var(--secondary))',
              fontSize: 'clamp(15px, 2.5vw, 19px)',
              lineHeight: 1.7,
              maxWidth: '500px',
              opacity: 0.85,
            }}
          >
            {home.hero.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            <motion.a
              href={home.hero.mainChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: '0 0 32px hsl(var(--primary) / 0.45)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-full font-medium"
              style={{
                background: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                padding: '14px 32px',
                minHeight: '52px',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                boxShadow: '0 0 20px hsl(var(--primary) / 0.25)',
              }}
            >
              {home.hero.mainChannelLabel}
            </motion.a>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2 rounded-full font-medium"
                style={{
                  background: 'transparent',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--secondary))',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  padding: '14px 28px',
                  minHeight: '52px',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                Browse Catalog <ArrowRight size={15} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-2"
          >
            <FeaturePill icon="✦" label="Digital delivery" />
            <FeaturePill icon="🛡️" label="Warranty included" />
            <FeaturePill icon="⚡" label="Instant access" />
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            animate={{ y: [0, 8, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const }}
          >
            <div
              style={{
                width: '1px',
                height: '36px',
                background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.6), transparent)',
              }}
            />
          </motion.div>
        </section>

        {/* ── TELEGRAM CTA BAND ── */}
        <section
          className="relative overflow-hidden"
          style={{
            padding: '72px 24px',
            background: 'hsl(var(--muted))',
            borderTop: '1px solid hsl(var(--border) / 0.5)',
            borderBottom: '1px solid hsl(var(--border) / 0.5)',
          }}
        >
          {/* Ambient */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '700px',
              height: '300px',
              background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.09) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
            className="relative z-10 flex flex-col items-center gap-5 text-center"
          >
            <div
              className="inline-flex items-center justify-center rounded-full"
              style={{
                width: '56px',
                height: '56px',
                background: 'hsl(var(--primary) / 0.12)',
                border: '1px solid hsl(var(--primary) / 0.25)',
                fontSize: '24px',
              }}
            >
              🏮
            </div>
            <div>
              <h2
                className="m-0 mb-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'hsl(var(--foreground))',
                  fontSize: 'clamp(20px, 3.5vw, 30px)',
                  fontWeight: 700,
                }}
              >
                {home.cart.ctaSubtext}
              </h2>
              <p
                className="m-0"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'hsl(var(--muted-foreground))',
                  fontSize: '14px',
                  maxWidth: '400px',
                  margin: '0 auto',
                  lineHeight: 1.65,
                }}
              >
                Join our Telegram community for updates, promos, and support.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <motion.a
                href={home.hero.mainChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: '0 0 28px hsl(var(--primary) / 0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full"
                style={{
                  background: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  padding: '13px 30px',
                  minHeight: '50px',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                {home.cart.ctaLabel}
              </motion.a>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 rounded-full"
                  style={{
                    background: 'transparent',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--secondary))',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '15px',
                    padding: '13px 26px',
                    minHeight: '50px',
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                  }}
                >
                  Shop Now <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}
