import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Plus, ShoppingCart, ChevronRight, Zap } from 'lucide-react';
import { useShop } from '../App';
import { getBundleForProduct, calculateBundlePrice } from '../utils/bundleEngine';

const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;

export default function SmartBundle({ product }) {
  const { addToCart, openCart } = useShop();
  const [bundleAdded, setBundleAdded] = useState(false);

  const bundleItems = getBundleForProduct(product);
  if (!bundleItems || bundleItems.length === 0) return null;

  const { total, bundlePrice, savings } = calculateBundlePrice(product, bundleItems);

  const handleAddBundle = () => {
    addToCart(product);
    bundleItems.forEach(item => addToCart(item));
    setBundleAdded(true);
    setTimeout(() => {
      setBundleAdded(false);
      openCart();
    }, 1000);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 20,
        padding: 24,
        marginTop: 32,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={18} color="white" />
        </div>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--color-text-primary)', marginBottom: 2 }}>
            Build Your Setup
          </h3>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Intelligently curated for {product.name}
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span className="badge badge-accent">
            <Zap size={10} />
            Smart Bundle
          </span>
        </div>
      </div>

      {/* Main product */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <BundleItem product={product} isMain />

        {bundleItems.map((item, i) => (
          <div key={item.id}>
            {/* Plus connector */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 24 }}>
              <div style={{ width: 1, height: '100%', background: 'rgba(99,102,241,0.2)' }} />
              <div style={{ width: 24, height: 24, border: '1px solid rgba(99,102,241,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.05)', flexShrink: 0 }}>
                <Plus size={12} color="#818cf8" />
              </div>
              <div style={{ width: 1, height: '100%', background: 'rgba(99,102,241,0.2)' }} />
            </div>
            <BundleItem product={item} reason={item.pairingReason} />
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(10,10,15,0.4)', borderRadius: 14, border: '1px solid rgba(99,102,241,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Individual total</span>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>{formatPrice(total)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Outfit', color: 'var(--color-text-primary)' }}>Bundle Price </span>
            <span style={{ fontSize: 13, background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '2px 8px', borderRadius: 100, border: '1px solid rgba(16,185,129,0.2)' }}>
              Save {formatPrice(savings)}
            </span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Outfit', color: '#818cf8' }}>{formatPrice(bundlePrice)}</span>
        </div>

        <button
          onClick={handleAddBundle}
          className="btn-primary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 24px' }}
        >
          {bundleAdded ? (
            '✓ Added to Cart'
          ) : (
            <><ShoppingCart size={16} /> Add Complete Setup to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

function BundleItem({ product, isMain, reason }) {
  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px',
          background: isMain ? 'rgba(99,102,241,0.08)' : 'rgba(22,22,31,0.6)',
          border: `1px solid ${isMain ? 'rgba(99,102,241,0.25)' : 'var(--color-border)'}`,
          borderRadius: 12,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.background = isMain ? 'rgba(99,102,241,0.12)' : 'rgba(22,22,31,0.9)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = isMain ? 'rgba(99,102,241,0.25)' : 'var(--color-border)'; e.currentTarget.style.background = isMain ? 'rgba(99,102,241,0.08)' : 'rgba(22,22,31,0.6)'; }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            {isMain && (
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#818cf8' }}>
                Your item
              </span>
            )}
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.name}
            </p>
          </div>
          {reason && (
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              {reason}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--color-text-primary)' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <ChevronRight size={14} color="var(--color-text-muted)" style={{ marginTop: 4 }} />
        </div>
      </div>
    </Link>
  );
}
