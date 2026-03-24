import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Menu, Search, User, ChevronLeft, ChevronRight, X, Trash2, Plus, Minus } from 'lucide-react';
import './index.css';

// Datos reales de productos TCG con soporte para múltiples categorías y Naruto
const productos = [
  { 
    id: 1, name: 'Riftbound: Vendetta Vault', categories: ['RIFTBOUND', 'ACCESSORIES'], pvp: 34.99, condition: 'Nuevo/Sellado', 
    img: 'https://b2b.asmodee.es/product/image/medium/rb04vb01en_1.png',
    desc: '¡Ábrete paso con el Vendetta Vault! Este pack incluye 6 sobres de Riftbound: Vendetta, 36 runas básicas para potenciar tus mazos y 3 fichas full-art de doble cara.'
  },
  { 
    id: 2, name: 'Riftbound: Unleashed Booster Display (24)', categories: ['RIFTBOUND', 'DISPLAYS'], pvp: 108.00, condition: 'Nuevo/Sellado', 
    img: 'https://b2b.asmodee.es/product/image/medium/rb03bd01den_1.png',
    desc: 'Caja completa de 24 sobres de la expansión Unleashed. Expande tu mazo con poderosos hechizos y unidades del universo League of Legends.'
  },
  { 
    id: 3, name: 'Riftbound: Unleashed Art Sleeves (100)', categories: ['RIFTBOUND', 'ACCESSORIES'], pvp: 11.99, condition: 'Nuevo/Sellado', 
    img: 'https://b2b.asmodee.es/product/image/medium/rb03as01en_1.png',
    desc: 'Fundas de alta calidad con arte exclusivo de la expansión Unleashed. Pack de 100 fundas con acabado mate para juego profesional.'
  },
  { 
    id: 4, name: 'One Piece TCG: Booster Display OP14 (24)', categories: ['ONE PIECE TCG', 'DISPLAYS'], pvp: 132.00, condition: 'Nuevo/Sellado', 
    img: 'https://b2b.asmodee.es/product/image/small/bopop14den_124183_0.png',
    desc: 'Caja de 24 sobres de la colección OP14. Incluye cartas del 3er Aniversario y arte alternativo exclusivo.'
  },
  { 
    id: 5, name: 'One Piece TCG: 3rd Anniversary Set', categories: ['ONE PIECE TCG', 'ACCESSORIES', 'NOVEDADES'], pvp: 199.99, condition: 'Nuevo/Sellado', 
    img: 'https://b2b.asmodee.es/product/image/small/bopj3aen_1.png',
    desc: 'Set de lujo limitado. Incluye Storage Box, tapete de juego y cartas promo especiales por el aniversario.'
  },
  { 
    id: 6, name: 'Naruto Earth Scroll Edition Display (20)', categories: ['NARUTO TCG', 'DISPLAYS'], pvp: 54.95, condition: 'Nuevo/Sellado', 
    img: 'https://b2b.asmodee.es/Content/Images/Products/KYNRTE02D.jpg',
    desc: 'Display de 20 sobres de la edición Earth Scroll. Colecciona a los ninjas más poderosos de la aldea oculta de la hoja.'
  },
  { 
    id: 7, name: 'Naruto Heaven Scroll Edition Display (12)', categories: ['NARUTO TCG', 'DISPLAYS'], pvp: 32.95, condition: 'Nuevo/Sellado', 
    img: 'https://b2b.asmodee.es/Content/Images/Products/KYNRTH02D.jpg',
    desc: 'Edición compacta Heaven Scroll con 12 sobres. Una forma perfecta de empezar tu colección de cartas Kayou.'
  },
  { 
    id: 8, name: 'Naruto Special Pack: Naruto vs Sasuke', categories: ['NARUTO TCG', 'NOVEDADES'], pvp: 12.99, condition: 'Nuevo/Sellado', 
    img: 'https://b2b.asmodee.es/Content/Images/Products/KYNRTM01E.jpg',
    desc: 'Pack especial que celebra la rivalidad legendaria entre Naruto y Sasuke con cartas exclusivas.'
  }
];

const categoriesData = ['TODOS', 'RIFTBOUND', 'ONE PIECE TCG', 'NARUTO TCG', 'ACCESSORIES', 'NOVEDADES'];

const bannerImages = [
  "/hero-riftbound.png",
  "https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&q=80&w=2000", // TCG theme
  "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?auto=format&fit=crop&q=80&w=2000"  // Dark gaming
];

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

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setIsCookieVisible(true), 1500);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsCookieVisible(false);
  };

  // Filtrado de productos por búsqueda y categorías (soporte multi-tag)
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

      {/* SIDE MENU (ELIMINADO) */}

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
            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => alert('Pasarela de pago conectando...')}>
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
                  if (window.scrollY < 400) window.scrollTo({ top: 800, behavior: 'smooth' });
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </nav>
      </header>

      {/* SEARCH RESULTS OVERLAY (Only if searching) */}
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
                window.scrollTo({ top: 800, behavior: 'smooth'});
              }}
            >
              {activeBanner === 0 ? 'VER PRODUCTOS' : 'EXPLORAR NOVEDADES'}
            </button>
          </div>
        </div>
        
        {/* CAROUSEL CONTROLS */}
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
          <p>© 2026 Central TCG España. Distribución oficial de Riftbound.</p>
          <div className="social-links">
            <span>Instagram</span> • <span>Twitter</span> • <span>Discord</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
