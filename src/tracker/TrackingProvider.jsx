import { useEffect } from 'react';
import { useTracking, trackEvent } from './useTracking';
import CookieConsent from './CookieConsent';

const TrackingProvider = ({ children }) => {
  useTracking();

  useEffect(() => {
    // Track all external link clicks
    const handleClick = (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href') || '';
      const isExternal = link.target === '_blank' || href.startsWith('http');

      // Social links
      if (href.includes('linkedin.com')) {
        trackEvent('social_link_clicked', { platform: 'LinkedIn', url: href });
      } else if (href.includes('github.com')) {
        trackEvent('social_link_clicked', { platform: 'GitHub', url: href });
      } else if (href.includes('twitter.com') || href.includes('x.com')) {
        trackEvent('social_link_clicked', { platform: 'Twitter/X', url: href });
      }

      // Email links
      if (href.startsWith('mailto:')) {
        trackEvent('email_clicked', { email: href.replace('mailto:', '') });
      }

      // Phone links
      if (href.startsWith('tel:')) {
        trackEvent('phone_clicked', { phone: href.replace('tel:', '') });
      }

      // Generic external links
      if (isExternal && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        trackEvent('external_link_clicked', { url: href });
      }
    };

    // Track CV-related events via data attributes
    const handleCVClick = (e) => {
      const btn = e.target.closest('[data-track]');
      if (!btn) return;

      const trackAction = btn.dataset.track;
      const trackMeta = btn.dataset.trackMeta ? JSON.parse(btn.dataset.trackMeta) : {};

      trackEvent(trackAction, trackMeta);
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('click', handleCVClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('click', handleCVClick, true);
    };
  }, []);

  return (
    <>
      {children}
      <CookieConsent />
    </>
  );
};

export default TrackingProvider;
export { trackEvent };
