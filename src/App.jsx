import React, { useState } from 'react';
import { ShoppingCart, Menu, Search, User, ChevronLeft, ChevronRight } from 'lucide-react';
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

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div>
      {/* HEADER TIPO SUNNYSTORE (Minimalista, 3 bloques) */}
      <header className="nav-header" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', padding: '1rem 5%', alignItems: 'center' }}>
        {/* Izquierda: Menú Hamburguesa */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Menu size={28} color="var(--text-main)" style={{ cursor: 'pointer' }} />
        </div>
        
        {/* Centro: Logo */}
        <div className="logo-text" style={{ textAlign: 'center', fontSize: '1.8rem' }}>
          CENTRAL TCG
        </div>

        {/* Derecha: Iconos Limpios */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'flex-end' }}>
          <Search size={24} color="var(--text-main)" style={{ cursor: 'pointer' }} />
          <User size={24} color="var(--text-main)" style={{ cursor: 'pointer' }} />
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => alert('¡Carrito premium en construcción!')}>
            <ShoppingCart size={24} color="var(--text-main)" />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-5px', right: '-8px', 
                background: 'var(--accent-primary)', color: '#000', 
                borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem', fontWeight: 800
              }}>
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* HERO BANNER TIPO SUNNYSTORE (Imagen Full Width) */}
      <section className="hero" style={{ padding: 0, position: 'relative', width: '100%', height: '50vh', background: 'linear-gradient(45deg, #1e293b, #0f172a)' }}>
        <img 
          src="https://images.unsplash.com/photo-1613917637841-f5af701b2298?auto=format&fit=crop&q=80&w=2000" 
          alt="Riftbound Banner" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} 
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '2px', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            RIFTBOUND: DISPONIBLE YA
          </h1>
          <button className="btn-primary" style={{ marginTop: '1rem', padding: '1rem 3rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            RESERVAR
          </button>
        </div>
      </section>

      {/* CONTROLES CARRUSEL TIPO SUNNYSTORE (Debajo de la imagen) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
        <ChevronLeft size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
        {[0,1,2].map(i => (
          <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i===0 ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer' }} />
        ))}
        <ChevronRight size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
      </div>

      {/* TÍTULO SECCIÓN */}
      <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 400, letterSpacing: '4px' }}>NOVEDADES RIFTBOUND</h2>
      </div>

      {/* CARD GRID (Productos Sellados Limpios) */}
      <section className="card-grid" style={{ maxWidth: '1400px', margin: '0 auto', gap: '3rem 1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {productos.map(p => (
          <div className="product-card" key={p.id} style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
            <div style={{ width: '100%', aspectRatio: '1', background: '#fff', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', position: 'relative' }}>
              <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s' }} className="product-img-hover" />
            </div>
            
            <div style={{ textAlign: 'center', flexGrow: 1 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>
                {p.category}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.4 }}>
                {p.name}
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>€{p.pvp.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); setCartCount(c => c + 1); }}
              style={{ 
                marginTop: '1rem', background: 'transparent', border: '1px solid var(--text-muted)', 
                color: 'var(--text-main)', padding: '10px', borderRadius: '4px', textTransform: 'uppercase', 
                fontSize: '0.8rem', letterSpacing: '1px', transition: 'all 0.2s', width: '100%' 
              }}
              onMouseEnter={(e) => { e.target.style.background = 'var(--text-main)'; e.target.style.color = '#000'; }}
              onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-main)'; }}
            >
              Añadir al Carrito
            </button>
          </div>
        ))}
      </section>
      
      {/* FOOTER */}
      <footer style={{ padding: '4rem 5%', borderTop: '1px solid var(--glass-border)', marginTop: '4rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Central TCG</h3>
          <p>© 2026 Central TCG España. Distribución oficial.</p>
        </div>
      </footer>
    </div>
  );
}
