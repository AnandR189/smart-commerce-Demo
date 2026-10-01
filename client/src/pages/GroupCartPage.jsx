import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, Plus, ThumbsUp, ThumbsDown, Copy, Check, ShoppingCart, Lock, Trash2, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../App';
import { products as localProducts } from '../data/products';
import api from '../utils/api';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function GroupCartPage() {
  const { code } = useParams();
  const { user, isLoggedIn } = useAuth();
  const { addToCart, openCart, cartItems } = useShop();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [cartName, setCartName] = useState('');
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [addingProduct, setAddingProduct] = useState(null);
  const [locking, setLocking] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const pollRef = useRef(null);

  // Load cart if code in URL
  useEffect(() => {
    if (code) fetchCart();
    else setLoading(false);
    return () => clearInterval(pollRef.current);
  }, [code]);

  // Poll every 5 seconds
  useEffect(() => {
    if (cart && cart.status === 'open') {
      pollRef.current = setInterval(fetchCart, 5000);
    }
    return () => clearInterval(pollRef.current);
  }, [cart?.inviteCode, cart?.status]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get(`/group-carts/${code || cart?.inviteCode}`);
      setCart(data.data);
    } catch (e) {
      if (e.response?.status === 404) setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const createCart = async () => {
    if (!isLoggedIn) { navigate('/login', { state: { from: '/group-cart' } }); return; }
    setCreating(true);
    try {
      const { data } = await api.post('/group-carts', { name: cartName || undefined });
      navigate(`/group-cart/${data.data.inviteCode}`, { replace: true });
      setCart(data.data);
    } catch { } finally { setCreating(false); }
  };

  const joinCart = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (!joinCode.trim()) return;
    try {
      await api.post(`/group-carts/${joinCode.trim().toUpperCase()}/join`);
      navigate(`/group-cart/${joinCode.trim().toUpperCase()}`);
    } catch (e) { alert(e.response?.data?.error || 'Invalid code'); }
  };

  const addItem = async (product) => {
    if (!cart || !isLoggedIn) return;
    setAddingProduct(product.id || product._id);
    try {
      const { data } = await api.post(`/group-carts/${cart.inviteCode}/items`, {
        productId: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
      setCart(data.data);
    } catch { } finally { setAddingProduct(null); }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await api.delete(`/group-carts/${cart.inviteCode}/items/${itemId}`);
      setCart(data.data);
    } catch { }
  };

  const vote = async (itemId, voteType) => {
    if (!isLoggedIn) return;
    try {
      const { data } = await api.post(`/group-carts/${cart.inviteCode}/items/${itemId}/vote`, { vote: voteType });
      setCart(data.data);
    } catch { }
  };

  const lockCart = async () => {
    setLocking(true);
    try {
      const { data } = await api.post(`/group-carts/${cart.inviteCode}/lock`);
      setCart(data.data);
    } catch { } finally { setLocking(false); }
  };

  const checkoutAll = () => {
    if (!cart?.items?.length) return;
    cart.items.forEach(item => {
      addToCart({ id: item.productId, _id: item.productId, name: item.name, price: item.price, image: item.image }, item.quantity);
    });
    setCheckingOut(true);
    setTimeout(() => { navigate('/checkout'); openCart(); }, 500);
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/group-cart/${cart.inviteCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredProducts = localProducts.filter(p =>
    !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.category.includes(searchQ.toLowerCase())
  ).slice(0, 6);

  const isOwner = cart && user && cart.owner === (user.id || user._id);

  const totalPrice = (cart?.items || []).reduce((sum, i) => sum + i.price * i.quantity, 0);

  // No code: show create/join UI
  if (!code && !cart) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
            <Users size={28} color="white" />
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 900, letterSpacing: '-1px', marginBottom: 10 }}>Shop Together</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            Create a shared cart, invite friends to add items and vote — then the owner checks out together. Perfect for gifts, trips, and roommates.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="gc-grid">
          {/* Create */}
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Create a Cart</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 20 }}>Start a group cart and invite others</p>
            <input className="input" placeholder="Cart name (optional)" value={cartName} onChange={e => setCartName(e.target.value)} style={{ marginBottom: 12 }} />
            <button onClick={createCart} disabled={creating} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {creating ? 'Creating…' : <><Plus size={15} /> Create Group Cart</>}
            </button>
          </div>

          {/* Join */}
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Join a Cart</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 20 }}>Enter an invite code from a friend</p>
            <input className="input" placeholder="Enter invite code (e.g. A1B2C3D4)" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} maxLength={8} style={{ marginBottom: 12, fontFamily: 'monospace', letterSpacing: 2 }} />
            <button onClick={joinCart} className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <UserPlus size={15} /> Join Cart
            </button>
          </div>
        </div>

        <style>{`.gc-grid { @media (max-width: 600px) { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    );
  }

  if (loading) return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      {[1,2,3].map(i => <div key={i} className="shimmer" style={{ height: 80, borderRadius: 14, marginBottom: 12 }} />)}
    </div>
  );

  if (!cart) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h2 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Cart not found</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>This invite link may be invalid or expired</p>
      <Link to="/group-cart"><button className="btn-primary">Create New Cart</button></Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Users size={22} color="#818cf8" />
            <h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800 }}>{cart.name}</h1>
            <span className={`badge ${cart.status === 'open' ? 'badge-success' : 'badge-accent'}`}>{cart.status}</span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
            {cart.members?.length || 1} member(s) · {cart.items?.length || 0} item(s) · Created by {cart.ownerName}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Polling every 5s</span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: cart.status === 'open' ? '#10b981' : '#f59e0b', animation: cart.status === 'open' ? 'pulse 2s infinite' : 'none' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={copyInvite} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Invite</>}
          </button>
          {isOwner && cart.status === 'open' && (
            <button onClick={lockCart} disabled={locking} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' }}>
              <Lock size={14} /> {locking ? 'Locking…' : 'Lock Cart'}
            </button>
          )}
          {isOwner && (
            <button onClick={checkoutAll} disabled={!cart.items?.length || checkingOut} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <ShoppingCart size={14} /> Checkout All ({formatPrice(totalPrice)})
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }} className="gc-main">
        {/* Items */}
        <div>
          {/* Members */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {cart.members?.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 100 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>
                  {m.name[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 600 }}>{m.name}</span>
              </div>
            ))}
          </div>

          {/* Cart items */}
          {cart.items?.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
              <ShoppingCart size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: 4 }}>No items yet</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Add products from the list on the right</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cart.items.map(item => {
                const upVotes = item.votes?.filter(v => v.vote === 'up').length || 0;
                const downVotes = item.votes?.filter(v => v.vote === 'down').length || 0;
                const myVote = item.votes?.find(v => v.userId === (user?.id || user?._id))?.vote;
                const canRemove = isOwner || item.addedBy === (user?.id || user?._id);
                return (
                  <div key={item._id} className="card animate-fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>{item.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Added by {item.addedByName} · {formatPrice(item.price)}</p>
                    </div>
                    {/* Voting */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => vote(item._id, 'up')}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, background: myVote === 'up' ? 'rgba(16,185,129,0.15)' : 'var(--color-surface-2)', border: `1px solid ${myVote === 'up' ? 'rgba(16,185,129,0.3)' : 'var(--color-border)'}`, cursor: 'pointer', color: myVote === 'up' ? '#10b981' : 'var(--color-text-muted)', fontSize: 13, fontWeight: 700, transition: 'all 0.2s' }}
                      >
                        <ThumbsUp size={14} /> {upVotes}
                      </button>
                      <button
                        onClick={() => vote(item._id, 'down')}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, background: myVote === 'down' ? 'rgba(239,68,68,0.15)' : 'var(--color-surface-2)', border: `1px solid ${myVote === 'down' ? 'rgba(239,68,68,0.3)' : 'var(--color-border)'}`, cursor: 'pointer', color: myVote === 'down' ? '#ef4444' : 'var(--color-text-muted)', fontSize: 13, fontWeight: 700, transition: 'all 0.2s' }}
                      >
                        <ThumbsDown size={14} /> {downVotes}
                      </button>
                      {canRemove && (
                        <button onClick={() => removeItem(item._id)} style={{ padding: '6px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Products sidebar */}
        <div>
          {cart.status === 'open' && isLoggedIn && (
            <div className="card" style={{ padding: 20, position: 'sticky', top: 80 }}>
              <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Add Products</h3>
              <input className="input" placeholder="Search products…" value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ marginBottom: 12, fontSize: 13 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredProducts.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 10 }}>
                    <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: '#818cf8', fontWeight: 700 }}>{formatPrice(p.price)}</p>
                    </div>
                    <button
                      onClick={() => addItem(p)}
                      disabled={addingProduct === (p.id || p._id)}
                      style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!isLoggedIn && (
            <div className="card" style={{ padding: 24, textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 12 }}>Sign in to add items and vote</p>
              <Link to="/login"><button className="btn-primary" style={{ fontSize: 13 }}>Sign In</button></Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity: 0.4; } }
        @media (max-width: 768px) { .gc-main { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
