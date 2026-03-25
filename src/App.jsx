import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShoppingCart, Search, User, ChevronLeft, ChevronRight, X, Trash2, Plus, Minus, CreditCard, CheckCircle, Package, LogOut, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { handleCheckout } from './stripe';
import './index.css';

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── PRODUCTOS ────────────────────────────────────────────────────────────────
const productos = [
  { id: 1, name: 'Riftbound: Vendetta Vault', categories: ['RIFTBOUND', 'ACCESSORIES'], pvp: 34.99, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/medium/rb04vb01en_1.png', desc: 'Pack que incluye 6 sobres de Riftbound: Vendetta, 36 runas básicas y 3 fichas full-art.' },
  { id: 2, name: 'Riftbound: Unleashed Booster Display (24)', categories: ['RIFTBOUND', 'DISPLAYS'], pvp: 108.00, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/medium/rb03bd01den_1.png', desc: 'Caja completa de 24 sobres de la expansión Unleashed.' },
  { id: 3, name: 'Riftbound: Unleashed Art Sleeves (100)', categories: ['RIFTBOUND', 'ACCESSORIES'], pvp: 11.99, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/medium/rb03as01en_1.png', desc: 'Fundas premium con acabado mate y arte exclusivo de Unleashed.' },
  { id: 4, name: 'One Piece TCG: Booster Display OP14 (24)', categories: ['ONE PIECE TCG', 'DISPLAYS'], pvp: 132.00, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/small/bopop14den_124183_0.png', desc: 'Caja de 24 sobres de la colección OP14 con cartas del 3er Aniversario.' },
  { id: 5, name: 'Naruto Ninja TCG: Booster Display (24)', categories: ['NARUTO TCG', 'DISPLAYS'], pvp: 120.00, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/large/ntcgbd01en_1.png', desc: 'Caja de 24 sobres oficiales de la serie Konoha Shidō.' },
  { id: 6, name: 'Naruto Ninja TCG: Special Pack Naruto/Sasuke', categories: ['NARUTO TCG', 'NOVEDADES'], pvp: 24.99, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/large/ntcgsp01en_1.png', desc: 'Pack premium con 4 sobres, 2 cartas Mythos exclusivas y una carta MAXI de coleccionista.' },
  { id: 7, name: 'Naruto Ninja TCG: Special Pack Itachi/Kisame', categories: ['NARUTO TCG', 'NOVEDADES'], pvp: 24.99, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/large/ntcgsp02en_1.png', desc: 'Versión del Special Pack centrada en los legendarios Itachi y Kisame.' },
  { id: 8, name: 'Naruto Ninja TCG: Collector Binder', categories: ['NARUTO TCG', 'ACCESSORIES'], pvp: 9.99, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/large/ntcgbin01en_1.png', desc: 'Archivador oficial de 9 bolsillos (capacidad 180 cartas).' }
];

const categoriesData = ['TODOS', 'RIFTBOUND', 'ONE PIECE TCG', 'NARUTO TCG', 'ACCESSORIES', 'NOVEDADES'];
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #0a0a0a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: 'var(--text-primary, #fff)' }}>
      <div style={{ marginBottom: '1.5rem' }}><CheckCircle size={72} color="#22c55e" strokeWidth={1.5} /></div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>¡PEDIDO CONFIRMADO!</h1>
      <p style={{ color: 'var(--text-muted, #888)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Gracias por tu compra en <strong style={{ color: 'var(--accent-primary, #e8d5a3)' }}>Central TCG</strong></p>
      <p style={{ color: 'var(--text-muted, #888)', fontSize: '0.85rem', marginBottom: '2rem' }}>Nº de pedido: <strong style={{ color: 'var(--text-primary, #fff)' }}>#{orderNumber}</strong></p>

      {lastOrder.length > 0 && (
        <div style={{ width: '100%', maxWidth: '480px', background: 'var(--bg-secondary, #111)', border: '1px solid var(--border-color, #222)', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color, #222)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted, #888)' }}>
            <Package size={16} /> RESUMEN DEL PEDIDO
          </div>
          <div style={{ padding: '1rem 1.5rem' }}>
            {lastOrder.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color, #1a1a1a)' }}>
                <img src={item.img} alt={item.name} style={{ width: '52px', height: '52px', objectFit: 'contain', borderRadius: '6px', background: '#1a1a1a' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.name}</p>
                  <p style={{ color: 'var(--text-muted, #888)', fontSize: '0.8rem' }}>Cantidad: {item.qty}</p>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>€{(item.pvp * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', fontWeight: 800, fontSize: '1rem' }}>
              <span>TOTAL PAGADO</span>
              <span style={{ color: 'var(--accent-primary, #e8d5a3)' }}>€{orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '480px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '2rem', fontSize: '0.88rem', color: 'var(--text-muted, #aaa)', lineHeight: '1.7' }}>
        📦 <strong style={{ color: '#fff' }}>Envío en 24-48h laborables.</strong> Recibirás un email de confirmación con el número de seguimiento en cuanto tu pedido salga de nuestro almacén.
      </div>

      <button onClick={onBack} style={{ padding: '0.9rem 2.5rem', background: 'var(--accent-primary, #e8d5a3)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.08em', cursor: 'pointer' }}>
        SEGUIR COMPRANDO
      </button>
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

  useEffect(() => {
    if (user && view === 'account') loadOrders();
  }, [user, view]);

  const loadOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const handleLogin = async () => {
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMessage('Email o contraseña incorrectos.'); }
    else { onAuthChange(); onClose(); }
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setMessage(error.message); }
    else { setMessage('✅ Revisa tu email para confirmar tu cuenta.'); }
    setLoading(false);
  };

  const handleForgot = async () => {
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://centraltcg.es' });
    if (error) { setMessage('Error al enviar el email.'); }
    else { setMessage('✅ Email enviado. Revisa tu bandeja de entrada.'); }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onAuthChange();
    onClose();
  };

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
  const btnPrimary = { width: '100%', padding: '0.85rem', background: 'var(--accent-primary, #e8d5a3)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.06em', cursor: 'pointer', marginBottom: '0.75rem' };
  const btnGhost = { background: 'none', border: 'none', color: 'var(--accent-primary, #e8d5a3)', cursor: 'pointer', fontSize: '0.85rem', padding: 0 };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#111', border: '1px solid #222', borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '420px', maxHeight: '85vh', overflowY: 'auto', color: '#fff', zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 800, letterSpacing: '0.08em', fontSize: '1rem' }}>
            {view === 'login' && 'INICIAR SESIÓN'}
            {view === 'register' && 'CREAR CUENTA'}
            {view === 'forgot' && 'RECUPERAR CONTRASEÑA'}
            {view === 'account' && 'MI CUENTA'}
          </h3>
          <X onClick={onClose} style={{ cursor: 'pointer', opacity: 0.6 }} size={20} />
        </div>

        {/* LOGIN */}
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

        {/* REGISTRO */}
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

        {/* RECUPERAR CONTRASEÑA */}
        {view === 'forgot' && (
          <>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
            <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            {message && <p style={{ fontSize: '0.82rem', color: message.startsWith('✅') ? '#22c55e' : '#ef4444', marginBottom: '0.75rem' }}>{message}</p>}
            <button style={btnPrimary} onClick={handleForgot} disabled={loading}>{loading ? 'Enviando...' : 'ENVIAR ENLACE'}</button>
            <div style={{ textAlign: 'center' }}>
              <button style={btnGhost} onClick={() => { setView('login'); setMessage(''); }}>← Volver al login</button>
            </div>
          </>
        )}

        {/* MI CUENTA */}
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setTimeout(() => setIsCookieVisible(true), 1500);
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) { setPage('thankyou'); window.history.replaceState({}, document.title, '/'); }
    else if (params.get('canceled')) { setPage('canceled'); window.history.replaceState({}, document.title, '/'); }
  }, []);

  const filteredProducts = useMemo(() => productos.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'TODOS' || p.categories.includes(activeCategory);
    return matchesSearch && matchesCategory;
  }), [searchQuery, activeCategory]);

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
    if (user) {
      await supabase.from('orders').insert({ user_id: user.id, items: cart, total: cartTotal });
    }
    handleCheckout(cart);
  };

  if (page === 'thankyou') return <ThankYouPage onBack={() => { setCart([]); setPage('shop'); }} />;

  if (page === 'canceled') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #0a0a0a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: '1rem' }}>
      <X size={64} color="#ef4444" strokeWidth={1.5} />
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>PAGO CANCELADO</h2>
      <p style={{ color: '#888' }}>No se ha realizado ningún cargo. Puedes volver a intentarlo.</p>
      <button onClick={() => setPage('shop')} style={{ marginTop: '1rem', padding: '0.9rem 2.5rem', background: 'var(--accent-primary, #e8d5a3)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
        VOLVER A LA TIENDA
      </button>
    </div>
  );

  return (
    <div className="app-container">

      {/* MODAL CUENTA */}
      {isUserOpen && (
        <AccountModal
          onClose={() => setIsUserOpen(false)}
          user={user}
          onAuthChange={() => supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))}
        />
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
              <span className="product-cat">{selectedProduct.category}</span>
              <h2>{selectedProduct.name}</h2>
              <div className="modal-price">€{selectedProduct.pvp.toFixed(2)}</div>
              <p className="modal-desc">{selectedProduct.desc}</p>
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
            <p>Utilizamos cookies para mejorar tu experiencia en Central TCG. ¿Aceptas nuestra política de cookies?</p>
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
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.img} alt={item.name} />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>€{item.pvp.toFixed(2)}</p>
                  <div className="qty-controls">
                    <Minus size={14} onClick={() => updateQty(item.id, -1)} />
                    <span>{item.qty}</span>
                    <Plus size={14} onClick={() => updateQty(item.id, 1)} />
                  </div>
                </div>
                <Trash2 size={18} className="remove-icon" onClick={() => removeFromCart(item.id)} />
              </div>
            ))
          )}
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
          <div className="header-top-left"></div>
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
                <span className="product-cat">{p.category}</span>
                <h3 className="product-name">{p.name}</h3>
                <div className="product-price">€{p.pvp.toFixed(2)}</div>
              </div>
              <button className="add-to-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>Añadir al Carrito</button>
            </div>
          ))}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-logo">CENTRAL TCG</div>
          <p>© 2026 Central TCG España.</p>
          <div className="social-links"><span>Instagram</span> • <span>Twitter</span> • <span>Discord</span></div>
        </div>
      </footer>
    </div>
  );
}
