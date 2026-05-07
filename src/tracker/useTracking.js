import { useEffect, useRef } from 'react';
import PortfolioTracker from './PortfolioTracker';

function hasConsent() {
  const consent = localStorage.getItem('portfolio_consent');
  // Track unless explicitly declined
  return consent !== 'declined';
}

export function useTracking() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Don't track if on the panel page
    if (window.location.pathname.startsWith('/panel')) return;

    // Respect user consent
    if (!hasConsent()) return;

    PortfolioTracker.init({ endpoint: '/api/track' });

    return () => {
      PortfolioTracker.destroy();
    };
  }, []);

  return PortfolioTracker;
}

export function trackEvent(eventName, metadata = {}) {
  if (!hasConsent()) return;
  PortfolioTracker.event(eventName, metadata);
}
