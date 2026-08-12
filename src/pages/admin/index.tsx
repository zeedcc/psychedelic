import { Helmet } from '@dr.pogodin/react-helmet';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package, ShoppingBag, LogOut, Plus, Pencil, Trash2,
  ChevronDown, ChevronUp, Loader2, CheckCircle2, XCircle,
  RefreshCw, Mail,
} from 'lucide-react';
import { authClient } from '@/lib/auth/auth-client';

// ── Types ──────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  badge: string | null;
  type: string;
  category: string;
  active: boolean;
  createdAt: string;
}

interface OrderItem {
  id: number;
  productName: string;
  price: string;
}

interface Order {
  id: number;
  deliveryEmail: string;
  customerName: string | null;
  totalAmount: string;
  currency: string;
  status: string;
  webhookDispatched: boolean;
  createdAt: string;
  items: OrderItem[];
}

type Tab = 'products' | 'orders';

const STATUS_COLORS: Record<string, string> = {
  pending: 'hsl(var(--primary))',
  processing: 'hsl(var(--accent))',
  delivered: 'hsl(var(--secondary))',
  cancelled: 'hsl(var(--destructive))',
};

// ── Product Form ───────────────────────────────────────────────────────────

interface ProductFormProps {
  initial?: Partial<Product>;
  onSave: (data: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}

function ProductForm({ initial, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState(initial?.price ?? '');
  const [badge, setBadge] = useState(initial?.badge ?? '');
  const [type, setType] = useState(initial?.type ?? 'Shared Premium');
  const [category, setCategory] = useState(initial?.category ?? 'Entertainment Premiums');
  const [active, setActive] = useState(initial?.active !== false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) { setError('Name and price are required'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave({ name, description: description || null, price, badge: badge || null, type, category, active });
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    color: 'hsl(var(--foreground))',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    padding: '10px 14px',
    minHeight: '44px',
    outline: 'none',
    borderRadius: '10px',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    color: 'hsl(var(--secondary))',
    fontSize: '12px',
    marginBottom: '4px',
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="flex flex-col">
          <label style={labelStyle}>Name *</label>
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" required />
        </div>
        <div className="flex flex-col">
          <label style={labelStyle}>Price (₱) *</label>
          <input style={inputStyle} type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="299" required />
        </div>
      </div>

      <div className="flex flex-col">
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description..." />
      </div>

      <div className="grid grid-cols-1 gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div className="flex flex-col">
          <label style={labelStyle}>Badge</label>
          <input style={inputStyle} value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Popular, Exclusive…" />
        </div>
        <div className="flex flex-col">
          <label style={labelStyle}>Type</label>
          <select style={inputStyle} value={type} onChange={(e) => setType(e.target.value)}>
            <option>Shared Premium</option>
            <option>Exclusive</option>
            <option>Digital File</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label style={labelStyle}>Category</label>
          <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Entertainment Premiums</option>
            <option>Celestial Exclusives</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--secondary))', fontSize: '13px' }}>
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Active (visible in catalog)
      </label>

      {error && <p style={{ color: 'hsl(var(--destructive))', fontFamily: 'var(--font-sans)', fontSize: '13px', margin: 0 }}>{error}</p>}

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} style={{ background: 'transparent', border: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-sans)', fontSize: '13px', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer' }}>
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex items-center gap-1.5" style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', fontFamily: 'var(--font-sans)', fontSize: '13px', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────

export default function AdminPage() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!isPending && !session) navigate('/admin/login');
  }, [session, isPending, navigate]);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const r = await fetch('/api/admin/products');
      if (r.status === 401 || r.status === 403) { navigate('/admin/login'); return; }
      setProducts(await r.json());
    } finally {
      setLoadingProducts(false);
    }
  }, [navigate]);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const r = await fetch('/api/admin/orders');
      if (r.status === 401 || r.status === 403) { navigate('/admin/login'); return; }
      setOrders(await r.json());
    } finally {
      setLoadingOrders(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (session) {
      fetchProducts();
      fetchOrders();
    }
  }, [session, fetchProducts, fetchOrders]);

  async function handleSignOut() {
    await authClient.signOut();
    navigate('/admin/login');
  }

  async function handleAddProduct(data: Partial<Product>) {
    const r = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error((await r.json()).error);
    setShowAddForm(false);
    fetchProducts();
  }

  async function handleEditProduct(id: number, data: Partial<Product>) {
    const r = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error((await r.json()).error);
    setEditingId(null);
    fetchProducts();
  }

  async function handleDeleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  }

  async function handleStatusChange(orderId: number, status: string) {
    setStatusUpdating(orderId);
    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } finally {
      setStatusUpdating(null);
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '100vh', background: 'hsl(var(--background))' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
      </div>
    );
  }

  if (!session) return null;

  const cardStyle: React.CSSProperties = {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '16px',
  };

  const tabBtnStyle = (isActive: boolean): React.CSSProperties => ({
    background: isActive ? 'hsl(var(--primary))' : 'transparent',
    color: isActive ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.15s',
  });

  return (
    <>
      <Helmet>
        <title>Admin — Ethereal Psyche</title>
        <meta name="description" content="Admin dashboard for managing Ethereal Psyche products and orders." />
        <link rel="canonical" href="/admin" />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div style={{ minHeight: '100vh', background: 'hsl(var(--background))' }}>
        {/* Top bar */}
        <div style={{ background: 'hsl(var(--card))', borderBottom: '1px solid hsl(var(--border))', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '20px' }}>🌙</span>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '16px', fontWeight: 700, margin: 0 }}>
                Ethereal Psyche Admin
              </h1>
              <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '11px', margin: 0 }}>
                {session.user.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5"
            style={{ background: 'transparent', border: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-sans)', fontSize: '13px', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer' }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
          {/* Stats row */}
          <div className="grid mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Total Products', value: products.length, icon: <Package size={18} /> },
              { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={18} /> },
              { label: 'Delivery Emails', value: [...new Set(orders.map((o) => o.deliveryEmail))].length, icon: <Mail size={18} /> },
              { label: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length, icon: <CheckCircle2 size={18} /> },
            ].map((stat) => (
              <div key={stat.label} style={{ ...cardStyle, padding: '20px' }}>
                <div className="flex items-center gap-2 mb-1" style={{ color: 'hsl(var(--primary))' }}>
                  {stat.icon}
                  <span style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '12px' }}>{stat.label}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '28px', fontWeight: 700, margin: 0 }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-5">
            <button style={tabBtnStyle(tab === 'products')} onClick={() => setTab('products')}>
              <Package size={15} /> Products
            </button>
            <button style={tabBtnStyle(tab === 'orders')} onClick={() => setTab('orders')}>
              <ShoppingBag size={15} /> Orders
            </button>
          </div>

          <AnimatePresence mode="wait">

            {/* ── PRODUCTS TAB ── */}
            {tab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '18px', fontWeight: 700, margin: 0 }}>
                    Products
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={fetchProducts} style={{ background: 'transparent', border: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))', padding: '7px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                      <RefreshCw size={14} />
                    </button>
                    <button
                      onClick={() => { setShowAddForm(true); setEditingId(null); }}
                      className="flex items-center gap-1.5"
                      style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', fontFamily: 'var(--font-sans)', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                    >
                      <Plus size={14} /> Add Product
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showAddForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ ...cardStyle, padding: '20px', marginBottom: '16px', overflow: 'hidden' }}
                    >
                      <p style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '15px', fontWeight: 600, margin: '0 0 14px' }}>
                        New Product
                      </p>
                      <ProductForm onSave={handleAddProduct} onCancel={() => setShowAddForm(false)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {loadingProducts ? (
                  <div className="flex justify-center py-12">
                    <Loader2 size={28} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
                  </div>
                ) : products.length === 0 ? (
                  <div style={{ ...cardStyle, padding: '40px', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '14px', margin: 0 }}>
                      No products yet. Add your first product above.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {products.map((p) => (
                      <div key={p.id} style={cardStyle}>
                        {editingId === p.id ? (
                          <div style={{ padding: '20px' }}>
                            <p style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '15px', fontWeight: 600, margin: '0 0 14px' }}>
                              Edit: {p.name}
                            </p>
                            <ProductForm
                              initial={p}
                              onSave={(data) => handleEditProduct(p.id, data)}
                              onCancel={() => setEditingId(null)}
                            />
                          </div>
                        ) : (
                          <div className="flex items-start justify-between" style={{ padding: '16px 20px' }}>
                            <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: 0 }}>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '16px', fontWeight: 600 }}>
                                  {p.name}
                                </span>
                                {p.badge && (
                                  <span style={{ background: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))', fontFamily: 'var(--font-sans)', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', border: '1px solid hsl(var(--primary) / 0.3)' }}>
                                    {p.badge}
                                  </span>
                                )}
                                {!p.active && (
                                  <span style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-sans)', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '13px', margin: 0 }}>
                                {p.category} · {p.type}
                              </p>
                              {p.description && (
                                <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '12px', margin: 0, opacity: 0.7 }}>
                                  {p.description.slice(0, 100)}{p.description.length > 100 ? '…' : ''}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 ml-4" style={{ flexShrink: 0 }}>
                              <span style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--primary))', fontSize: '18px', fontWeight: 700 }}>
                                ₱{parseFloat(p.price).toFixed(2)}
                              </span>
                              <button onClick={() => setEditingId(p.id)} style={{ background: 'transparent', border: '1px solid hsl(var(--border))', color: 'hsl(var(--secondary))', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} style={{ background: 'transparent', border: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── ORDERS TAB ── */}
            {tab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))', fontSize: '18px', fontWeight: 700, margin: 0 }}>
                    Orders
                  </h2>
                  <button onClick={fetchOrders} style={{ background: 'transparent', border: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))', padding: '7px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                    <RefreshCw size={14} />
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="flex justify-center py-12">
                    <Loader2 size={28} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ ...cardStyle, padding: '40px', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '14px', margin: 0 }}>
                      No orders yet.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {orders.map((o) => (
                      <div key={o.id} style={cardStyle}>
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          style={{ padding: '16px 20px', borderBottom: expandedOrder === o.id ? '1px solid hsl(var(--border))' : 'none' }}
                          onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                        >
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '12px' }}>
                                #{o.id}
                              </span>
                              <span style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--foreground))', fontSize: '14px', fontWeight: 600 }}>
                                {o.customerName || 'Guest'}
                              </span>
                              <span style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '13px' }}>
                                <Mail size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                                {o.deliveryEmail}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                style={{
                                  background: 'hsl(var(--muted))',
                                  color: STATUS_COLORS[o.status] || 'hsl(var(--primary))',
                                  fontFamily: 'var(--font-sans)',
                                  fontSize: '11px',
                                  padding: '2px 10px',
                                  borderRadius: '20px',
                                  border: '1px solid hsl(var(--border))',
                                  textTransform: 'capitalize',
                                }}
                              >
                                {o.status}
                              </span>
                              {o.webhookDispatched ? (
                                <span style={{ color: 'hsl(var(--secondary))', fontSize: '11px', fontFamily: 'var(--font-sans)' }}>
                                  <CheckCircle2 size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
                                  webhook sent
                                </span>
                              ) : (
                                <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '11px', fontFamily: 'var(--font-sans)' }}>
                                  <XCircle size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
                                  webhook failed
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--primary))', fontSize: '18px', fontWeight: 700 }}>
                              ₱{parseFloat(o.totalAmount).toFixed(2)}
                            </span>
                            {expandedOrder === o.id
                              ? <ChevronUp size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
                              : <ChevronDown size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />}
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedOrder === o.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{ padding: '16px 20px' }}>
                                <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 8px' }}>
                                  Items
                                </p>
                                <div className="flex flex-col gap-1 mb-4">
                                  {o.items.map((item) => (
                                    <div key={item.id} className="flex justify-between">
                                      <span style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--foreground))', fontSize: '14px' }}>{item.productName}</span>
                                      <span style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--primary))', fontSize: '14px' }}>₱{parseFloat(item.price).toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>

                                <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 8px' }}>
                                  Update Status
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {['pending', 'processing', 'delivered', 'cancelled'].map((s) => (
                                    <button
                                      key={s}
                                      onClick={() => handleStatusChange(o.id, s)}
                                      disabled={o.status === s || statusUpdating === o.id}
                                      style={{
                                        background: o.status === s ? 'hsl(var(--muted))' : 'transparent',
                                        color: o.status === s ? STATUS_COLORS[s] || 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                                        border: '1px solid hsl(var(--border))',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '12px',
                                        padding: '5px 14px',
                                        borderRadius: '20px',
                                        cursor: o.status === s ? 'default' : 'pointer',
                                        textTransform: 'capitalize',
                                        opacity: statusUpdating === o.id ? 0.5 : 1,
                                      }}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>

                                <p style={{ fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', fontSize: '11px', margin: '12px 0 0' }}>
                                  Placed: {new Date(o.createdAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
