import { useState, useEffect } from 'react';

const PanelLogin = ({ onSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Network error. Try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      {/* Animated background orbs */}
      <div style={styles.orbContainer}>
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />
        <div style={{ ...styles.orb, ...styles.orb3 }} />
      </div>

      <div style={{ ...styles.card, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)' }}>
        {/* Back to portfolio */}
        <button
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          style={styles.backLink}
        >
          ← Back to Portfolio
        </button>

        {/* Logo mark */}
        <div style={styles.logoWrap}>
          <div style={styles.logoMark}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        <div style={styles.header}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your analytics dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              <span style={styles.errorIcon}>!</span>
              {error}
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <div style={{
              ...styles.inputWrap,
              borderColor: focusedField === 'email' ? '#6366f1' : '#2a2d38',
              boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                style={styles.input}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div style={styles.field}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={styles.label}>Password</label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                style={styles.forgotLink}
              >
                Forgot password?
              </button>
            </div>
            <div style={{
              ...styles.inputWrap,
              borderColor: focusedField === 'password' ? '#6366f1' : '#2a2d38',
              boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={styles.input}
                placeholder="••••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'wait' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.loadingDots}>
                <span style={styles.dot} /><span style={styles.dot} /><span style={styles.dot} />
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>Secured with JWT + bcrypt encryption</span>
        </div>
      </div>

      <style>{`
        @keyframes float1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, -40px) scale(1.1); } }
        @keyframes float2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-40px, 30px) scale(0.9); } }
        @keyframes float3 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, 20px) scale(1.05); } }
        @keyframes dotPulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: '#07080c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    fontFamily: "'Space Grotesk', -apple-system, sans-serif",
    overflow: 'hidden',
  },
  orbContainer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.15,
  },
  orb1: {
    width: '400px', height: '400px',
    background: '#6366f1',
    top: '-10%', left: '-5%',
    animation: 'float1 12s ease-in-out infinite',
  },
  orb2: {
    width: '300px', height: '300px',
    background: '#8b5cf6',
    bottom: '-5%', right: '-5%',
    animation: 'float2 15s ease-in-out infinite',
  },
  orb3: {
    width: '200px', height: '200px',
    background: '#a78bfa',
    top: '40%', right: '20%',
    animation: 'float3 10s ease-in-out infinite',
  },
  card: {
    background: 'rgba(18, 20, 26, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    zIndex: 1,
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  },
  backLink: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    fontSize: '12px',
    cursor: 'pointer',
    padding: 0,
    marginBottom: '28px',
    display: 'block',
    transition: 'color 0.2s',
    fontFamily: 'inherit',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  logoMark: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
    border: '1px solid rgba(99,102,241,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a5b4fc',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    color: '#f9fafb',
    fontSize: '22px',
    fontWeight: 600,
    margin: 0,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '13px',
    marginTop: '8px',
    fontWeight: 400,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },
  label: {
    color: '#9ca3af',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.01em',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(26, 28, 36, 0.6)',
    border: '1px solid #2a2d38',
    borderRadius: '10px',
    padding: '0 14px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  input: {
    flex: 1,
    background: 'none',
    border: 'none',
    padding: '13px 0',
    color: '#f3f4f6',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  forgotLink: {
    background: 'none',
    border: 'none',
    color: '#818cf8',
    fontSize: '12px',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  button: {
    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '4px',
    transition: 'opacity 0.2s, transform 0.1s',
    fontFamily: 'inherit',
    letterSpacing: '0.01em',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '10px',
    padding: '11px 14px',
    color: '#fca5a5',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  errorIcon: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
    flexShrink: 0,
  },
  footer: {
    textAlign: 'center',
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
  },
  footerText: {
    color: '#374151',
    fontSize: '11px',
    letterSpacing: '0.03em',
  },
  loadingDots: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#fff',
    animation: 'dotPulse 1.2s infinite ease-in-out',
  },
};

export default PanelLogin;
