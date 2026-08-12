import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ShoppingBag, Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/lib/cart-context';
import { cart as cartContent } from 'virtual:content';

const siteUrl = 'https://etherealpsyche.com';

type CheckoutStep = 'cart' | 'email' | 'processing' | 'success' | 'error';

export default function CartPage() {
  const { items, removeItem, clearCart, total } = useCart();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [webhookPayload, setWebhookPayload] = useState<Record<string, unknown> | null>(null);

  const showWebhookPayload = Boolean(webhookPayload && cartContent.success.webhookLabel);
  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  async function handleCheckout() {
    if (!isValidEmail(deliveryEmail)) return;
    setStep('processing');
    setErrorMsg('');

    try {
      const cartItems = items.map((i) => ({ item: i.name, price: i.price }));

      // 1. Dispatch Paymongo checkout webhook
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName || undefined,
          delivery_email: deliveryEmail,
          cart_items: cartItems,
          total_amount: total,
          currency: 'PHP',
        }),
      });

      const data = await resp.json() as { error?: string; webhookPayload?: Record<string, unknown> };
      if (!resp.ok) throw new Error(data.error || 'Checkout failed.');

      setWebhookPayload(data.webhookPayload ?? null);

      // 2. Send order confirmation email to customer
      await fetch('/api/fulfillment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery_email: deliveryEmail,
          customer_name: customerName || undefined,
          cart_items: cartItems,
          total_amount: `₱${total.toFixed(2)}`,
        }),
      });

      clearCart();
      setStep('success');
    } catch (err) {
      setErrorMsg(String(err));
      setStep('error');
    }
  }

  return (
    <>
      <Helmet>
        <title>Moonlit Satchel — Ethereal Psyche</title>
        <meta name="description" content="Review your moonlit satchel and complete your order." />
        <link rel="canonical" href={`${siteUrl}/cart`} />
        <meta name="robots" content="noindex" />
      </Helmet>

      <main style={{ minHeight: '80vh', padding: '52px 24px 88px', background: 'hsl(var(--background))' }}>
        <div className="mx-auto" style={{ maxWidth: '640px' }}>

          {/* ── HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <motion.p
              className="m-0 mb-3"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as const }}
              style={{ fontSize: '36px', filter: 'drop-shadow(0 0 16px hsl(var(--primary) / 0.4))' }}
            >
              🌙
            </motion.p>
            <h1
              className="m-0 mb-2"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'hsl(var(--foreground))',
                fontSize: 'clamp(24px, 5vw, 38px)',
                fontWeight: 700,
              }}
            >
              {cartContent.hero.title}
            </h1>
            <p
              className="m-0"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'hsl(var(--muted-foreground))',
                fontSize: '14px',
                lineHeight: 1.6,
              }}
            >
              {cartContent.hero.subtitle}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">

            {/* ── STEP: CART ── */}
            {step === 'cart' && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-5 rounded-2xl text-center"
                    style={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      padding: '56px 24px',
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: '72px',
                        height: '72px',
                        background: 'hsl(var(--muted))',
                        border: '1px solid hsl(var(--border))',
                      }}
                    >
                      <ShoppingBag size={32} style={{ color: 'hsl(var(--muted-foreground))', opacity: 0.4 }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '18px', fontWeight: 600, margin: '0 0 6px' }}>
                        Your satchel is empty
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '14px', margin: 0 }}>
                        {cartContent.empty.message}
                      </p>
                    </div>
                    <Link
                      to="/catalog"
                      className="inline-flex items-center gap-2 rounded-full"
                      style={{
                        background: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '14px',
                        padding: '12px 28px',
                        minHeight: '46px',
                        textDecoration: 'none',
                        boxShadow: '0 0 16px hsl(var(--primary) / 0.25)',
                      }}
                    >
                      {cartContent.empty.browseCta}
                    </Link>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Item list */}
                    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}>
                      {/* Top shimmer */}
                      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)' }} />
                      {items.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center justify-between"
                          style={{
                            padding: '16px 20px',
                            borderBottom: i < items.length - 1 ? '1px solid hsl(var(--border) / 0.5)' : 'none',
                          }}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '16px', fontWeight: 600 }}>
                              {item.name}
                            </span>
                            <span style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '12px', letterSpacing: '0.04em' }}>
                              {item.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--primary))', fontSize: '18px', fontWeight: 700 }}>
                              {item.priceDisplay}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.id)}
                              style={{ background: 'transparent', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', padding: '6px', opacity: 0.5, transition: 'opacity 0.15s' }}
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={15} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Total */}
                    <div
                      className="flex items-center justify-between rounded-xl"
                      style={{ background: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))', padding: '16px 20px' }}
                    >
                      <span style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '14px' }}>Total</span>
                      <span style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '26px', fontWeight: 700 }}>
                        ₱{total.toFixed(2)}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 24px hsl(var(--primary) / 0.35)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('email')}
                      className="w-full rounded-full flex items-center justify-center gap-2"
                      style={{
                        background: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '16px',
                        padding: '16px',
                        minHeight: '54px',
                        border: 'none',
                        cursor: 'pointer',
                        letterSpacing: '0.04em',
                        boxShadow: '0 0 16px hsl(var(--primary) / 0.2)',
                      }}
                    >
                      Proceed to Checkout 🌌
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── STEP: EMAIL ── */}
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-5"
              >
                <div
                  className="rounded-2xl"
                  style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', padding: '28px 24px' }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <Mail size={20} style={{ color: 'hsl(var(--primary))' }} />
                    <h2 className="m-0" style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '20px', fontWeight: 700 }}>
                      {cartContent.email.heading}
                    </h2>
                  </div>

                  <p className="m-0 mb-5" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '14px', lineHeight: 1.65 }}>
                    {cartContent.email.body}
                  </p>

                  {/* Name */}
                  <div className="flex flex-col gap-1.5 mb-4">
                    <label htmlFor="customer-name" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--secondary))', fontSize: '13px' }}>
                      Your name <span style={{ opacity: 0.5 }}>(optional)</span>
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={cartContent.email.namePlaceholder}
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

                  {/* Email */}
                  <div className="flex flex-col gap-1.5 mb-5">
                    <label htmlFor="delivery-email" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--secondary))', fontSize: '13px' }}>
                      Delivery email <span style={{ color: 'hsl(var(--primary))' }}>*</span>
                    </label>
                    <input
                      id="delivery-email"
                      type="email"
                      value={deliveryEmail}
                      onChange={(e) => setDeliveryEmail(e.target.value)}
                      placeholder={cartContent.email.emailPlaceholder}
                      className="w-full rounded-xl"
                      style={{
                        background: 'hsl(var(--background))',
                        border: `1px solid ${isValidEmail(deliveryEmail) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                        color: 'hsl(var(--foreground))',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '15px',
                        padding: '12px 16px',
                        minHeight: '48px',
                        outline: 'none',
                      }}
                    />
                    {isValidEmail(deliveryEmail) && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="m-0" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--primary))', fontSize: '13px' }}>
                        Delivering to <strong>{deliveryEmail}</strong> — {cartContent.email.confirmText}
                      </motion.p>
                    )}
                  </div>

                  {/* Order summary mini */}
                  <div className="rounded-xl mb-5" style={{ background: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))', padding: '14px 16px' }}>
                    <p className="m-0 mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Order summary
                    </p>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--foreground))', fontSize: '14px' }}>{item.name}</span>
                        <span style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--primary))', fontSize: '14px', fontWeight: 700 }}>{item.priceDisplay}</span>
                      </div>
                    ))}
                    <div className="flex justify-between mt-2" style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--secondary))', fontSize: '14px', fontWeight: 600 }}>Total</span>
                      <span style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '16px', fontWeight: 700 }}>₱{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      disabled={!isValidEmail(deliveryEmail)}
                      className="w-full rounded-full"
                      style={{
                        background: isValidEmail(deliveryEmail) ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                        color: isValidEmail(deliveryEmail) ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '16px',
                        padding: '16px',
                        minHeight: '52px',
                        border: 'none',
                        cursor: isValidEmail(deliveryEmail) ? 'pointer' : 'not-allowed',
                        letterSpacing: '0.04em',
                        transition: 'all 0.2s',
                      }}
                    >
                      {cartContent.email.submitCta}
                    </motion.button>
                    <button
                      onClick={() => setStep('cart')}
                      style={{ background: 'transparent', border: 'none', color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-sans)', fontSize: '13px', cursor: 'pointer', padding: '8px' }}
                    >
                      {cartContent.email.backLabel}
                    </button>
                  </div>
                </div>

                {/* Reminders */}
                <div className="rounded-2xl" style={{ background: 'hsl(var(--card) / 0.6)', border: '1px solid hsl(var(--border))', padding: '20px' }}>
                  <p className="m-0 mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--secondary))', fontSize: '13px', letterSpacing: '0.04em' }}>
                    {cartContent.reminders.title}
                  </p>
                  <div className="flex flex-col gap-2">
                    {cartContent.reminders.lines.map((r, i) => (
                      <p key={i} className="m-0" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '12px', lineHeight: 1.65 }}>
                        〰 {r}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP: PROCESSING ── */}
            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 text-center"
                style={{ padding: '60px 24px' }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' as const }}
                >
                  <Loader2 size={40} style={{ color: 'hsl(var(--primary))' }} />
                </motion.div>
                <div>
                  <p style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '20px', margin: '0 0 8px' }}>
                    {cartContent.processing.heading}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '14px', margin: 0 }}>
                    {cartContent.processing.body}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── STEP: SUCCESS ── */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, type: 'spring', stiffness: 200, damping: 20 }}
                className="flex flex-col gap-5"
              >
                <div
                  className="flex flex-col items-center gap-5 rounded-2xl text-center relative overflow-hidden"
                  style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--primary) / 0.4)', padding: '44px 24px' }}
                >
                  {/* Top shimmer */}
                  <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), transparent)' }} />
                  {/* Glow */}
                  <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.15) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />

                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: '72px',
                      height: '72px',
                      background: 'hsl(var(--primary) / 0.12)',
                      border: '1px solid hsl(var(--primary) / 0.3)',
                    }}
                  >
                    <CheckCircle2 size={36} style={{ color: 'hsl(var(--primary))' }} />
                  </motion.div>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '24px', fontWeight: 700, margin: '0 0 8px' }}>
                      {cartContent.success.heading}
                    </h2>
                    <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '14px', lineHeight: 1.65, margin: 0 }}>
                      {cartContent.success.body}{' '}
                      <strong style={{ color: 'hsl(var(--primary))' }}>{deliveryEmail}</strong>.
                    </p>
                  </div>
                </div>

                {/* Webhook payload display */}
                {showWebhookPayload && (
                  <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid hsl(var(--border))' }}>
                    <div style={{ background: 'hsl(var(--muted))', padding: '10px 16px', borderBottom: '1px solid hsl(var(--border))' }}>
                      <p className="m-0" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {cartContent.success.webhookLabel}
                      </p>
                    </div>
                    <pre style={{ background: 'hsl(var(--card))', color: 'hsl(var(--secondary))', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.6, padding: '16px', margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {JSON.stringify(webhookPayload, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Reminders */}
                <div className="rounded-2xl" style={{ background: 'hsl(var(--card) / 0.6)', border: '1px solid hsl(var(--border))', padding: '20px' }}>
                  <p className="m-0 mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--secondary))', fontSize: '13px', letterSpacing: '0.04em' }}>
                    {cartContent.reminders.title}
                  </p>
                  <div className="flex flex-col gap-2">
                    {cartContent.reminders.lines.map((r, i) => (
                      <p key={i} className="m-0" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '12px', lineHeight: 1.65 }}>
                        〰 {r}
                      </p>
                    ))}
                  </div>
                </div>

                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center gap-2 rounded-full w-full"
                  style={{ background: 'transparent', border: '1px solid hsl(var(--border))', color: 'hsl(var(--secondary))', fontFamily: 'var(--font-sans)', fontSize: '14px', padding: '14px', minHeight: '48px', textDecoration: 'none', textAlign: 'center' }}
                >
                  {cartContent.success.continueCta}
                </Link>
              </motion.div>
            )}

            {/* ── STEP: ERROR ── */}
            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                <div
                  className="flex flex-col items-center gap-4 rounded-2xl text-center"
                  style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', padding: '36px 24px' }}
                >
                  <AlertCircle size={40} style={{ color: 'hsl(var(--muted-foreground))' }} />
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>
                      {cartContent.error.heading}
                    </h2>
                    <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '14px', margin: 0 }}>
                      {errorMsg || cartContent.error.fallback}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep('email')}
                    className="rounded-full"
                    style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', fontFamily: 'var(--font-sans)', fontSize: '14px', padding: '12px 28px', minHeight: '44px', border: 'none', cursor: 'pointer' }}
                  >
                    {cartContent.error.retryCta}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
