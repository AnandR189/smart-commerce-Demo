import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Star, ShieldCheck } from 'lucide-react';
import { getFeaturedProducts, getTrendingProducts } from '../data/products';
import { categories } from '../data/categories';
import ProductGrid from '../components/ProductGrid';

export default function Home() {
  const featured = getFeaturedProducts();
  const trending = getTrendingProducts();
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '60px 24px',
        }}
      >
        {/* Background glow */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '10%', left: '20%',
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            borderRadius: '50%', transform: 'translate(-50%, -50%)',
          }} />
          <div style={{
            position: 'absolute', top: '60%', right: '10%',
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}
            className="grid-hero"
          >
            {/* Left copy */}
            <div className="animate-slide-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
                <span className="badge badge-accent">
                  <Sparkles size={10} /> New Intelligence Layer
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'Outfit',
                  fontSize: 'clamp(36px, 5.5vw, 72px)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-2px',
                  marginBottom: 24,
                }}
              >
                Shop Smarter.
                <br />
                <span className="gradient-text">Build Better.</span>
              </h1>

              <p style={{ fontSize: 18, color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
                Premium consumer electronics with AI-powered bundle recommendations and real purchase confidence scores.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  className="btn-primary animate-pulse-glow"
                  onClick={() => navigate('/products')}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', fontSize: 15 }}
                >
                  Shop Now <ArrowRight size={18} />
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => navigate('/products?category=audio')}
                  style={{ padding: '14px 28px', fontSize: 15 }}
                >
                  Explore Audio
                </button>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
                {[
                  { icon: <ShieldCheck size={14} />, text: '30-day returns' },
                  { icon: <Zap size={14} />, text: 'Fast delivery' },
                  { icon: <Star size={14} />, text: '4.6+ avg rating' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 13 }}>
                    <span style={{ color: '#818cf8' }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Featured product card preview */}
            <div className="animate-fade-in delay-2" style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
                border: '1px solid var(--color-border)',
                borderRadius: 24,
                overflow: 'hidden',
                aspectRatio: '1/1',
                maxWidth: 460,
                margin: '0 auto',
              }}>
                <img
                  src={featured[0]?.image}
                  alt={featured[0]?.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Overlay card */}
                <div style={{
                  position: 'absolute', bottom: 20, left: 20, right: 20,
                  background: 'rgba(10,10,15,0.85)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 16, padding: '16px 20px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: 12, color: '#818cf8', fontWeight: 600, marginBottom: 4 }}>Featured Pick</p>
                      <p style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--color-text-primary)' }}>
                        {featured[0]?.name}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Outfit', color: 'var(--color-text-primary)' }}>
                        ₹{featured[0]?.price.toLocaleString('en-IN')}
                      </p>
                      <p style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>
                        Confidence Score: {featured[0]?.confidence.score}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div style={{
                position: 'absolute', top: -12, right: 20,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', padding: '8px 16px', borderRadius: 100,
                fontSize: 12, fontWeight: 700,
                boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
              }}>
                <Sparkles size={11} style={{ display: 'inline', marginRight: 4 }} />
                Smart Bundle Ready
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .grid-hero { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
        `}</style>
      </section>

      {/* Categories */}
      <section style={{ padding: '60px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" style={{ textDecoration: 'none', fontSize: 14, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
            View all <ArrowRight size={15} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {categories.map((cat, i) => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} style={{ textDecoration: 'none' }}>
              <div
                className="card animate-fade-in"
                style={{ padding: '24px 20px', cursor: 'pointer', animationDelay: `${i * 0.07}s`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{cat.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>{cat.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>{cat.description}</p>
                <span style={{ fontSize: 11, color: '#818cf8', fontWeight: 600 }}>{cat.count} products →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '0 24px 60px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>Hand-picked for excellence</p>
          </div>
          <Link to="/products" style={{ textDecoration: 'none', fontSize: 14, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* Smart Recommendations Banner */}
      <section style={{ padding: '0 24px 60px', maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 24,
            padding: '40px 48px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 32,
            alignItems: 'center',
          }}
          className="banner-grid"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Sparkles size={20} color="#818cf8" />
              <span className="badge badge-accent">Feature Highlight</span>
            </div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12, color: 'var(--color-text-primary)' }}>
              Build Your Perfect Setup
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.7, maxWidth: 540, marginBottom: 24 }}>
              Our Smart Bundle Builder intelligently curates complementary products based on what you're viewing — saving you up to 12% compared to buying individually.
            </p>
            <button className="btn-primary" onClick={() => navigate('/products')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Try it now <ArrowRight size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 220 }} className="banner-stats">
            {[
              { label: 'Bundle savings', value: 'Up to 12%' },
              { label: 'Curated combos', value: '40+ setups' },
              { label: 'Avg confidence', value: '91% score' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(10,10,15,0.4)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#818cf8' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .banner-grid { grid-template-columns: 1fr !important; }
            .banner-stats { display: none !important; }
          }
        `}</style>
      </section>

      {/* Trending */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 className="section-title">Trending Now</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>What everyone's buying</p>
          </div>
          <Link to="/products" style={{ textDecoration: 'none', fontSize: 14, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <ProductGrid products={trending} />
      </section>
    </div>
  );
}
