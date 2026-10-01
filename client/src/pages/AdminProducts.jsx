import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, TrendingDown, TrendingUp, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sparkline from '../components/Sparkline';
import api from '../utils/api';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function AdminProducts() {
  const { isAdmin, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // productId
  const [newPrice, setNewPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/'); return; }
    api.get('/products').then(res => {
      setProducts(res.data.data || []);
    }).finally(() => setLoading(false));
  }, [isAdmin, isLoggedIn]);

  const startEdit = (product) => {
    setEditing(product._id);
    setNewPrice(product.price.toString());
    setMessage('');
  };

  const cancelEdit = () => {
    setEditing(null);
    setNewPrice('');
  };

  const savePrice = async (productId) => {
    if (!newPrice || Number(newPrice) <= 0) {
      setMessage('Enter a valid price');
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.put(`/products/${productId}/price`, { price: Number(newPrice) });
      setProducts(ps => ps.map(p => p._id === productId ? { ...p, price: data.data.price, priceHistory: data.data.priceHistory } : p));
      setEditing(null);
      setMessage(`✅ Price updated to ₹${Number(newPrice).toLocaleString('en-IN')}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update price');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {[1,2,3,4].map(i => <div key={i} className="shimmer" style={{ height: 72, borderRadius: 12, marginBottom: 10 }} />)}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={20} color="white" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800 }}>Admin — Price Manager</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Update product prices. Changes are logged to price history automatically.</p>
        </div>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', background: message.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.includes('✅') ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: 10, marginBottom: 20, color: message.includes('✅') ? '#10b981' : '#ef4444', fontSize: 14 }}>
          {message}
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
              {['Product', 'Category', 'Current Price', '30d Trend', 'Low / High', 'Action'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const history = p.priceHistory || [];
              const prices = history.map(h => h.price);
              const low = prices.length ? Math.min(...prices) : p.price;
              const high = prices.length ? Math.max(...prices) : p.price;
              const isEditing = editing === p._id;
              const trend = prices.length > 1 ? (prices[prices.length - 1] > prices[0] ? 'up' : 'down') : 'flat';

              return (
                <tr key={p._id} style={{ borderBottom: i < products.length - 1 ? '1px solid var(--color-border)' : 'none', background: isEditing ? 'rgba(99,102,241,0.04)' : 'transparent', transition: 'background 0.2s' }}>
                  {/* Product */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>{p.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{history.length} price records</p>
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge badge-accent" style={{ fontSize: 11 }}>{p.category}</span>
                  </td>
                  {/* Current Price */}
                  <td style={{ padding: '14px 16px' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'var(--color-text-muted)', fontWeight: 700, fontSize: 13 }}>₹</span>
                        <input
                          className="input"
                          type="number"
                          value={newPrice}
                          onChange={e => setNewPrice(e.target.value)}
                          autoFocus
                          style={{ width: 110, height: 36, fontSize: 14, fontWeight: 700, padding: '0 10px' }}
                          onKeyDown={e => { if (e.key === 'Enter') savePrice(p._id); if (e.key === 'Escape') cancelEdit(); }}
                        />
                      </div>
                    ) : (
                      <span style={{ fontSize: 16, fontWeight: 900, fontFamily: 'Outfit', color: 'var(--color-text-primary)' }}>{formatPrice(p.price)}</span>
                    )}
                  </td>
                  {/* Sparkline */}
                  <td style={{ padding: '14px 16px' }}>
                    {history.length > 1 ? (
                      <Sparkline data={history} width={100} height={32} color={trend === 'up' ? '#ef4444' : '#10b981'} />
                    ) : <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>No history</span>}
                  </td>
                  {/* Low/High */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#10b981', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <TrendingDown size={11} /> {formatPrice(low)}
                      </span>
                      <span style={{ fontSize: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <TrendingUp size={11} /> {formatPrice(high)}
                      </span>
                    </div>
                  </td>
                  {/* Action */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {isEditing ? (
                        <>
                          <button onClick={() => savePrice(p._id)} disabled={saving} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Check size={13} /> {saving ? 'Saving…' : 'Save'}
                          </button>
                          <button onClick={cancelEdit} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <X size={13} /> Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(p)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Edit2 size={13} /> Edit Price
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 16, textAlign: 'center' }}>
        Price changes are appended to the product's priceHistory, visible to customers as a 30-day sparkline.
      </p>
    </div>
  );
}
