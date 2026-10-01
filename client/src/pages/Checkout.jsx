import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Truck } from 'lucide-react';
import { useShop } from '../App';

const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useShop();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: info, 2: shipping, 3: review
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
  });
  const [errors, setErrors] = useState({});

  const shipping = cartTotal > 999 ? 0 : 99;
  const finalTotal = cartTotal + shipping;

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = (fields) => {
    const newErrors = {};
    fields.forEach(f => {
      if (!form[f]?.trim()) newErrors[f] = 'This field is required';
    });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) newErrors.phone = 'Enter 10-digit number';
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Enter valid 6-digit pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validate(['firstName', 'lastName', 'email', 'phone'])) return;
    if (step === 2 && !validate(['address', 'city', 'state', 'pincode'])) return;
    setStep(s => s + 1);
  };

  const placeOrder = async () => {
    setPlacing(true);

    // Simulate API call
    const orderData = {
      customer: { ...form },
      items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      total: finalTotal,
      shipping,
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
    } catch {
      // Backend not available — proceed with mock success
    }

    setTimeout(() => {
      clearCart();
      navigate('/order-success', { state: { order: { ...orderData, id: `SC${Date.now()}` } } });
    }, 1500);
  };

  if (cartItems.length === 0 && !placing) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
      <h1 className="section-title" style={{ marginBottom: 32 }}>Checkout</h1>

      {/* Steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
        {['Contact', 'Shipping', 'Review'].map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: done ? '#10b981' : active ? '#6366f1' : 'var(--color-surface-2)',
                  border: `2px solid ${done ? '#10b981' : active ? '#6366f1' : 'var(--color-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s',
                  fontSize: 13, fontWeight: 700, color: 'white',
                }}>
                  {done ? <Check size={15} /> : n}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: active ? 'var(--color-text-primary)' : 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div style={{ flex: 1, height: 1, background: step > n ? '#10b981' : 'var(--color-border)', margin: '0 16px', transition: 'background 0.3s' }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }} className="checkout-grid">
        {/* Form */}
        <div className="card" style={{ padding: 32 }}>
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Contact Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="First Name" value={form.firstName} onChange={v => update('firstName', v)} error={errors.firstName} placeholder="Arjun" />
                <FormField label="Last Name" value={form.lastName} onChange={v => update('lastName', v)} error={errors.lastName} placeholder="Sharma" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <FormField label="Email" type="email" value={form.email} onChange={v => update('email', v)} error={errors.email} placeholder="arjun@email.com" />
                <FormField label="Phone" type="tel" value={form.phone} onChange={v => update('phone', v)} error={errors.phone} placeholder="9876543210" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Shipping Address</h2>
              <FormField label="Street Address" value={form.address} onChange={v => update('address', v)} error={errors.address} placeholder="123, MG Road" style={{ marginBottom: 16 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 16, marginTop: 16 }}>
                <FormField label="City" value={form.city} onChange={v => update('city', v)} error={errors.city} placeholder="Bengaluru" />
                <FormField label="State" value={form.state} onChange={v => update('state', v)} error={errors.state} placeholder="Karnataka" />
                <FormField label="Pincode" value={form.pincode} onChange={v => update('pincode', v)} error={errors.pincode} placeholder="560001" />
              </div>
              <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Truck size={16} color="#10b981" />
                <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>
                  {shipping === 0 ? 'Free shipping on this order!' : `₹${shipping} shipping charge`}
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Review Your Order</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 12, padding: '12px', background: 'var(--color-surface-2)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                    <img src={item.image} alt={item.name} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text-primary)' }}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: '16px', background: 'var(--color-surface-2)', borderRadius: 12, border: '1px solid var(--color-border)', marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>Delivering to</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {form.firstName} {form.lastName}
                </p>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {form.address}, {form.city}, {form.state} – {form.pincode}
                </p>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{form.email} · {form.phone}</p>
              </div>

              <button
                className="btn-primary"
                onClick={placeOrder}
                disabled={placing}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, padding: '14px 24px' }}
              >
                {placing ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    Placing Order...
                  </span>
                ) : (
                  <>Place Order · {formatPrice(finalTotal)} <ChevronRight size={16} /></>
                )}
              </button>
              <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 12 }}>
                🔒 Simulated checkout — no real payment processed
              </p>
            </div>
          )}

          {/* Navigation */}
          {step < 3 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
              {step > 1 ? (
                <button className="btn-secondary" onClick={() => setStep(s => s - 1)}>Back</button>
              ) : <div />}
              <button className="btn-primary" onClick={nextStep} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                Continue <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 80 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{item.name} ×{item.quantity}</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="divider" style={{ margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 12 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Shipping</span>
            <span style={{ color: shipping === 0 ? '#10b981' : 'inherit' }}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>
          <div className="divider" style={{ margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontFamily: 'Outfit', fontSize: 18 }}>
            <span>Total</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function FormField({ label, value, onChange, error, placeholder, type = 'text', style = {} }) {
  return (
    <div style={style}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
        {label}
      </label>
      <input
        className="input"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ borderColor: error ? '#ef4444' : undefined }}
      />
      {error && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}
