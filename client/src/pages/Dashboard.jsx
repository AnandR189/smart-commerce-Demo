import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, TrendingDown, ShoppingCart, Users, Package, Eye, Trash2, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../App';
import Sparkline from '../components/Sparkline';
import api from '../utils/api';

const formatPrice = (p) => p != null ? `₹${Number(p).toLocaleString('en-IN')}` : '—';

export default function Dashboard() {
  const { user, isLoggedIn, refreshUser, logout } = useAuth();
  const { addToCart, openCart } = useShop();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [groupCarts, setGroupCarts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login', { state: { from: '/dashboard' } }); return; }
    Promise.all([
      api.get('/orders').catch(() => ({ data: { data: [] } })),
      api.get('/group-carts/my/list').catch(() => ({ data: { data: [] } })),
      refreshUser(),
    ]).then(([ordersRes, cartsRes]) => {
      setOrders(ordersRes.data.data || []);
      setGroupCarts(cartsRes.data.data || []);
    }).finally(() => setLoadingData(false));
  }, [isLoggedIn]);

  // Price alerts (current price <= target)
  const priceAlerts = (user?.priceWatches || []).filter(w => {
    const prod = w.productId;
    const currentPrice = prod?.price;
    return currentPrice && currentPrice <= w.targetPrice;
  });

  const allWatches = user?.priceWatches || [];

  const removeWatch = async (productId) => {
    await api.delete(`/products/${productId}/watch`);
    await refreshUser();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loadingData) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div className="shimmer" style={{ height: 40, borderRadius: 10, marginBottom: 24, width: '40%' }} />
        {[1,2,3].map(i => <div key={i} className="shimmer" style={{ height: 80, borderRadius: 14, marginBottom: 12 }} />)}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutDashboard size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>Dashboard</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Welcome back, {user?.name}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
        >
          Sign Out
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
        {[
          { label: 'Orders', value: orders.length, icon: <Package size={20} />, color: '#6366f1' },
          { label: 'Price Watches', value: allWatches.length, icon: <Bell size={20} />, color: '#f59e0b' },
          { label: 'Active Alerts', value: priceAlerts.length, icon: <TrendingDown size={20} />, color: '#10b981' },
          { label: 'Group Carts', value: groupCarts.length, icon: <Users size={20} />, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 900, fontFamily: 'Outfit', color: 'var(--color-text-primary)', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Drop Alerts */}
      {priceAlerts.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingDown size={18} color="#10b981" />
            <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700 }}>🎉 Price Drop Alerts</h2>
            <span className="badge badge-success">{priceAlerts.length} triggered</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {priceAlerts.map((watch, i) => {
              const prod = watch.productId;
              if (!prod) return null;
              return (
                <div key={i} className="card animate-fade-in" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center', border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.04)' }}>
                  <img src={prod.image} alt={prod.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>{prod.name}</p>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Outfit', color: '#10b981' }}>{formatPrice(prod.price)}</span>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Your target: {formatPrice(watch.targetPrice)}</span>
                      <span className="badge badge-success"><TrendingDown size={10} /> Price dropped!</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => { addToCart({ ...prod, id: prod._id }); openCart(); }} className="btn-primary" style={{ padding: '8px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                    <Link to={`/products/${prod._id}`}>
                      <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }}>View</button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Watch List */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} color="#f59e0b" />
            <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700 }}>Price Watch List</h2>
          </div>
          <Link to="/products" style={{ fontSize: 13, color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>+ Add more</Link>
        </div>

        {allWatches.length === 0 ? (
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <Bell size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: 6 }}>No price watches yet</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 16 }}>Visit a product page and tap "Watch" to track price drops</p>
            <Link to="/products"><button className="btn-primary" style={{ fontSize: 13 }}>Browse Products</button></Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {allWatches.map((watch, i) => {
              const prod = watch.productId;
              if (!prod) return null;
              const triggered = prod.price <= watch.targetPrice;
              return (
                <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img src={prod.image} alt={prod.name} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>{prod.name}</p>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: triggered ? '#10b981' : 'var(--color-text-primary)' }}>{formatPrice(prod.price)}</span>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Target: {formatPrice(watch.targetPrice)}</span>
                      {triggered && <span className="badge badge-success" style={{ fontSize: 10 }}>✓ Triggered</span>}
                    </div>
                  </div>
                  {prod.priceHistory?.length > 1 && (
                    <Sparkline data={prod.priceHistory} width={80} height={28} color={triggered ? '#10b981' : '#6366f1'} />
                  )}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <Link to={`/products/${prod._id}`}>
                      <button className="btn-ghost" style={{ padding: '6px 10px' }}><Eye size={14} /></button>
                    </Link>
                    <button onClick={() => removeWatch(prod._id)} className="btn-ghost" style={{ padding: '6px 10px', color: '#ef4444' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Package size={18} color="#6366f1" />
          <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700 }}>Recent Orders</h2>
        </div>
        {orders.length === 0 ? (
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No orders yet. <Link to="/products" style={{ color: '#818cf8' }}>Start shopping!</Link></p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {orders.slice(0, 5).map(order => (
              <div key={order._id} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                    Order #{order._id?.slice(-6).toUpperCase()}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {order.items?.length} item(s) · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Outfit' }}>{formatPrice(order.total)}</span>
                  <span className={`badge ${order.status === 'confirmed' ? 'badge-success' : 'badge-accent'}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group Carts */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color="#8b5cf6" />
            <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700 }}>Group Carts</h2>
          </div>
          <Link to="/group-cart" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: 13, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={14} /> New Group Cart
            </button>
          </Link>
        </div>
        {groupCarts.length === 0 ? (
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <Users size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: 6 }}>No group carts yet</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 16 }}>Create a shared cart and invite friends</p>
            <Link to="/group-cart"><button className="btn-primary" style={{ fontSize: 13 }}>Create Group Cart</button></Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {groupCarts.map(cart => (
              <Link key={cart._id} to={`/group-cart/${cart.inviteCode}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 20, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <p style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: 14 }}>{cart.name}</p>
                    <span className={`badge ${cart.status === 'open' ? 'badge-success' : 'badge-accent'}`}>{cart.status}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
                    {cart.items?.length || 0} items · {cart.members?.length || 1} members
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: 100, border: '1px solid rgba(99,102,241,0.2)' }}>
                      Code: {cart.inviteCode}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
