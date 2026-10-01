import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useShop } from '../App';

const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;

export default function Cart() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useShop();

  const shipping = cartTotal > 999 ? 0 : 99;
  const finalTotal = cartTotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <ShoppingBag size={36} color="var(--color-text-muted)" />
        </div>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Your cart is empty</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>Add some products to get started</p>
        <Link to="/products" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Browse Products <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
      <h1 className="section-title" style={{ marginBottom: 32 }}>Shopping Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }} className="cart-grid">
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cartItems.map((item, i) => (
            <div
              key={item.id}
              className="card animate-fade-in"
              style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center', animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <Link to={`/products/${item.id}`}>
                <img src={item.image} alt={item.name} style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }} />
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/products/${item.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </h3>
                </Link>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>{item.category}</p>
                <p style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Outfit', color: '#818cf8' }}>
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Quantity controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '6px 12px', flexShrink: 0 }}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex' }}>
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex' }}>
                  <Plus size={14} />
                </button>
              </div>

              <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Outfit', color: 'var(--color-text-primary)', minWidth: 80, textAlign: 'right', flexShrink: 0 }}>
                {formatPrice(item.price * item.quantity)}
              </span>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 8, flexShrink: 0, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 80 }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Shipping</span>
              <span style={{ fontWeight: 600, color: shipping === 0 ? '#10b981' : 'inherit' }}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>
            {shipping === 0 && (
              <p style={{ fontSize: 11, color: '#10b981', background: 'rgba(16,185,129,0.08)', padding: '6px 10px', borderRadius: 8 }}>
                🎉 You qualify for free delivery!
              </p>
            )}
          </div>

          <div className="divider" style={{ margin: '16px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
            <span style={{ fontSize: 24, fontWeight: 900, fontFamily: 'Outfit' }}>{formatPrice(finalTotal)}</span>
          </div>

          <Link to="/checkout" style={{ textDecoration: 'none', display: 'block' }}>
            <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, padding: '14px 24px' }}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </Link>

          <Link to="/products" style={{ textDecoration: 'none', display: 'block', marginTop: 10 }}>
            <button className="btn-secondary" style={{ width: '100%' }}>Continue Shopping</button>
          </Link>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 16 }}>
            🔒 Secure checkout · 30-day returns
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
