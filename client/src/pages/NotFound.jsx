import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 24, lineHeight: 1 }}>🔌</div>
      <h1 style={{ fontFamily: 'Outfit', fontSize: 40, fontWeight: 900, letterSpacing: '-1px', marginBottom: 12 }}>
        404
      </h1>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: 'var(--color-text-primary)' }}>
        Page not found
      </h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 15, marginBottom: 36, lineHeight: 1.6 }}>
        Looks like this page got disconnected. Let's get you back online.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Home size={16} /> Go Home
          </button>
        </Link>
        <Link to="/products" style={{ textDecoration: 'none' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={16} /> Browse Products
          </button>
        </Link>
      </div>
    </div>
  );
}
