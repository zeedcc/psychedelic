import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Check, ArrowRight, Send } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { catalog } from 'virtual:content';
import { useCart } from '@/lib/cart-context';

const siteUrl = 'https://etherealpsyche.com';

function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
}

// ── Star field (reused) ───────────────────────────────────────────────────

function StarField() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: (i * 41 + 17) % 100,
    y: (i * 59 + 11) % 100,
    size: i % 4 === 0 ? 2 : 1,
    delay: (i * 0.19) % 4,
    duration: 2.5 + (i % 3),
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, background: 'hsl(var(--primary))' }}
          animate={{ opacity: [0.08, 0.5, 0.08] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' as const }}
        />
      ))}
    </div>
  );
}

export default function CatalogPage() {
  const { addItem, items: cartItems } = useCart();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleCategories = catalog.categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        if (!normalizedQuery) return true;
        const haystack = [item.name, item.description, item.type, item.badge]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      }),
    }))
    .filter((category) => !normalizedQuery || category.items.length > 0);

  function handleAdd(item: typeof catalog.categories[0]['items'][0]) {
    addItem({
      id: item.id,
      name: item.name,
      price: parsePrice(item.price),
      priceDisplay: item.price,
      type: item.type,
    });
    setJustAdded((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setJustAdded((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 1800);
  }

  const inCart = (id: string) => cartItems.some((c) => c.id === id);

  return (
    <>
      <Helmet>
        <title>Premium Digital Subscriptions Philippines — Ethereal Psyche Catalog</title>
        <meta name="description" content="Browse 100+ affordable premium accounts in the Philippines — Netflix, Spotify, ChatGPT, Canva, Grammarly, Disney+, Adobe &amp; more. Shared &amp; solo. PHP pricing." />
        <link rel="canonical" href={`${siteUrl}/catalog`} />
        <meta property="og:title" content="Premium Digital Subscriptions Philippines — Ethereal Psyche Catalog" />
        <meta property="og:description" content="Browse 100+ affordable premium accounts — Netflix, Spotify, ChatGPT, Canva, Grammarly &amp; more. Shared &amp; solo. PHP pricing, fast email delivery." />
        <meta property="og:image" content={`${siteUrl}/og-image.svg`} />
        <meta property="og:url" content={`${siteUrl}/catalog`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Premium Digital Subscriptions Philippines — Ethereal Psyche Catalog" />
        <meta name="twitter:description" content="Browse 100+ affordable premium accounts — Netflix, Spotify, ChatGPT, Canva &amp; more. PHP pricing, fast email delivery." />
        <meta name="twitter:image" content={`${siteUrl}/og-image.svg`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${siteUrl}/catalog#webpage`,
          name: 'Premium Digital Subscriptions Philippines — Ethereal Psyche Catalog',
          description: 'Browse 100+ affordable premium accounts in the Philippines — Netflix, Spotify, ChatGPT, Canva, Grammarly, Disney+ and more.',
          url: `${siteUrl}/catalog`,
          isPartOf: { '@id': `${siteUrl}/#website` },
          about: { '@id': `${siteUrl}/#organization` },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
              { '@type': 'ListItem', position: 2, name: 'Catalog', item: `${siteUrl}/catalog` },
            ],
          },
        })}</script>
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden text-center"
          style={{
            background: 'radial-gradient(ellipse 120% 80% at 50% 0%, hsl(var(--muted)) 0%, hsl(var(--background)) 65%)',
            padding: '80px 24px 64px',
          }}
        >
          <StarField />

          {/* Ambient orbs */}
          <motion.div
            className="pointer-events-none absolute rounded-full"
            style={{ width: 350, height: 350, top: '-80px', left: '-80px', background: 'radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
          />
          <motion.div
            className="pointer-events-none absolute rounded-full"
            style={{ width: 280, height: 280, bottom: '-50px', right: '-50px', background: 'radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)', filter: 'blur(50px)' }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 7, delay: 2, repeat: Infinity, ease: 'easeInOut' as const }}
          />

          <div className="relative z-10 mx-auto" style={{ maxWidth: '620px' }}>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full mb-5"
              style={{
                background: 'hsl(var(--primary) / 0.1)',
                border: '1px solid hsl(var(--primary) / 0.25)',
                padding: '5px 14px',
                fontFamily: 'var(--font-sans)',
                color: 'hsl(var(--primary))',
                fontSize: '11px',
                letterSpacing: '0.08em',
              }}
            >
              ✦ {catalog.hero.eyebrow}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="m-0 mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'hsl(var(--foreground))',
                fontSize: 'clamp(28px, 5.5vw, 46px)',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {catalog.hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="m-0 mb-7"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'hsl(var(--muted-foreground))',
                fontSize: '15px',
                lineHeight: 1.7,
              }}
            >
              {catalog.hero.subtitle}
            </motion.p>

            {/* Action links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <motion.a
                href={catalog.mainChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: '0 0 20px hsl(var(--primary) / 0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full"
                style={{
                  background: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  padding: '10px 22px',
                  minHeight: '44px',
                  textDecoration: 'none',
                  letterSpacing: '0.03em',
                  boxShadow: '0 0 14px hsl(var(--primary) / 0.2)',
                }}
              >
                <Send size={13} /> Main Channel
              </motion.a>
              <motion.a
                href={catalog.rulesUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full"
                style={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--secondary))',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  padding: '10px 22px',
                  minHeight: '44px',
                  textDecoration: 'none',
                  letterSpacing: '0.03em',
                }}
              >
                📜 Community Rules
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* ── CATALOG ── */}
        <section
          className="relative"
          style={{ padding: '64px 24px 88px', background: 'hsl(var(--background))' }}
        >
          <div className="mx-auto" style={{ maxWidth: '960px' }}>
            <div className="mx-auto mb-8" style={{ maxWidth: '620px' }}>
              <label htmlFor="catalog-search" className="mb-2 block" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
                Search catalog
              </label>
              <input
                id="catalog-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products, categories, or perks"
                className="w-full rounded-full border"
                style={{
                  background: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  padding: '14px 18px',
                  minHeight: '52px',
                  outline: 'none',
                }}
              />
            </div>

            {visibleCategories.length === 0 && normalizedQuery ? (
              <div className="rounded-2xl border text-center" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', padding: '32px 20px' }}>
                <p className="m-0" style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '20px' }}>
                  No matches found
                </p>
                <p className="mt-2 mb-0" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '14px' }}>
                  Try another keyword or browse the full catalog.
                </p>
              </div>
            ) : null}

            {visibleCategories.map((category, catIdx) => (
              <div key={category.id} style={{ marginBottom: catIdx < visibleCategories.length - 1 ? '72px' : 0 }}>
                {/* Category header */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: 'easeOut' as const }}
                  className="mb-7 flex items-end justify-between"
                  style={{ borderBottom: '1px solid hsl(var(--border) / 0.6)', paddingBottom: '16px' }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ color: 'hsl(var(--primary))', fontSize: '14px' }}>✦</span>
                      <h2
                        className="m-0"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: 'hsl(var(--foreground))',
                          fontSize: 'clamp(18px, 3vw, 26px)',
                          fontWeight: 700,
                        }}
                      >
                        {category.name}
                      </h2>
                    </div>
                    <p
                      className="m-0"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        color: 'hsl(var(--muted-foreground))',
                        fontSize: '13px',
                        lineHeight: 1.6,
                      }}
                    >
                      {category.description}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: 'hsl(var(--muted-foreground))',
                      fontSize: '12px',
                      flexShrink: 0,
                      marginLeft: '16px',
                    }}
                  >
                    {category.items.length} item{category.items.length !== 1 ? 's' : ''}
                  </span>
                </motion.div>

                {/* Items grid */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2"
                  style={{ gap: '16px' }}
                >
                  {category.items.map((item, itemIdx) => {
                    const added = inCart(item.id);
                    const justAddedNow = justAdded.has(item.id);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: itemIdx * 0.08, ease: 'easeOut' as const }}
                        whileHover={{ y: -4, boxShadow: '0 8px 36px hsl(var(--primary) / 0.18)' }}
                        className="relative flex flex-col rounded-2xl group card-hover"
                        style={{
                          background: 'hsl(var(--card))',
                          border: added ? '1px solid hsl(var(--primary) / 0.4)' : '1px solid hsl(var(--border))',
                          padding: '24px',
                          gap: '12px',
                          transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                        }}
                      >
                        {/* Top shimmer */}
                        <div
                          className="pointer-events-none absolute top-0 left-8 right-8 h-px"
                          style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.25), transparent)' }}
                        />
                        {/* Hover inner glow */}
                        <div
                          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: 'radial-gradient(ellipse at top, hsl(var(--primary) / 0.06) 0%, transparent 60%)' }}
                        />

                        {/* Badge + type row */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span
                            style={{
                              fontFamily: 'var(--font-sans)',
                              color: 'hsl(var(--muted-foreground))',
                              fontSize: '11px',
                              letterSpacing: '0.07em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {item.type}
                          </span>
                          {item.badge ? (
                            <motion.span
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="rounded-full"
                              style={{
                                background: 'hsl(var(--primary) / 0.15)',
                                border: '1px solid hsl(var(--primary) / 0.3)',
                                color: 'hsl(var(--primary))',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '10px',
                                padding: '3px 10px',
                                letterSpacing: '0.05em',
                                boxShadow: '0 0 8px hsl(var(--primary) / 0.15)',
                              }}
                            >
                              ✦ {item.badge}
                            </motion.span>
                          ) : null}
                        </div>

                        {/* Name */}
                        <h3
                          className="relative z-10 m-0"
                          style={{
                            fontFamily: 'var(--font-heading)',
                            color: 'hsl(var(--foreground))',
                            fontSize: '20px',
                            fontWeight: 700,
                            lineHeight: 1.3,
                          }}
                        >
                          {item.name}
                        </h3>

                        {/* Description */}
                        <p
                          className="relative z-10 m-0 flex-1"
                          style={{
                            fontFamily: 'var(--font-sans)',
                            color: 'hsl(var(--muted-foreground))',
                            fontSize: '14px',
                            lineHeight: 1.65,
                          }}
                        >
                          {item.description}
                        </p>

                        {/* Price + CTA */}
                        <div
                          className="relative z-10 flex items-center justify-between mt-1 pt-3"
                          style={{ borderTop: '1px solid hsl(var(--border) / 0.5)' }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-heading)',
                              color: 'hsl(var(--primary))',
                              fontSize: '24px',
                              fontWeight: 700,
                            }}
                          >
                            {item.price}
                          </span>
                          <motion.button
                            whileHover={{ scale: added ? 1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAdd(item)}
                            className="inline-flex items-center gap-2 rounded-full transition-all duration-200"
                            style={{
                              background: added
                                ? 'hsl(var(--primary) / 0.15)'
                                : 'hsl(var(--primary))',
                              border: added
                                ? '1px solid hsl(var(--primary) / 0.4)'
                                : '1px solid transparent',
                              color: added
                                ? 'hsl(var(--primary))'
                                : 'hsl(var(--primary-foreground))',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '13px',
                              padding: '10px 18px',
                              minHeight: '42px',
                              cursor: 'pointer',
                              letterSpacing: '0.03em',
                              boxShadow: added ? 'none' : '0 0 12px hsl(var(--primary) / 0.2)',
                            }}
                          >
                            <AnimatePresence mode="wait">
                              {justAddedNow ? (
                                <motion.span
                                  key="added"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="flex items-center gap-1.5"
                                >
                                  <Check size={13} /> Added!
                                </motion.span>
                              ) : added ? (
                                <motion.span
                                  key="in-cart"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex items-center gap-1.5"
                                >
                                  <Check size={13} /> In Satchel
                                </motion.span>
                              ) : (
                                <motion.span
                                  key="add"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex items-center gap-1.5"
                                >
                                  <ShoppingBag size={13} /> Add to Satchel
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        </div>

                        {/* Rules link */}
                        <div className="relative z-10" style={{ borderTop: '1px solid hsl(var(--border) / 0.4)', paddingTop: '10px' }}>
                          <a
                            href={catalog.rulesUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontFamily: 'var(--font-sans)',
                              color: 'hsl(var(--muted-foreground))',
                              fontSize: '12px',
                              textDecoration: 'none',
                              opacity: 0.6,
                              transition: 'opacity 0.15s',
                            }}
                          >
                            📜 Read rules before purchasing
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── REMINDERS ── */}
        <section
          style={{
            padding: '52px 24px 72px',
            background: 'hsl(var(--muted))',
            borderTop: '1px solid hsl(var(--border) / 0.5)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto rounded-2xl"
            style={{
              maxWidth: '640px',
              background: 'hsl(var(--card) / 0.5)',
              border: '1px solid hsl(var(--border) / 0.6)',
              padding: '28px 28px',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Top shimmer */}
            <div
              className="absolute top-0 left-8 right-8 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.2), transparent)' }}
            />
            <p
              className="m-0 mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'hsl(var(--secondary))',
                fontSize: '14px',
                letterSpacing: '0.05em',
              }}
            >
              {catalog.reminders.title}
            </p>
            <div className="flex flex-col gap-2.5">
              {catalog.reminders.lines.map((line, i) => (
                <p
                  key={i}
                  className="m-0 flex items-start gap-2"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'hsl(var(--muted-foreground) / 0.8)',
                    fontSize: '13px',
                    lineHeight: 1.65,
                  }}
                >
                  <span style={{ color: 'hsl(var(--primary) / 0.5)', flexShrink: 0, marginTop: '2px' }}>〰</span>
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* Floating satchel button */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={() => navigate('/cart')}
            className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full"
            style={{
              background: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              padding: '14px 24px',
              minHeight: '52px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 28px hsl(var(--primary) / 0.45)',
              letterSpacing: '0.03em',
            }}
          >
            🌙 Satchel ({cartItems.length}) <ArrowRight size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
