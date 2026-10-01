import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="animate-scale-in" style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
            <Zap size={24} color="white" fill="white" />
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Sign in to your SmartCommerce account</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#ef4444', fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input
                  className="input"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  autoFocus
                  style={{ paddingLeft: 36 }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  style={{ paddingLeft: 36, paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', fontSize: 15, padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? (
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(99,102,241,0.06)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.15)' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6, fontWeight: 600 }}>Demo credentials</p>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              <button onClick={() => setForm({ email: 'admin@smartcommerce.com', password: 'admin123' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#818cf8', fontSize: 12, display: 'block', textAlign: 'left', padding: 0 }}>
                Admin: admin@smartcommerce.com / admin123
              </button>
              <button onClick={() => setForm({ email: 'demo@smartcommerce.com', password: 'user123' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#818cf8', fontSize: 12, display: 'block', textAlign: 'left', padding: 0 }}>
                User: demo@smartcommerce.com / user123
              </button>
            </div>
          </div>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
