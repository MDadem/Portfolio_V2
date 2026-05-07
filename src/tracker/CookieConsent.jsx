import { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('portfolio_consent');
    if (!consent) {
      setTimeout(() => setVisible(true), 2000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('portfolio_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('portfolio_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={styles.banner}>
      <p style={styles.text}>
        This site uses anonymous analytics to improve the experience. No personal data is collected.
      </p>
      <div style={styles.buttons}>
        <button onClick={accept} style={styles.acceptBtn}>Accept</button>
        <button onClick={decline} style={styles.declineBtn}>Decline</button>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1a1c24',
    border: '1px solid #2a2d38',
    borderRadius: '12px',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    zIndex: 99998,
    maxWidth: '560px',
    width: 'calc(100% - 40px)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  text: {
    color: '#9ca3af',
    fontSize: '12px',
    margin: 0,
    lineHeight: 1.5,
    flex: 1,
  },
  buttons: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  acceptBtn: {
    background: '#6366f1',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 14px',
    color: '#fff',
    fontSize: '11px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  declineBtn: {
    background: 'transparent',
    border: '1px solid #2a2d38',
    borderRadius: '6px',
    padding: '8px 14px',
    color: '#6b7280',
    fontSize: '11px',
    cursor: 'pointer',
  },
};

export default CookieConsent;
