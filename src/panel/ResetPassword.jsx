import { useState, useEffect } from 'react';

const ResetPassword = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) setToken(t);
    else {
      setStatus('error');
      setMessage('Invalid or missing reset token.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Failed to reset password');
        return;
      }

      setStatus('success');
      setMessage(data.message || 'Password updated successfully');
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return { label: '', color: 'transparent', width: '0%' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { label: 'Weak', color: '#ef4444', width: '20%' };
    if (score <= 2) return { label: 'Fair', color: '#f59e0b', width: '40%' };
    if (score <= 3) return { label: 'Good', color: '#6366f1', width: '60%' };
    if (score <= 4) return { label: 'Strong', color: '#10b981', width: '80%' };
    return { label: 'Very Strong', color: '#10b981', width: '100%' };
  };

  const strength = passwordStrength(password);

  return (
    <div style={styles.overlay}>
      <div style={styles.orbContainer}>
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />
      </div>

      <div style={{ ...styles.card, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)' }}>
        <div style={styles.logoWrap}>
          <div style={styles.logoMark}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>

        <div style={styles.header}>
          <h2 style={styles.title}>Set new password</h2>
          <p style={styles.subtitle}>Choose a strong password to protect your panel</p>
        </div>

        {status === 'success' ? (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={styles.successTitle}>Password updated!</p>
            <p style={styles.successText}>{message}</p>
            <button onClick={() => onNavigate('login')} style={styles.button}>
              Sign In
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
              <label style={styles.label}>New password</label>
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
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              {/* Strength indicator */}
              {password && (
                <div style={{ marginTop: '6px' }}>
                  <div style={styles.strengthBar}>
                    <div style={{ ...styles.strengthFill, width: strength.width, background: strength.color }} />
                  </div>
                  <span style={{ color: strength.color, fontSize: '11px' }}>{strength.label}</span>
                </div>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Confirm password</label>
              <div style={{
                ...styles.inputWrap,
                borderColor: focusedField === 'confirm' ? '#6366f1' : (confirmPassword && confirmPassword !== password ? '#ef4444' : '#2a2d38'),
                boxShadow: focusedField === 'confirm' ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                  style={styles.input}
                  placeholder="Re-enter password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              {confirmPassword && confirmPassword !== password && (
                <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '2px' }}>Passwords don't match</span>
              )}
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: status === 'loading' ? 0.7 : 1,
                cursor: status === 'loading' ? 'wait' : 'pointer',
              }}
              disabled={status === 'loading' || !token}
            >
              {status === 'loading' ? 'Updating...' : 'Update Password'}
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
    position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
  },
  orb: {
    position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.12,
  },
  orb1: {
    width: '350px', height: '350px', background: '#6366f1', top: '-10%', left: '10%',
    animation: 'float1 12s ease-in-out infinite',
  },
  orb2: {
    width: '250px', height: '250px', background: '#8b5cf6', bottom: '5%', right: '-5%',
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
  logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: '24px' },
  logoMark: {
    width: '48px', height: '48px', borderRadius: '14px',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
    border: '1px solid rgba(99,102,241,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc',
  },
  header: { textAlign: 'center', marginBottom: '32px' },
  title: { color: '#f9fafb', fontSize: '22px', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' },
  subtitle: { color: '#6b7280', fontSize: '13px', marginTop: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { color: '#9ca3af', fontSize: '12px', fontWeight: 500 },
  inputWrap: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(26, 28, 36, 0.6)', border: '1px solid #2a2d38',
    borderRadius: '10px', padding: '0 14px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  input: {
    flex: 1, background: 'none', border: 'none', padding: '13px 0',
    color: '#f3f4f6', fontSize: '14px', outline: 'none', fontFamily: 'inherit',
  },
  strengthBar: {
    height: '3px', background: '#1a1c24', borderRadius: '2px', overflow: 'hidden', marginBottom: '4px',
  },
  strengthFill: {
    height: '100%', borderRadius: '2px', transition: 'width 0.3s, background 0.3s',
  },
  button: {
    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
    border: 'none', borderRadius: '10px', padding: '14px', color: '#fff',
    fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '4px',
    fontFamily: 'inherit', width: '100%',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '10px', padding: '11px 14px', color: '#fca5a5', fontSize: '13px',
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  errorIcon: {
    width: '20px', height: '20px', borderRadius: '50%',
    background: 'rgba(239, 68, 68, 0.2)', color: '#f87171',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: 700, flexShrink: 0,
  },
  successBox: {
    textAlign: 'center', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '12px',
  },
  successIcon: {
    width: '56px', height: '56px', borderRadius: '50%',
    background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#34d399', marginBottom: '4px',
  },
  successTitle: { color: '#f9fafb', fontSize: '16px', fontWeight: 600, margin: 0 },
  successText: { color: '#6b7280', fontSize: '13px', margin: 0, lineHeight: 1.5, marginBottom: '8px' },
};

export default ResetPassword;
