import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShoppingCart, Search, User, ChevronLeft, ChevronRight, X, Trash2, Plus, Minus, CreditCard, CheckCircle, Package, LogOut, Clock, ChevronDown, ChevronUp, Settings, Edit2, ToggleLeft, ToggleRight, ImagePlus } from 'lucide-react';
import { handleCheckout } from './stripe';
import './index.css';

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ADMIN_EMAIL = 'oparras95@gmail.com';
const categoriesData = ['TODOS', 'RIFTBOUND', 'ONE PIECE TCG', 'NARUTO TCG', 'ACCESSORIES', 'NOVEDADES', 'DISPLAYS'];
const bannerImages = [
  "/hero-riftbound.png",
  "https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?auto=format&fit=crop&q=80&w=2000"
];

// ─── THANK YOU PAGE ───────────────────────────────────────────────────────────
function ThankYouPage({ onBack }) {
  const lastOrder = JSON.parse(sessionStorage.getItem('last-order') || '[]');
  const orderTotal = lastOrder.reduce((acc, item) => acc + (item.pvp * item.qty), 0);
  const orderNumber = Math.floor(Math.random() * 900000) + 100000;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #0a0a0a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: '#fff' }}>
      <div style={{ marginBottom: '1.5rem' }}><CheckCircle size={72} color="#22c55e" strokeWidth={1.5} /></div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>¡PEDIDO CONFIRMADO!</h1>
      <p style={{ color: '#888', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Gracias por tu compra en <strong style={{ color: 'var(--accent-primary, #e8d5a3)' }}>Central TCG</strong></p>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '2rem' }}>Nº de pedido: <strong style={{ color: '#fff' }}>#{orderNumber}</strong></p>
      {lastOrder.length > 0 && (
        <div style={{ width: '100%', maxWidth: '480px', background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', color: '#888' }}>
            <Package size={16} /> RESUMEN DEL PEDIDO
          </div>
          <div style={{ padding: '1rem 1.5rem' }}>
            {lastOrder.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #1a1a1a' }}>
                <img src={item.img} alt={item.name} style={{ width: '52px', height: '52px', objectFit: 'contain', borderRadius: '6px', background: '#1a1a1a' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.name}</p>
                  <p style={{ color: '#888', fontSize: '0.8rem' }}>Cantidad: {item.qty}</p>
                </div>
                <span style={{ fontWeight: 700 }}>€{(item.pvp * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', fontWeight: 800 }}>
              <span>TOTAL PAGADO</span>
              <span style={{ color: 'var(--accent-primary, #e8d5a3)' }}>€{orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
      <div style={{ width: '100%', maxWidth: '480px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '2rem', fontSize: '0.88rem', color: '#aaa', lineHeight: '1.7' }}>
        📦 <strong style={{ color: '#fff' }}>Envío en 24-48h laborables.</strong> Recibirás un email de confirmación con el número de seguimiento en cuanto tu pedido salga de nuestro almacén.
      </div>
      <button onClick={onBack} style={{ padding: '0.9rem 2.5rem', background: 'var(--accent-primary, #e8d5a3)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
        SEGUIR COMPRANDO
      </button>
    </div>
  );
}

// ─── PANEL DE ADMINISTRACIÓN ──────────────────────────────────────────────────
function AdminPanel({ onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const emptyForm = { name: '', description: '', pvp: '', img: '', categories: [], condition: 'Nuevo/Sellado', active: true };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const saveProduct = async () => {
    const payload = { ...form, pvp: parseFloat(form.pvp) };
    if (editingProduct) {
      await supabase.from('products').update(payload).eq('id', editingProduct.id);
    } else {
      await supabase.from('products').insert(payload);
    }
    setEditingProduct(null);
    setIsAdding(false);
    setForm(emptyForm);
    loadProducts();
  };

  const toggleActive = async (product) => {
    await supabase.from('products').update({ active: !product.active }).eq('id', product.id);
    loadProducts();
  };

  const deleteProduct = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
  };

  const startEdit = (product) => {
    setForm({ ...product });
    setEditingProduct(product);
    setIsAdding(true);
  };

  const toggleCategory = (cat) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const inputStyle = { width: '100%', padding: '0.7rem 1rem', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', borderRadius: '6px', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: '#0a0a0a', overflowY: 'auto', color: '#fff' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, background: '#0a0a0a', borderBottom: '1px solid #1a1a1a', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#666', letterSpacing: '0.1em' }}>CENTRAL TCG</span>
          <h2 style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.06em' }}>PANEL DE ADMINISTRACIÓN</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => { setIsAdding(true); setEditingProduct(null); setForm(emptyForm); }}
            style={{ padding: '0.6rem 1.2rem', background: 'var(--accent-primary, #e8d5a3)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> NUEVO PRODUCTO
          </button>
          <button onClick={onClose} style={{ padding: '0.6rem 1rem', background: 'none', border: '1px solid #333', borderRadius: '6px', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
            <X size={16} /> CERRAR
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

        {/* FORMULARIO AÑADIR/EDITAR */}
        {isAdding && (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.08em', marginBottom: '1.25rem', color: '#888' }}>
              {editingProduct ? '✏️ EDITAR PRODUCTO' : '➕ NUEVO PRODUCTO'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' }}>NOMBRE</label>
                <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nombre del producto" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' }}>DESCRIPCIÓN</label>
                <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Descripción del producto" />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' }}>PRECIO (€)</label>
                <input style={inputStyle} type="number" step="0.01" value={form.pvp} onChange={e => setForm(p => ({ ...p, pvp: e.target.value }))} placeholder="0.00" />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' }}>CONDICIÓN</label>
                <select style={{ ...inputStyle, marginBottom: 0 }} value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))}>
                  <option value="Nuevo/Sellado">Nuevo/Sellado</option>
                  <option value="Usado">Usado</option>
                  <option value="Dañado">Dañado</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' }}>URL DE IMAGEN</label>
                <input style={inputStyle} value={form.img} onChange={e => setForm(p => ({ ...p, img: e.target.value }))} placeholder="https://..." />
                {form.img && <img src={form.img} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '6px', background: '#1a1a1a', marginBottom: '0.75rem' }} />}
              </div>
            </div>

            <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.5rem' }}>CATEGORÍAS</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {categoriesData.filter(c => c !== 'TODOS').map(cat => (
                <button key={cat} onClick={() => toggleCategory(cat)}
                  style={{ padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: form.categories.includes(cat) ? 'var(--accent-primary, #e8d5a3)' : 'transparent', color: form.categories.includes(cat) ? '#000' : '#666', borderColor: form.categories.includes(cat) ? 'var(--accent-primary, #e8d5a3)' : '#333' }}>
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={saveProduct} style={{ padding: '0.75rem 1.5rem', background: 'var(--accent-primary, #e8d5a3)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
                {editingProduct ? 'GUARDAR CAMBIOS' : 'AÑADIR PRODUCTO'}
              </button>
              <button onClick={() => { setIsAdding(false); setEditingProduct(null); setForm(emptyForm); }}
                style={{ padding: '0.75rem 1.5rem', background: 'none', border: '1px solid #333', borderRadius: '6px', color: '#888', fontSize: '0.85rem', cursor: 'pointer' }}>
                CANCELAR
              </button>
            </div>
          </div>
        )}

        {/* LISTA DE PRODUCTOS */}
        <div style={{ fontSize: '0.75rem', color: '#666', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          {products.length} PRODUCTOS EN TOTAL
        </div>

        {loading ? (
          <p style={{ color: '#555', textAlign: 'center', padding: '3rem' }}>Cargando productos...</p>
        ) : (
          products.map(product => (
            <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#111', border: `1px solid ${product.active ? '#222' : '#1a1a1a'}`, borderRadius: '10px', marginBottom: '0.75rem', opacity: product.active ? 1 : 0.5 }}>
              <img src={product.img} alt={product.name} style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '6px', background: '#1a1a1a', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(product.categories || []).map(cat => (
                    <span key={cat} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', background: '#1a1a1a', borderRadius: '10px', color: '#888' }}>{cat}</span>
                  ))}
                </div>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--accent-primary, #e8d5a3)', flexShrink: 0 }}>€{Number(product.pvp).toFixed(2)}</span>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => startEdit(product)} title="Editar"
                  style={{ background: 'none', border: '1px solid #333', borderRadius: '6px', padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => toggleActive(product)} title={product.active ? 'Desactivar' : 'Activar'}
                  style={{ background: 'none', border: '1px solid #333', borderRadius: '6px', padding: '0.4rem 0.6rem', cursor: 'pointer', color: product.active ? '#22c55e' : '#555', display: 'flex', alignItems: 'center' }}>
                  {product.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                </button>
                <button onClick={() => deleteProduct(product.id)} title="Eliminar"
                  style={{ background: 'none', border: '1px solid #333', borderRadius: '6px', padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── MODAL DE CUENTA ──────────────────────────────────────────────────────────
function AccountModal({ onClose, user, onAuthChange }) {
  const [view, setView] = useState(user ? 'account' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => { if (user && view === 'account') loadOrders(); }, [user, view]);

  const loadOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const handleLogin = async () => {
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage('Email o contraseña incorrectos.');
    else { onAuthChange(); onClose(); }
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage('✅ Revisa tu email para confirmar tu cuenta.');
    setLoading(false);
  };

  const handleForgot = async () => {
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://centraltcg.es' });
    if (error) setMessage('Error al enviar el email.');
    else setMessage('✅ Email enviado. Revisa tu bandeja de entrada.');
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onAuthChange(); onClose();
  };

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
  const btnPrimary = { width: '100%', padding: '0.85rem', background: 'var(--accent-primary, #e8d5a3)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', marginBottom: '0.75rem' };
  const btnGhost = { background: 'none', border: 'none', color: 'var(--accent-primary, #e8d5a3)', cursor: 'pointer', fontSize: '0.85rem', padding: 0 };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#111', border: '1px solid #222', borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '420px', maxHeight: '85vh', overflowY: 'auto', color: '#fff', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 800, letterSpacing: '0.08em', fontSize: '1rem' }}>
            {view === 'login' && 'INICIAR SESIÓN'}
            {view === 'register' && 'CREAR CUENTA'}
            {view === 'forgot' && 'RECUPERAR CONTRASEÑA'}
            {view === 'account' && 'MI CUENTA'}
          </h3>
          <X onClick={onClose} style={{ cursor: 'pointer', opacity: 0.6 }} size={20} />
        </div>

        {view === 'login' && (
          <>
            <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={inputStyle} type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            {message && <p style={{ fontSize: '0.82rem', color: message.startsWith('✅') ? '#22c55e' : '#ef4444', marginBottom: '0.75rem' }}>{message}</p>}
            <button style={btnPrimary} onClick={handleLogin} disabled={loading}>{loading ? 'Cargando...' : 'INICIAR SESIÓN'}</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#888' }}>
              <button style={btnGhost} onClick={() => { setView('forgot'); setMessage(''); }}>¿Olvidaste tu contraseña?</button>
              <button style={btnGhost} onClick={() => { setView('register'); setMessage(''); }}>Crear cuenta</button>
            </div>
          </>
        )}

        {view === 'register' && (
          <>
            <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={inputStyle} type="password" placeholder="Contraseña (mínimo 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} />
            {message && <p style={{ fontSize: '0.82rem', color: message.startsWith('✅') ? '#22c55e' : '#ef4444', marginBottom: '0.75rem' }}>{message}</p>}
            <button style={btnPrimary} onClick={handleRegister} disabled={loading}>{loading ? 'Cargando...' : 'CREAR CUENTA'}</button>
            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#888' }}>
              ¿Ya tienes cuenta? <button style={btnGhost} onClick={() => { setView('login'); setMessage(''); }}>Inicia sesión</button>
            </div>
          </>
        )}

        {view === 'forgot' && (
          <>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
            <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            {message && <p style={{ fontSize: '0.82rem', color: message.startsWith('✅') ? '#22c55e' : '#ef4444', marginBottom: '0.75rem' }}>{message}</p>}
            <button style={btnPrimary} onClick={handleForgot} disabled={loading}>{loading ? 'Enviando...' : 'ENVIAR ENLACE'}</button>
            <div style={{ textAlign: 'center' }}><button style={btnGhost} onClick={() => { setView('login'); setMessage(''); }}>← Volver al login</button></div>
          </>
        )}

        {view === 'account' && user && (
          <>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.2rem' }}>CONECTADO COMO</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.email}</p>
              </div>
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #333', borderRadius: '6px', color: '#888', padding: '0.4rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                <LogOut size={14} /> Salir
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', color: '#888' }}>
              <Clock size={14} /> HISTORIAL DE PEDIDOS
            </div>
            {orders.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#555', textAlign: 'center', padding: '2rem 0' }}>Aún no tienes pedidos.</p>
            ) : (
              orders.map(order => (
                <div key={order.id} style={{ border: '1px solid #222', borderRadius: '8px', marginBottom: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                        {new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#666' }}>{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--accent-primary, #e8d5a3)' }}>€{Number(order.total).toFixed(2)}</span>
                      {expandedOrder === order.id ? <ChevronUp size={16} color="#666" /> : <ChevronDown size={16} color="#666" />}
                    </div>
                  </div>
                  {expandedOrder === order.id && (
                    <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #1a1a1a' }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                          <img src={item.img} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px', background: '#1a1a1a' }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.name}</p>
                            <p style={{ fontSize: '0.72rem', color: '#666' }}>x{item.qty} · €{(item.pvp * item.qty).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCookieVisible, setIsCookieVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('TODOS');
  const [activeBanner, setActiveBanner] = useState(0);
  const [page, setPage] = useState('shop');
  const [user, setUser] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadProducts();
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setTimeout(() => setIsCookieVisible(true), 1500);
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) { setPage('thankyou'); window.history.replaceState({}, document.title, '/'); }
    else if (params.get('canceled')) { setPage('canceled'); window.history.replaceState({}, document.title, '/'); }
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const filteredProducts = useMemo(() => products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'TODOS' || (p.categories || []).includes(activeCategory);
    return matchesSearch && matchesCategory;
  }), [searchQuery, activeCategory, products]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const updateQty = (id, delta) => setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  const cartTotal = cart.reduce((acc, item) => acc + (item.pvp * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const onCheckout = async () => {
    sessionStorage.setItem('last-order', JSON.stringify(cart));
    handleCheckout(cart);
  };

  if (page === 'thankyou') return <ThankYouPage onBack={() => { setCart([]); setPage('shop'); }} />;

  if (page === 'canceled') return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: '1rem' }}>
      <X size={64} color="#ef4444" strokeWidth={1.5} />
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>PAGO CANCELADO</h2>
      <p style={{ color: '#888' }}>No se ha realizado ningún cargo.</p>
      <button onClick={() => setPage('shop')} style={{ marginTop: '1rem', padding: '0.9rem 2.5rem', background: 'var(--accent-primary, #e8d5a3)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}>
        VOLVER A LA TIENDA
      </button>
    </div>
  );

  return (
    <div className="app-container">

      {/* PANEL ADMIN */}
      {showAdmin && <AdminPanel onClose={() => { setShowAdmin(false); loadProducts(); }} />}

      {/* MODAL CUENTA */}
      {isUserOpen && (
        <AccountModal onClose={() => setIsUserOpen(false)} user={user}
          onAuthChange={() => supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))} />
      )}

      {/* OVERLAYS */}
      {(isCartOpen || selectedProduct) && (
        <div className="overlay" onClick={() => { setIsCartOpen(false); setSelectedProduct(null); }} />
      )}

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div className="product-modal open">
          <div className="modal-close" onClick={() => setSelectedProduct(null)}><X /></div>
          <div className="modal-layout">
            <div className="modal-img"><img src={selectedProduct.img} alt={selectedProduct.name} /></div>
            <div className="modal-info">
              <span className="product-cat">{(selectedProduct.categories || [])[0]}</span>
              <h2>{selectedProduct.name}</h2>
              <div className="modal-price">€{Number(selectedProduct.pvp).toFixed(2)}</div>
              <p className="modal-desc">{selectedProduct.description}</p>
              <div className="modal-actions">
                <button className="btn-primary" style={{ flexGrow: 1 }} onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>Añadir al Carrito</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COOKIE BANNER */}
      {isCookieVisible && (
        <div className="cookie-banner">
          <div className="cookie-content">
            <p>Utilizamos cookies para mejorar tu experiencia en Central TCG.</p>
            <div className="cookie-buttons">
              <button className="btn-cookie-ghost" onClick={() => setIsCookieVisible(false)}>Configurar</button>
              <button className="btn-cookie" onClick={() => { localStorage.setItem('cookie-consent', 'true'); setIsCookieVisible(false); }}>Aceptar Todo</button>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>CARRITO ({cartCount})</h3>
          <X onClick={() => setIsCartOpen(false)} style={{ cursor: 'pointer' }} />
        </div>
        <div className="cart-content">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
              <ShoppingCart size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
              <p>Tu carrito está vacío</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.img} alt={item.name} />
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>€{Number(item.pvp).toFixed(2)}</p>
                <div className="qty-controls">
                  <Minus size={14} onClick={() => updateQty(item.id, -1)} />
                  <span>{item.qty}</span>
                  <Plus size={14} onClick={() => updateQty(item.id, 1)} />
                </div>
              </div>
              <Trash2 size={18} className="remove-icon" onClick={() => removeFromCart(item.id)} />
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total"><span>TOTAL</span><span>€{cartTotal.toFixed(2)}</span></div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }} onClick={onCheckout}>
              <CreditCard size={18} /> FINALIZAR COMPRA
            </button>
          </div>
        )}
      </aside>

      {/* HEADER */}
      <header className="nav-header">
        <div className="header-top">
          <div className="header-top-left">
            {isAdmin && (
              <button onClick={() => setShowAdmin(true)}
                style={{ background: 'none', border: '1px solid #333', borderRadius: '6px', color: '#888', padding: '0.3rem 0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                <Settings size={13} /> ADMIN
              </button>
            )}
          </div>
          <div className="header-center" onClick={() => { setActiveCategory('TODOS'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="typo-logo">
              <span className="logo-main">CENTRAL</span>
              <span className="logo-sub">TCG</span>
            </div>
          </div>
          <div className="header-right">
            <div className={`search-bar-inline ${isSearchOpen ? 'active' : ''}`}>
              <input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchOpen(true)} onBlur={() => !searchQuery && setIsSearchOpen(false)} />
            </div>
            <Search size={20} onClick={() => setIsSearchOpen(!isSearchOpen)} className="icon-hover" />
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsUserOpen(true)}>
              <User size={20} className="icon-hover" />
              {user && <span style={{ position: 'absolute', top: '-3px', right: '-3px', width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', border: '1px solid #000' }} />}
            </div>
            <div className="cart-trigger" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={20} className="icon-hover" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </div>
        </div>
        <nav className="header-bottom">
          <div className="header-categories">
            {categoriesData.map(cat => (
              <span key={cat} className={`header-cat-link ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => { setActiveCategory(cat); if (window.scrollY < 400) window.scrollTo({ top: 460, behavior: 'smooth' }); }}>
                {cat}
              </span>
            ))}
          </div>
        </nav>
      </header>

      {/* SEARCH OVERLAY */}
      {searchQuery && (
        <div className="search-results-overlay">
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Resultados para "{searchQuery}"</p>
          {filteredProducts.length === 0 && <p>No se encontraron productos.</p>}
        </div>
      )}

      {/* HERO BANNER */}
      <section className="hero-section">
        <div className="hero-slide">
          <img src={bannerImages[activeBanner]} alt="TCG Banner" className="hero-img" />
          <div className="hero-overlay-content" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.9))' }}>
            {activeBanner === 0
              ? <><h1>RIFTBOUND: LEAGUE OF LEGENDS TCG</h1><p>El juego de cartas oficial de Riot Games ya está aquí</p></>
              : <><h1>CENTRAL TCG STORE</h1><p>Tu distribuidor de confianza para producto sellado premium</p></>
            }
            <button className={activeBanner === 0 ? 'btn-primary' : 'btn-primary-ghost'}
              onClick={() => { setActiveCategory(activeBanner === 0 ? 'RIFTBOUND' : 'TODOS'); window.scrollTo({ top: 800, behavior: 'smooth' }); }}>
              {activeBanner === 0 ? 'VER PRODUCTOS' : 'EXPLORAR NOVEDADES'}
            </button>
          </div>
        </div>
        <div className="carousel-nav">
          <ChevronLeft onClick={() => setActiveBanner(prev => (prev - 1 + bannerImages.length) % bannerImages.length)} />
          <div className="carousel-dots">
            {bannerImages.map((_, i) => <div key={i} className={`dot ${activeBanner === i ? 'active' : ''}`} onClick={() => setActiveBanner(i)} />)}
          </div>
          <ChevronRight onClick={() => setActiveBanner(prev => (prev + 1) % bannerImages.length)} />
        </div>
      </section>

      {/* PRODUCTOS */}
      <main className="main-content">
        <div className="section-title">
          <h2>{activeCategory === 'TODOS' ? 'NOVEDADES SELECCIONADAS' : activeCategory}</h2>
        </div>
        <section className="card-grid">
          {filteredProducts.map(p => (
            <div className="product-card" key={p.id} onClick={() => setSelectedProduct(p)}>
              <div className="product-img-container">
                <img src={p.img} alt={p.name} className="product-img-hover" />
              </div>
              <div className="product-info">
                <span className="product-cat">{(p.categories || [])[0]}</span>
                <h3 className="product-name">{p.name}</h3>
                <div className="product-price">€{Number(p.pvp).toFixed(2)}</div>
              </div>
              <button className="add-to-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>Añadir al Carrito</button>
            </div>
          ))}
        </section>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          background: "#0a0a0a",
          color: "#aaa",
          padding: "30px 40px",
          marginTop: "60px",
          fontSize: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "80px",
            maxWidth: "1200px",
          }}
        >
          {/* COLUMNA 1 */}
          <div>
            <h3 style={{ color: "#fff", marginBottom: "10px" }}>
              Central TCG
            </h3>
            <p>centraltcg@gmail.com</p>
            <p>Madrid, España</p>
          </div>

          {/* COLUMNA 2 */}
          <div>
            <h4 style={{ color: "#ddd", marginBottom: "10px" }}>
              Información
            </h4>
            <p>Envíos 24-72h</p>
            <p>Devoluciones 14 días</p>
          </div>

          {/* COLUMNA 3 */}
          <div>
            <h4 style={{ color: "#ddd", marginBottom: "10px" }}>
              Legal
            </h4>
            <p style={{ cursor: "pointer" }}>Aviso legal</p>
            <p style={{ cursor: "pointer" }}>Privacidad</p>
            <p style={{ cursor: "pointer" }}>Cookies</p>
          </div>
        </div>

        <div
          style={{
            marginTop: "30px",
            borderTop: "1px solid #222",
            paddingTop: "15px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          © {new Date().getFullYear()} Central TCG
        </div>
      </footer>
    </div>
  );
}
