import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      navigate('/');
    } else {
      setServerError(result.error);
    }
  };

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(ev => ({ ...ev, [field]: '' }));
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="animate-scale-in" style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
            <Zap size={24} color="white" fill="white" />
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>Create account</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Join SmartCommerce today</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {serverError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#ef4444', fontSize: 14 }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FieldGroup label="Full Name" error={errors.name}>
              <User size={15} />
              <input className="input" type="text" placeholder="Arjun Sharma" value={form.name} onChange={set('name')} style={{ paddingLeft: 36, borderColor: errors.name ? '#ef4444' : undefined }} />
            </FieldGroup>

            <FieldGroup label="Email" error={errors.email}>
              <Mail size={15} />
              <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} style={{ paddingLeft: 36, borderColor: errors.email ? '#ef4444' : undefined }} />
            </FieldGroup>

            <FieldGroup label="Password" error={errors.password}>
              <Lock size={15} />
              <input className="input" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={set('password')} style={{ paddingLeft: 36, paddingRight: 40, borderColor: errors.password ? '#ef4444' : undefined }} />
              <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </FieldGroup>

            <FieldGroup label="Confirm Password" error={errors.confirm} last>
              <Lock size={15} />
              <input className="input" type={showPass ? 'text' : 'password'} placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} style={{ paddingLeft: 36, borderColor: errors.confirm ? '#ef4444' : undefined }} />
            </FieldGroup>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', fontSize: 15, padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? (
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
              ) : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function FieldGroup({ label, error, children, last }) {
  return (
    <div style={{ marginBottom: last ? 24 : 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none', display: 'flex' }}>
          {children[0]}
        </span>
        {children[1]}
        {children[2]}
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}
