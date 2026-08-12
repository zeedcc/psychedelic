import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

const navLinks = [
  { label: 'Catalog', href: '/catalog' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'hsl(var(--background) / 0.85)'
          : 'hsl(var(--background) / 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid hsl(var(--border))'
          : '1px solid hsl(var(--border) / 0.4)',
        boxShadow: scrolled
          ? '0 4px 32px hsl(var(--background) / 0.6)'
          : 'none',
      }}
    >
      <div
        className="mx-auto flex items-center justify-between"
        style={{ maxWidth: '1200px', padding: '0 24px', height: '64px' }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 no-underline group"
          style={{ textDecoration: 'none' }}
        >
          <motion.img
            src="/airo-assets/images/logo/horizontal"
            alt="Ethereal Psyche"
            className="block h-auto w-auto object-contain self-center"
            style={{ maxHeight: '38px', maxWidth: '160px' }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className="relative no-underline transition-colors duration-200"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  paddingBottom: '2px',
                }}
              >
                {link.label}
                <motion.span
                  className="absolute bottom-0 left-0 h-px"
                  style={{
                    background: 'hsl(var(--primary))',
                    originX: 0,
                    width: '100%',
                    display: 'block',
                  }}
                  initial={{ scaleX: isActive ? 1 : 0 }}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25, ease: 'easeOut' as const }}
                />
              </Link>
            );
          })}

          {/* Cart icon */}
          <Link
            to="/cart"
            className="relative inline-flex items-center justify-center rounded-full transition-all duration-200"
            style={{
              color: location.pathname === '/cart' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
              textDecoration: 'none',
              width: '40px',
              height: '40px',
              background: count > 0 ? 'hsl(var(--primary) / 0.1)' : 'transparent',
              border: count > 0 ? '1px solid hsl(var(--primary) / 0.25)' : '1px solid transparent',
            }}
            aria-label={`Moonlit Satchel — ${count} item${count !== 1 ? 's' : ''}`}
          >
            <ShoppingBag size={18} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full"
                  style={{
                    background: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    fontSize: '9px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    width: '17px',
                    height: '17px',
                    lineHeight: 1,
                    boxShadow: '0 0 8px hsl(var(--primary) / 0.5)',
                  }}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </nav>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/cart"
            className="relative inline-flex items-center justify-center rounded-full"
            style={{
              color: 'hsl(var(--secondary))',
              textDecoration: 'none',
              width: '40px',
              height: '40px',
            }}
            aria-label={`Satchel — ${count} items`}
          >
            <ShoppingBag size={18} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 flex items-center justify-center rounded-full"
                  style={{
                    background: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    fontSize: '9px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    width: '16px',
                    height: '16px',
                  }}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            className="flex items-center justify-center rounded-xl transition-colors duration-200"
            style={{
              background: menuOpen ? 'hsl(var(--muted))' : 'transparent',
              border: 'none',
              color: 'hsl(var(--secondary))',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
            }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' as const }}
            className="overflow-hidden md:hidden"
            style={{
              background: 'hsl(var(--background) / 0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid hsl(var(--border) / 0.5)',
            }}
          >
            <div className="flex flex-col" style={{ padding: '8px 24px 16px' }}>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center no-underline"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '16px',
                      color: location.pathname === link.href ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                      textDecoration: 'none',
                      padding: '14px 0',
                      borderBottom: '1px solid hsl(var(--border) / 0.4)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
