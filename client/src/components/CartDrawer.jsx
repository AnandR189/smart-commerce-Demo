import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useShop } from '../App';

const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;

export default function CartDrawer() {
  const { cartOpen, closeCart, cartItems, cartTotal, removeFromCart, updateQuantity, cartCount } = useShop();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)', zIndex: 200,
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '100%', maxWidth: 420,
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          zIndex: 201,
          transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingCart size={20} color="var(--color-accent-light)" />
            <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Outfit' }}>Your Cart</h2>
            {cartCount > 0 && (
              <span style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: '50%', width: 24, height: 24, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount}
              </span>
            )}
          </div>
          <button onClick={closeCart} style={{ padding: 8, borderRadius: 8, background: 'var(--color-surface-2)', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: 64, height: 64, background: 'var(--color-surface-2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShoppingCart size={28} color="var(--color-text-muted)" />
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: 8 }}>Your cart is empty</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 24 }}>Add some products to get started</p>
              <Link to="/products" onClick={closeCart}>
                <button className="btn-primary" style={{ margin: '0 auto' }}>Browse Products</button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="animate-fade-in"
                  style={{ display: 'flex', gap: 12, padding: 12, background: 'var(--color-surface-2)', borderRadius: 12, border: '1px solid var(--color-border)' }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#818cf8', marginBottom: 8 }}>
                      {formatPrice(item.price)}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-surface)', borderRadius: 8, padding: '4px 8px', border: '1px solid var(--color-border)' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', padding: 2 }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', padding: 2 }}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', transition: 'color 0.2s', padding: 4 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Subtotal</span>
              <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit', color: 'var(--color-text-primary)' }}>
                {formatPrice(cartTotal)}
              </span>
            </div>
            <Link to="/checkout" onClick={closeCart} style={{ textDecoration: 'none', display: 'block' }}>
              <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/cart" onClick={closeCart} style={{ textDecoration: 'none', display: 'block', marginTop: 8 }}>
              <button className="btn-secondary" style={{ width: '100%' }}>View Full Cart</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
