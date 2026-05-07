const PortfolioTracker = (() => {
  let config = {
    endpoint: '/api/track',
    visitorId: null,
    sessionId: null,
    sessionStart: null,
    heartbeatInterval: null,
    scrollMilestones: new Set(),
  };

  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getOrCreateVisitorId() {
    let id = localStorage.getItem('portfolio_visitor_id');
    if (!id) {
      id = generateId();
      localStorage.setItem('portfolio_visitor_id', id);
    }
    return id;
  }

  function getReferrer() {
    const ref = document.referrer;
    if (!ref) return 'direct';
    try {
      const url = new URL(ref);
      if (url.hostname.includes('linkedin')) return 'LinkedIn';
      if (url.hostname.includes('github')) return 'GitHub';
      if (url.hostname.includes('twitter') || url.hostname.includes('x.com')) return 'Twitter/X';
      if (url.hostname.includes('google')) return 'Google';
      if (url.hostname.includes('facebook')) return 'Facebook';
      return url.hostname;
    } catch {
      return ref;
    }
  }

  async function send(payload) {
    try {
      await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          visitorId: config.visitorId,
          sessionId: config.sessionId,
        }),
        keepalive: true,
      });
    } catch (err) {
      // Silently fail — don't affect user experience
    }
  }

  function getSessionDuration() {
    if (!config.sessionStart) return 0;
    return Math.round((Date.now() - config.sessionStart) / 1000);
  }

  function setupScrollTracking() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollTop = window.scrollY;
          const percent = Math.round((scrollTop / scrollHeight) * 100);

          [25, 50, 75, 100].forEach((milestone) => {
            if (percent >= milestone && !config.scrollMilestones.has(milestone)) {
              config.scrollMilestones.add(milestone);
              send({
                type: 'event',
                eventName: 'scroll_depth',
                eventLabel: `${milestone}%`,
                metadata: { depth: milestone },
              });
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function setupHeartbeat() {
    config.heartbeatInterval = setInterval(() => {
      send({
        type: 'heartbeat',
        duration: getSessionDuration(),
      });
    }, 30000); // Every 30 seconds
  }

  function setupVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        send({
          type: 'session_end',
          duration: getSessionDuration(),
        });
      }
    });

    window.addEventListener('beforeunload', () => {
      send({
        type: 'session_end',
        duration: getSessionDuration(),
      });
    });
  }

  function setupSectionObserver() {
    const sections = document.querySelectorAll('section[id], [data-section]');
    if (sections.length === 0) return;

    const observed = new Set();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.id || entry.target.dataset.section || 'unknown';
          if (!observed.has(sectionName)) {
            observed.add(sectionName);
            send({
              type: 'event',
              eventName: 'section_viewed',
              eventLabel: sectionName,
              metadata: { section: sectionName },
            });
          }
        }
      });
    }, { threshold: 0.3 });

    sections.forEach((section) => observer.observe(section));
  }

  // Public API
  return {
    init(options = {}) {
      if (options.endpoint) config.endpoint = options.endpoint;

      config.visitorId = getOrCreateVisitorId();
      config.sessionId = generateId();
      config.sessionStart = Date.now();

      // Start session
      send({
        type: 'session_start',
        referrer: getReferrer(),
      });

      // Setup automatic tracking
      setupScrollTracking();
      setupHeartbeat();
      setupVisibilityTracking();

      // Delay section observer to let DOM render
      setTimeout(setupSectionObserver, 1000);
    },

    event(eventName, metadata = {}) {
      send({
        type: 'event',
        eventName,
        eventLabel: metadata.label || '',
        metadata,
      });
    },

    destroy() {
      if (config.heartbeatInterval) {
        clearInterval(config.heartbeatInterval);
      }
    },
  };
})();

export default PortfolioTracker;
