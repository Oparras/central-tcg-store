import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Menu, Search, User, ChevronLeft, ChevronRight, X, Trash2, Plus, Minus, CreditCard, CheckCircle, Package } from 'lucide-react';
import { handleCheckout } from './stripe';
import './index.css';

// Datos oficiales Naruto Ninja TCG (GRG) y TCG expansión
const productos = [
  {
    id: 1, name: 'Riftbound: Vendetta Vault', categories: ['RIFTBOUND', 'ACCESSORIES'], pvp: 34.99, condition: 'Nuevo/Sellado',
    img: 'https://b2b.asmodee.es/product/image/medium/rb04vb01en_1.png',
    desc: 'Pack que incluye 6 sobres de Riftbound: Vendetta, 36 runas básicas y 3 fichas full-art.'
  },
  {
    id: 2, name: 'Riftbound: Unleashed Booster Display (24)', categories: ['RIFTBOUND', 'DISPLAYS'], pvp: 108.00, condition: 'Nuevo/Sellado',
    img: 'https://b2b.asmodee.es/product/image/medium/rb03bd01den_1.png',
    desc: 'Caja completa de 24 sobres de la expansión Unleashed.'
  },
  {
    id: 3, name: 'Riftbound: Unleashed Art Sleeves (100)', categories: ['RIFTBOUND', 'ACCESSORIES'], pvp: 11.99, condition: 'Nuevo/Sellado',
    img: 'https://b2b.asmodee.es/product/image/medium/rb03as01en_1.png',
    desc: 'Fundas premium con acabado mate y arte exclusivo de Unleashed.'
  },
  {
    id: 4, name: 'One Piece TCG: Booster Display OP14 (24)', categories: ['ONE PIECE TCG', 'DISPLAYS'], pvp: 132.00, condition: 'Nuevo/Sellado',
    img: 'https://b2b.asmodee.es/product/image/small/bopop14den_124183_0.png',
    desc: 'Caja de 24 sobres de la colección OP14 con cartas del 3er Aniversario.'
  },
  {
    id: 5, name: 'Naruto Ninja TCG: Booster Display (24)', categories: ['NARUTO TCG', 'DISPLAYS'], pvp: 120.00, condition: 'Nuevo/Sellado',
    img: 'https://b2b.asmodee.es/product/image/large/ntcgbd01en_1.png',
    desc: 'Caja de 24 sobres oficiales de la serie Konoha Shidō. Cada sobre incluye 10 cartas con レア y holos.'
  },
  {
    id: 6, name: 'Naruto Ninja TCG: Special Pack Naruto/Sasuke', categories: ['NARUTO TCG', 'NOVEDADES'], pvp: 24.99, condition: 'Nuevo/Sellado',
    img: 'https://b2b.asmodee.es/product/image/large/ntcgsp01en_1.png',
    desc: 'Pack premium con 4 sobres, 2 cartas Mythos exclusivas y una carta MAXI de coleccionista.'
  },
  {
    id: 7, name: 'Naruto Ninja TCG: Special Pack Itachi/Kisame', categories: ['NARUTO TCG', 'NOVEDADES'], pvp: 24.99, condition: 'Nuevo/Sellado',
    img: 'https://b2b.asmodee.es/product/image/large/ntcgsp02en_1.png',
    desc: 'Versión del Special Pack centrada en los legendarios Itachi y Kisame. Incluye material exclusivo.'
  },
  {
    id: 8, name: 'Naruto Ninja TCG: Collector Binder', categories: ['NARUTO TCG', 'ACCESSORIES'], pvp: 9.99, condition: 'Nuevo/Sellado',
    img: 'https://b2b.asmodee.es/product/image/large/ntcgbin01en_1.png',
    desc: 'Archivador oficial de 9 bolsillos (capacidad 180 cartas) para proteger tu colección Konoha Shidō.'
  }
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
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #0a0a0a)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: 'var(--text-primary, #fff)'
    }}>
      {/* Icono de éxito */}
      <div style={{ marginBottom: '1.5rem' }}>
        <CheckCircle size={72} color="#22c55e" strokeWidth={1.5} />
      </div>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
        ¡PEDIDO CONFIRMADO!
      </h1>
      <p style={{ color: 'var(--text-muted, #888)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
        Gracias por tu compra en <strong style={{ color: 'var(--accent-primary, #e8d5a3)' }}>Central TCG</strong>
      </p>
      <p style={{ color: 'var(--text-muted, #888)', fontSize: '0.85rem', marginBottom: '2rem' }}>
        Nº de pedido: <strong style={{ color: 'var(--text-primary, #fff)' }}>#{orderNumber}</strong>
      </p>

      {/* Resumen del pedido */}
      {lastOrder.length > 0 && (
        <div style={{
          width: '100%',
          maxWidth: '480px',
          background: 'var(--bg-secondary, #111)',
          border: '1px solid var(--border-color, #222)',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border-color, #222)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'var(--text-muted, #888)'
          }}>
            <Package size={16} />
            RESUMEN DEL PEDIDO
          </div>

          <div style={{ padding: '1rem 1.5rem' }}>
            {lastOrder.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                paddingBottom: '1rem',
                marginBottom: '1rem',
                borderBottom: '1px solid var(--border-color, #1a1a1a)'
              }}>
                <img
                  src={item.img}
                  alt={item.name}
                  style={{ width: '52px', height: '52px', objectFit: 'contain', borderRadius: '6px', background: '#1a1a1a' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.name}</p>
                  <p style={{ color: 'var(--text-muted, #888)', fontSize: '0.8rem' }}>Cantidad: {item.qty}</p>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  €{(item.pvp * item.qty).toFixed(2)}
                </span>
              </div>
            ))}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '0.5rem',
              fontWeight: 800,
              fontSize: '1rem'
            }}>
              <span>TOTAL PAGADO</span>
              <span style={{ color: 'var(--accent-primary, #e8d5a3)' }}>€{orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Info de envío */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(34,197,94,0.08)',
        border: '1px solid rgba(34,197,94,0.2)',
        borderRadius: '10px',
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
        fontSize: '0.88rem',
        color: 'var(--text-muted, #aaa)',
        lineHeight: '1.7'
      }}>
        📦 <strong style={{ color: '#fff' }}>Envío en 24-48h laborables.</strong> Recibirás un email de confirmación con el número de seguimiento en cuanto tu pedido salga de nuestro almacén.
      </div>

      <button
        onClick={onBack}
        style={{
          padding: '0.9rem 2.5rem',
          background: 'var(--accent-primary, #e8d5a3)',
          color: '#000',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 800,
          fontSize: '0.9rem',
          letterSpacing: '0.08em',
          cursor: 'pointer'
        }}
      >
        SEGUIR COMPRANDO
      </button>
    </div>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isCookieVisible, setIsCookieVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('TODOS');
  const [activeBanner, setActiveBanner] = useState(0);
  const [page, setPage] = useState('shop'); // 'shop' | 'thankyou' | 'canceled'

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setIsCookieVisible(true), 1500);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      setPage('thankyou');
      // Limpiar URL sin recargar
      window.history.replaceState({}, document.title, '/');
    } else if (params.get('canceled')) {
      setPage('canceled');
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsCookieVisible(false);
  };

  const filteredProducts = useMemo(() => {
    return productos.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'TODOS' || p.categories.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.pvp * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const onCheckout = () => {
    // Guardamos el carrito en sessionStorage para mostrarlo en la thank you page
    sessionStorage.setItem('last-order', JSON.stringify(cart));
    handleCheckout(cart);
  };

  // ── THANK YOU PAGE ──
  if (page === 'thankyou') {
    return <ThankYouPage onBack={() => { setCart([]); setPage('shop'); }} />;
  }

  // ── PAGO CANCELADO ──
  if (page === 'canceled') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary, #0a0a0a)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-primary, #fff)',
        gap: '1rem'
      }}>
        <X size={64} color="#ef4444" strokeWidth={1.5} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>PAGO CANCELADO</h2>
        <p style={{ color: 'var(--text-muted, #888)' }}>No se ha realizado ningún cargo. Puedes volver a intentarlo.</p>
        <button
          onClick={() => setPage('shop')}
          style={{
            marginTop: '1rem',
            padding: '0.9rem 2.5rem',
            background: 'var(--accent-primary, #e8d5a3)',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 800,
            fontSize: '0.9rem',
            letterSpacing: '0.08em',
            cursor: 'pointer'
          }}
        >
          VOLVER A LA TIENDA
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* OVERLAYS */}
      {(isCartOpen || isMenuOpen || isUserOpen || selectedProduct) && (
        <div className="overlay" onClick={() => {
          setIsCartOpen(false);
          setIsMenuOpen(false);
          setIsUserOpen(false);
          setSelectedProduct(null);
        }} />
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="product-modal open">
          <div className="modal-close" onClick={() => setSelectedProduct(null)}><X /></div>
          <div className="modal-layout">
            <div className="modal-img">
              <img src={selectedProduct.img} alt={selectedProduct.name} />
            </div>
            <div className="modal-info">
              <span className="product-cat">{selectedProduct.category}</span>
              <h2>{selectedProduct.name}</h2>
              <div className="modal-price">€{selectedProduct.pvp.toFixed(2)}</div>
              <p className="modal-desc">{selectedProduct.desc}</p>
              <div className="modal-actions">
                <button className="btn-primary" style={{ flexGrow: 1 }} onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>
                  Añadir al Carrito
                </button>
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
              <button className="btn-cookie" onClick={acceptCookies}>Aceptar Todo</button>
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
            <div className="cart-total">
              <span>TOTAL</span>
              <span>€{cartTotal.toFixed(2)}</span>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}
              onClick={onCheckout}
            >
              <CreditCard size={18} />
              FINALIZAR COMPRA
            </button>
          </div>
        )}
      </aside>

      {/* USER MODAL */}
      <div className={`user-modal ${isUserOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3>MI CUENTA</h3>
          <X onClick={() => setIsUserOpen(false)} style={{ cursor: 'pointer' }} />
        </div>
        <input type="email" placeholder="Email" className="clean-input" style={{ marginBottom: '1rem' }} />
        <input type="password" placeholder="Contraseña" className="clean-input" style={{ marginBottom: '1rem' }} />
        <button className="btn-primary" style={{ width: '100%' }}>Iniciar Sesión</button>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>¿No tienes cuenta? <span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}>Regístrate</span></p>
      </div>

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
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => !searchQuery && setIsSearchOpen(false)}
              />
            </div>
            <Search size={20} onClick={() => setIsSearchOpen(!isSearchOpen)} className="icon-hover" />
            <User size={20} onClick={() => setIsUserOpen(true)} className="icon-hover" />
            <div className="cart-trigger" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={20} className="icon-hover" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </div>
        </div>

        <nav className="header-bottom">
          <div className="header-categories">
            {categoriesData.map(cat => (
              <span
                key={cat}
                className={`header-cat-link ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat);
                  if (window.scrollY < 400) window.scrollTo({ top: 460, behavior: 'smooth' });
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </nav>
      </header>

      {/* SEARCH RESULTS OVERLAY */}
      {searchQuery && (
        <div className="search-results-overlay">
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Resultados para "{searchQuery}"</p>
          {filteredProducts.length === 0 && <p>No se encontraron productos.</p>}
        </div>
      )}

      {/* HERO BANNER */}
      <section className="hero-section">
        <div className="hero-slide">
          <img
            src={bannerImages[activeBanner]}
            alt="TCG Banner"
            className="hero-img"
          />
          <div className="hero-overlay-content" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.9))' }}>
            {activeBanner === 0 ? (
              <>
                <h1>RIFTBOUND: LEAGUE OF LEGENDS TCG</h1>
                <p>El juego de cartas oficial de Riot Games ya está aquí</p>
              </>
            ) : (
              <>
                <h1>CENTRAL TCG STORE</h1>
                <p>Tu distribuidor de confianza para producto sellado premium</p>
              </>
            )}
            <button
              className={`${activeBanner === 0 ? 'btn-primary' : 'btn-primary-ghost'}`}
              onClick={() => {
                setActiveCategory(activeBanner === 0 ? 'RIFTBOUND' : 'TODOS');
                window.scrollTo({ top: 800, behavior: 'smooth' });
              }}
            >
              {activeBanner === 0 ? 'VER PRODUCTOS' : 'EXPLORAR NOVEDADES'}
            </button>
          </div>
        </div>

        <div className="carousel-nav">
          <ChevronLeft onClick={() => setActiveBanner(prev => (prev - 1 + bannerImages.length) % bannerImages.length)} />
          <div className="carousel-dots">
            {bannerImages.map((_, i) => (
              <div key={i} className={`dot ${activeBanner === i ? 'active' : ''}`} onClick={() => setActiveBanner(i)} />
            ))}
          </div>
          <ChevronRight onClick={() => setActiveBanner(prev => (prev + 1) % bannerImages.length)} />
        </div>
      </section>

      {/* MAIN CONTENT */}
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
                <div className="product-price">
                  €{p.pvp.toFixed(2)}
                </div>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={(e) => { e.stopPropagation(); addToCart(p); }}
              >
                Añadir al Carrito
              </button>
            </div>
          ))}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-logo">CENTRAL TCG</div>
          <p>© 2026 Central TCG España.</p>
          <div className="social-links">
            <span>Instagram</span> • <span>Twitter</span> • <span>Discord</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
