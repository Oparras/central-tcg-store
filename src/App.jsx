import React, { useState, useMemo } from 'react';
import { ShoppingCart, Menu, Search, User, ChevronLeft, ChevronRight, X, Trash2, Plus, Minus } from 'lucide-react';
import './index.css';

// Datos reales de productos Riftbound extraídos de Asmodee B2B
const productos = [
  { id: 1, name: 'Riftbound: Vendetta Vault', category: 'Vaults', pvp: 34.99, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/medium/rb04vb01en_1.png' },
  { id: 2, name: 'Riftbound: Unleashed Vault', category: 'Vaults', pvp: 34.99, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/medium/rb03bs01en_1.png' },
  { id: 3, name: 'Riftbound: Origins Booster Display (24)', category: 'Displays', pvp: 120.00, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/medium/rb01bd01den_1.png' },
  { id: 4, name: 'Riftbound: Vendetta Display (24)', category: 'Displays', pvp: 120.00, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/medium/rb04bd01den_1.png' },
  { id: 5, name: 'Riftbound: Unleashed Display (24)', category: 'Displays', pvp: 120.00, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/medium/rb03bd01den_1.png' },
  { id: 6, name: 'Riftbound: Spiritforged Display (24)', category: 'Displays', pvp: 120.00, condition: 'Nuevo/Sellado', img: 'https://b2b.asmodee.es/product/image/medium/rb02bd01den_1.png' }
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);

  // Filtrado de productos por búsqueda
  const filteredProducts = useMemo(() => {
    return productos.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

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
      {(isCartOpen || isMenuOpen || isUserOpen) && <div className="overlay" onClick={() => { setIsCartOpen(false); setIsMenuOpen(false); setIsUserOpen(false); }} />}

      {/* SIDE MENU (Burger) */}
      <aside className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>MENÚ</h3>
          <X onClick={() => setIsMenuOpen(false)} style={{ cursor: 'pointer' }} />
        </div>
        <nav className="sidebar-links">
          <a href="#" onClick={() => setIsMenuOpen(false)}>NOVEDADES</a>
          <a href="#" onClick={() => setIsMenuOpen(false)}>POKÉMON TCG</a>
          <a href="#" onClick={() => setIsMenuOpen(false)}>MAGIC: THE GATHERING</a>
          <a href="#" onClick={() => setIsMenuOpen(false)}>YU-GI-OH!</a>
          <a href="#" onClick={() => setIsMenuOpen(false)}>RIFTBOUND</a>
          <a href="#" onClick={() => setIsMenuOpen(false)}>ACCESORIOS</a>
        </nav>
      </aside>

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
        <div className="header-left">
          <Menu size={28} onClick={() => setIsMenuOpen(true)} className="icon-hover" />
        </div>
        
        <div className="header-center">
          <img src="/logo-central.png" alt="Central TCG Logo" style={{ height: '100px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        </div>

        <div className="header-right">
          <div className={`search-bar-inline ${isSearchOpen ? 'active' : ''}`}>
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => !searchQuery && setIsSearchOpen(false)}
              autoFocus
            />
          </div>
          <Search size={24} onClick={() => setIsSearchOpen(!isSearchOpen)} className="icon-hover" />
          <User size={24} onClick={() => setIsUserOpen(true)} className="icon-hover" />
          <div className="cart-trigger" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={24} className="icon-hover" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </div>
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
            <button className={`${activeBanner === 0 ? 'btn-primary' : 'btn-primary-ghost'}`} onClick={() => window.scrollTo({ top: 800, behavior: 'smooth'})}>
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
          <h2>NOVEDADES RIFTBOUND</h2>
        </div>

        <section className="card-grid">
          {filteredProducts.map(p => (
            <div className="product-card" key={p.id} onClick={() => alert(`Próximamente: Detalle de ${p.name}`)}>
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
          <h3>CENTRAL TCG</h3>
          <p>© 2026 Central TCG España. Distribución oficial de Riftbound.</p>
          <div className="social-dummy">
            <span>Instagram</span> • <span>Twitter</span> • <span>Discord</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
