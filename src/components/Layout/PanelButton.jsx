import { trackEvent } from '../../tracker/TrackingProvider';

const PanelButton = () => {
  const handleClick = () => {
    trackEvent('panel_login_attempt', { action: 'button_clicked' });
    window.history.pushState({}, '', '/panel');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: '12px',
        left: '12px',
        zIndex: 9999,
        background: 'none',
        border: 'none',
        color: '#ffffff',
        fontSize: '11px',
        fontFamily: "'Space Grotesk', sans-serif",
        opacity: 0.3,
        cursor: 'pointer',
        padding: '4px 8px',
        letterSpacing: '0.02em',
        transition: 'opacity 0.3s ease',
      }}
      onMouseEnter={(e) => { e.target.style.opacity = '0.9'; }}
      onMouseLeave={(e) => { e.target.style.opacity = '0.3'; }}
      title="Portfolio Panel"
    >
      Portfolio Panel
    </button>
  );
};

export default PanelButton;
