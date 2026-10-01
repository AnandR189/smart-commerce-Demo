import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Zap, Menu, X, User, LogOut, LayoutDashboard, Users, Shield } from 'lucide-react';
import { useShop } from '../App';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount, wishlistCount, openCart } = useShop();
  const { user, logout, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/products?category=audio', label: 'Audio' },
    { to: '/group-cart', label: 'Shop Together', icon: <Users size={13} /> },
  ];

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          transition: 'all 0.3s ease',
          background: scrolled ? 'rgba(10, 10, 15, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: 32 }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={16} color="white" fill="white" />
              </div>
              <span className="tag" style={{ fontSize: 18, color: 'var(--color-text-primary)' }}>
                Smart<span style={{ color: '#818cf8' }}>Commerce</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav style={{ display: 'flex', gap: 4, flex: 1 }} className="hidden md:flex">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} style={{
                  color: location.pathname === link.to.split('?')[0] ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  textDecoration: 'none', fontSize: 14, fontWeight: 500,
                  padding: '6px 12px', borderRadius: 8, transition: 'all 0.2s',
                  background: location.pathname === link.to.split('?')[0] ? 'rgba(99,102,241,0.08)' : 'transparent',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  {link.icon}{link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin/products" style={{ color: '#f59e0b', textDecoration: 'none', fontSize: 14, fontWeight: 600, padding: '6px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.08)' }}>
                  <Shield size={13} /> Admin
                </Link>
              )}
            </nav>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex" style={{ position: 'relative', width: 220 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
              <input className="input" type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 36, height: 38, fontSize: 13 }} />
            </form>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {/* Wishlist */}
              <Link to="/products?wishlist=true" style={{ position: 'relative', display: 'flex', padding: 8, borderRadius: 10, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'all 0.2s' }}>
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span style={{ position: 'absolute', top: 2, right: 2, background: '#ef4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button onClick={openCart} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', cursor: 'pointer', transition: 'all 0.2s', fontSize: 13, fontWeight: 600 }}>
                <ShoppingCart size={18} />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span style={{ background: '#6366f1', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User menu */}
              {user ? (
                <div ref={userMenuRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', cursor: 'pointer', color: 'var(--color-text-primary)', transition: 'all 0.2s' }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline" style={{ fontSize: 13, fontWeight: 600 }}>{user.name ? user.name.split(' ')[0] : 'Account'}</span>
                  </button>

                  {userMenuOpen && (
                    <div className="animate-scale-in" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 190, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '8px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 300 }}>
                      <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: 4 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{user.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                      </div>
                      {[
                        { to: '/dashboard', icon: <LayoutDashboard size={14} />, label: 'Dashboard' },
                        ...(isAdmin ? [{ to: '/admin/products', icon: <Shield size={14} />, label: 'Admin Panel' }] : []),
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setUserMenuOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 13, transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-2)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                        >
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 4, paddingTop: 4 }}>
                        <button
                          type="button"
                          onClick={handleLogout}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, width: '100%', transition: 'background 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 13 }}>
                    <User size={15} /> Sign In
                  </button>
                </Link>
              )}

              {/* Mobile toggle */}
              <button className="md:hidden" onClick={() => setMobileOpen(v => !v)} style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="animate-slide-up md:hidden" style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99, background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 20 }}>
          <form onSubmit={handleSearch} style={{ marginBottom: 16, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input className="input" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 36 }} />
          </form>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 8px', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 15, borderBottom: '1px solid var(--color-border)' }}>
              {link.icon}{link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '12px 8px', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 15, borderBottom: '1px solid var(--color-border)' }}>Dashboard</Link>
              {isAdmin && (
                <Link to="/admin/products" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '12px 8px', color: '#f59e0b', textDecoration: 'none', fontSize: 15, borderBottom: '1px solid var(--color-border)' }}>Admin Panel</Link>
              )}
              <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 8px', color: '#ef4444', background: 'none', border: 'none', fontSize: 15, cursor: 'pointer' }}>Sign Out</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '12px 8px', color: '#818cf8', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>Sign In / Register</Link>
          )}
        </div>
      )}

      <div style={{ height: 64 }} />
    </>
  );
}
