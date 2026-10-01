import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ChevronRight, Truck, RotateCcw, Shield, Check, Bell, BellOff, TrendingDown } from 'lucide-react';
import { useShop } from '../App';
import { useAuth } from '../context/AuthContext';
import SmartBundle from '../components/SmartBundle';
import ConfidencePanel from '../components/ConfidencePanel';
import Sparkline from '../components/Sparkline';
import NotFound from './NotFound';
import api from '../utils/api';
import { getProductById } from '../data/products'; // local fallback

const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;
const discountPct = (orig, curr) => Math.round(((orig - curr) / orig) * 100);

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isWishlisted, openCart } = useShop();
  const { isLoggedIn, refreshUser, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Price Watch
  const [watchTarget, setWatchTarget] = useState('');
  const [watching, setWatching] = useState(false);
  const [watchLoading, setWatchLoading] = useState(false);
  const [watchMsg, setWatchMsg] = useState('');

  // Fetch from API (with local fallback)
  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(res => {
        const p = res.data.data;
        // Map MongoDB _id to id for compatibility
        setProduct({ ...p, id: p._id || p.id });
      })
      .catch(() => {
        // Fallback to local data
        const local = getProductById(id);
        if (local) setProduct(local);
        else setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Check if user is watching this product
  useEffect(() => {
    if (user?.priceWatches && product) {
      const watch = user.priceWatches.find(w => {
        const wid = w.productId?._id || w.productId;
        return wid === product._id || wid === product.id;
      });
      if (watch) { setWatching(true); setWatchTarget(watch.targetPrice); }
    }
  }, [user, product]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => { setAdded(false); openCart(); }, 600);
  };

  const handleWatch = async () => {
    if (!isLoggedIn) { setWatchMsg('Sign in to watch prices'); return; }
    if (!watchTarget || watchTarget <= 0) { setWatchMsg('Enter a valid target price'); return; }
    setWatchLoading(true);
    try {
      await api.post(`/products/${product._id || product.id}/watch`, { targetPrice: Number(watchTarget) });
      setWatching(true);
      setWatchMsg('Price watch enabled!');
      await refreshUser();
      setTimeout(() => setWatchMsg(''), 3000);
    } catch (err) {
      setWatchMsg(err.response?.data?.error || 'Failed to set watch');
    } finally { setWatchLoading(false); }
  };

  const handleUnwatch = async () => {
    setWatchLoading(true);
    try {
      await api.delete(`/products/${product._id || product.id}/watch`);
      setWatching(false);
      setWatchTarget('');
      setWatchMsg('Price watch removed');
      await refreshUser();
      setTimeout(() => setWatchMsg(''), 3000);
    } catch { setWatchMsg('Error removing watch'); }
    finally { setWatchLoading(false); }
  };

  if (loading) return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }} className="product-grid">
        <div className="shimmer" style={{ aspectRatio: '1/1', borderRadius: 20 }} />
        <div>
          <div className="shimmer" style={{ height: 20, width: '40%', borderRadius: 8, marginBottom: 16 }} />
          <div className="shimmer" style={{ height: 40, width: '80%', borderRadius: 8, marginBottom: 20 }} />
          <div className="shimmer" style={{ height: 50, borderRadius: 8, marginBottom: 20 }} />
          <div className="shimmer" style={{ height: 48, borderRadius: 12 }} />
        </div>
      </div>
    </div>
  );

  if (notFound || !product) return <NotFound />;

  const wishlisted = isWishlisted(product.id || product._id);
  const priceHistory = product.priceHistory || [];
  const lowestPrice = priceHistory.length ? Math.min(...priceHistory.map(h => h.price)) : product.price;
  const isAtLowest = product.price <= lowestPrice;
  const savings30d = product.price > lowestPrice ? null : null;

  const tabs = [
    { id: 'description', label: 'Overview' },
    { id: 'specs', label: 'Specifications' },
    { id: 'highlights', label: 'Highlights' },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 80px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, color: 'var(--color-text-muted)', fontSize: 13 }}>
        <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Products</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-text-secondary)' }}>{product.name}</span>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="product-grid">
        {/* Images */}
        <div>
          <div style={{ aspectRatio: '1/1', background: 'var(--color-surface)', borderRadius: 20, border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 16 }}>
            <img src={product.images?.[selectedImage] || product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 10 }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', border: `2px solid ${selectedImage === i ? '#6366f1' : 'var(--color-border)'}`, cursor: 'pointer', padding: 0, background: 'none' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-text-muted)' }}>{product.category}</span>
            {product.badge && <span className="badge badge-accent">{product.badge}</span>}
            {product.inStock
              ? <span className="badge badge-success"><Check size={10} /> In Stock</span>
              : <span className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Out of Stock</span>
            }
            {isAtLowest && (
              <span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                <TrendingDown size={10} /> Lowest in 30d
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16, lineHeight: 1.2 }}>{product.name}</h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= Math.round(product.rating) ? '#f59e0b' : 'none'} color={i <= Math.round(product.rating) ? '#f59e0b' : 'var(--color-text-muted)'} />)}
            </div>
            <span style={{ fontWeight: 700 }}>{product.rating}</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>({(product.reviews || 0).toLocaleString()} reviews)</span>
          </div>

          {/* Price + Sparkline */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 900, fontFamily: 'Outfit' }}>{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span style={{ fontSize: 18, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>
                    <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>-{discountPct(product.originalPrice, product.price)}%</span>
                  </>
                )}
              </div>
              {priceHistory.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>30-day low: {formatPrice(lowestPrice)}</span>
                </div>
              )}
            </div>
            {priceHistory.length > 1 && (
              <div style={{ flexShrink: 0 }}>
                <Sparkline data={priceHistory} width={100} height={36} color="#6366f1" />
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 2 }}>30d price</p>
              </div>
            )}
          </div>

          {/* Qty + Cart + Wishlist */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '8px 16px' }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 18, lineHeight: 1 }}>−</button>
              <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 18, lineHeight: 1 }}>+</button>
            </div>
            <button onClick={handleAddToCart} disabled={!product.inStock} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, padding: '12px 24px' }}>
              {added ? <><Check size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
            </button>
            <button onClick={() => toggleWishlist({ ...product, id: product._id || product.id })} style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: wishlisted ? 'rgba(239,68,68,0.1)' : 'var(--color-surface-2)', border: `1px solid ${wishlisted ? 'rgba(239,68,68,0.3)' : 'var(--color-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
              <Heart size={20} fill={wishlisted ? '#ef4444' : 'none'} color={wishlisted ? '#ef4444' : 'var(--color-text-secondary)'} />
            </button>
          </div>

          {/* Price Watch */}
          <div style={{ padding: '16px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 14, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Bell size={15} color="#818cf8" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>Price Drop Watch</span>
              {watching && <span className="badge badge-success" style={{ fontSize: 10 }}>Active</span>}
            </div>
            {watching ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  Watching for drops below <strong style={{ color: '#818cf8' }}>₹{Number(watchTarget).toLocaleString('en-IN')}</strong>
                </p>
                <button onClick={handleUnwatch} disabled={watchLoading} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <BellOff size={13} /> Remove
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 600 }}>₹</span>
                  <input
                    className="input"
                    type="number"
                    placeholder={`Target price (e.g. ${Math.round(product.price * 0.9).toLocaleString('en-IN')})`}
                    value={watchTarget}
                    onChange={e => setWatchTarget(e.target.value)}
                    style={{ paddingLeft: 24, height: 38, fontSize: 13 }}
                  />
                </div>
                <button onClick={handleWatch} disabled={watchLoading || !isLoggedIn} className="btn-primary" style={{ padding: '0 16px', height: 38, fontSize: 13, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bell size={14} /> {isLoggedIn ? 'Watch' : 'Sign in to Watch'}
                </button>
              </div>
            )}
            {watchMsg && <p style={{ fontSize: 12, marginTop: 8, color: watchMsg.includes('!') ? '#10b981' : '#f59e0b' }}>{watchMsg}</p>}
          </div>

          {/* Delivery info */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            {[
              { icon: <Truck size={14} />, text: `Delivery: ${product.delivery}` },
              { icon: <RotateCcw size={14} />, text: product.returnPolicy },
              { icon: <Shield size={14} />, text: product.specs?.Warranty || product.specs?.get?.('Warranty') ? `${product.specs.Warranty || product.specs.get('Warranty')} warranty` : 'Warranty included' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                <span style={{ color: '#818cf8' }}>{icon}</span> {text}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: '1px solid var(--color-border)', marginBottom: 20 }}>
            <div style={{ display: 'flex' }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: activeTab === tab.id ? '#818cf8' : 'var(--color-text-muted)', borderBottom: `2px solid ${activeTab === tab.id ? '#6366f1' : 'transparent'}`, marginBottom: '-1px', transition: 'all 0.2s' }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="animate-fade-in" key={activeTab}>
            {activeTab === 'description' && <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: 14 }}>{product.description}</p>}
            {activeTab === 'specs' && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {Object.entries(product.specs instanceof Map ? Object.fromEntries(product.specs) : (product.specs || {})).map(([key, val], i, arr) => (
                  <div key={key} style={{ display: 'flex', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <span style={{ width: '45%', fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>{key}</span>
                    <span style={{ fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'highlights' && (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(product.highlights || []).map(h => (
                  <li key={h} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                    <div style={{ width: 20, height: 20, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={11} color="#10b981" />
                    </div>
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Bottom panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 16 }} className="panels-grid">
        <SmartBundle product={{ ...product, id: product._id || product.id }} />
        <ConfidencePanel product={product} />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-grid { grid-template-columns: 1fr !important; }
          .panels-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
