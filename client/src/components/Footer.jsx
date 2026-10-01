import { Link } from 'react-router-dom';
import { Zap, Globe, Code2, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)', marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={14} color="white" fill="white" />
              </div>
              <span className="tag" style={{ fontSize: 16, color: 'var(--color-text-primary)' }}>
                Smart<span style={{ color: '#818cf8' }}>Commerce</span>
              </span>
            </Link>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, lineHeight: 1.6, maxWidth: 220 }}>
              Premium electronics with intelligent shopping assistance.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              {[Globe, Code2, Share2].map((Icon, i) => (
                <button key={i} style={{ padding: 8, borderRadius: 8, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', cursor: 'pointer', color: 'var(--color-text-muted)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.borderColor = 'var(--color-border-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-text-primary)', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Shop</h4>
            {['All Products', 'Audio', 'Wearables', 'Workspace', 'Accessories'].map(item => (
              <Link key={item} to={`/products?category=${item.toLowerCase()}`} style={{ display: 'block', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: 13, marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                {item}
              </Link>
            ))}
          </div>

          <div>
            <h4 style={{ color: 'var(--color-text-primary)', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Support</h4>
            {['Help Center', 'Returns', 'Order Tracking', 'Warranty', 'Contact Us'].map(item => (
              <span key={item} style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 10, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                {item}
              </span>
            ))}
          </div>

          <div>
            <h4 style={{ color: 'var(--color-text-primary)', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Newsletter</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>
              Get exclusive deals and tech insights.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="Your email" style={{ fontSize: 13, height: 40 }} />
              <button className="btn-primary" style={{ padding: '0 16px', whiteSpace: 'nowrap', height: 40 }}>Join</button>
            </div>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: 24 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
            © 2026 SmartCommerce. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <span key={item} style={{ color: 'var(--color-text-muted)', fontSize: 12, cursor: 'pointer' }}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
