import { useState, useEffect } from 'react';

const ForgotPassword = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Failed to send reset email');
        return;
      }

      setStatus('success');
      setMessage(data.message || 'Reset link sent to your email');
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.orbContainer}>
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />
      </div>

      <div style={{ ...styles.card, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)' }}>
        <button onClick={() => onNavigate('login')} style={styles.backLink}>
          ← Back to Sign In
        </button>

        <div style={styles.logoWrap}>
          <div style={styles.logoMark}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </div>
        </div>

        <div style={styles.header}>
          <h2 style={styles.title}>Reset your password</h2>
          <p style={styles.subtitle}>
            Enter the email associated with your admin account and we'll send you a reset link.
          </p>
        </div>

        {status === 'success' ? (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={styles.successTitle}>Check your email</p>
            <p style={styles.successText}>{message}</p>
            <button onClick={() => onNavigate('login')} style={styles.button}>
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            {status === 'error' && (
              <div style={styles.error}>
                <span style={styles.errorIcon}>!</span>
                {message}
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

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: status === 'loading' ? 0.7 : 1,
                cursor: status === 'loading' ? 'wait' : 'pointer',
              }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes float1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, -40px) scale(1.1); } }
        @keyframes float2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-40px, 30px) scale(0.9); } }
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
    opacity: 0.12,
  },
  orb1: {
    width: '350px', height: '350px',
    background: '#6366f1',
    top: '-10%', right: '-5%',
    animation: 'float1 12s ease-in-out infinite',
  },
  orb2: {
    width: '250px', height: '250px',
    background: '#a78bfa',
    bottom: '-5%', left: '10%',
    animation: 'float2 15s ease-in-out infinite',
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
    marginTop: '10px',
    lineHeight: 1.5,
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
    fontFamily: 'inherit',
    width: '100%',
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
  successBox: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  successIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#34d399',
    marginBottom: '4px',
  },
  successTitle: {
    color: '#f9fafb',
    fontSize: '16px',
    fontWeight: 600,
    margin: 0,
  },
  successText: {
    color: '#6b7280',
    fontSize: '13px',
    margin: 0,
    lineHeight: 1.5,
    marginBottom: '8px',
  },
};

export default ForgotPassword;
