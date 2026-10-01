import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  const orderId = order?.id || `SC${Date.now()}`;
  const customerName = order?.customer?.firstName || 'Valued Customer';
  const total = order?.total;

  const formatPrice = (p) => p ? `₹${p.toLocaleString('en-IN')}` : '';

  const steps = [
    { icon: <CheckCircle size={20} />, label: 'Order Confirmed', done: true, time: 'Just now' },
    { icon: <Package size={20} />, label: 'Processing', done: false, time: 'Within 2 hours' },
    { icon: <Truck size={20} />, label: 'Out for Delivery', done: false, time: '2–4 business days' },
    { icon: <Home size={20} />, label: 'Delivered', done: false, time: 'Estimated arrival' },
  ];

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px 80px', textAlign: 'center' }}>
      {/* Success animation */}
      <div
        style={{
          width: 96, height: 96,
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)',
          border: '2px solid rgba(16,185,129,0.3)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 0 40px rgba(16,185,129,0.2)',
          animation: 'scaleIn 0.5s ease',
        }}
      >
        <CheckCircle size={44} color="#10b981" />
      </div>

      <div className="animate-slide-up">
        <h1 style={{ fontFamily: 'Outfit', fontSize: 36, fontWeight: 900, letterSpacing: '-1px', marginBottom: 8 }}>
          Order Placed! 🎉
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 16, marginBottom: 8 }}>
          Thank you, {customerName}! Your order is confirmed.
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 32 }}>
          Order ID: <span style={{ color: '#818cf8', fontWeight: 700 }}>{orderId}</span>
        </p>

        {/* Order card */}
        <div className="card" style={{ padding: 28, textAlign: 'left', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700 }}>Order Details</h2>
            {total && (
              <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Outfit', color: '#818cf8' }}>
                {formatPrice(total)}
              </span>
            )}
          </div>

          {order?.items?.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)', fontSize: 14 }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>{item.name} ×{item.quantity}</span>
              <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}

          {order?.customer && (
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--color-surface-2)', borderRadius: 10 }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Delivering to</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {order.customer.address}, {order.customer.city}
              </p>
            </div>
          )}
        </div>

        {/* Tracking steps */}
        <div className="card" style={{ padding: 24, textAlign: 'left', marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Tracking Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {steps.map((s, i) => (
              <div key={s.label} style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: i < steps.length - 1 ? 20 : 0 }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', left: 15, top: 32, bottom: 0, width: 2, background: s.done ? '#10b981' : 'var(--color-border)' }} />
                )}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: s.done ? 'rgba(16,185,129,0.1)' : 'var(--color-surface-2)',
                  border: `2px solid ${s.done ? '#10b981' : 'var(--color-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.done ? '#10b981' : 'var(--color-text-muted)',
                  zIndex: 1,
                }}>
                  {s.icon}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: s.done ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Home size={16} /> Back to Home
            </button>
          </Link>
          <Link to="/products" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingBag size={16} /> Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
