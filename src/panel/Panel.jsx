import { useState, useEffect } from 'react';
import PanelLogin from './PanelLogin';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import PanelLayout from './PanelLayout';
import OverviewPage from './pages/OverviewPage';
import VisitorsPage from './pages/VisitorsPage';
import EventsPage from './pages/EventsPage';
import MapPage from './pages/MapPage';
import SettingsPage from './pages/SettingsPage';

const Panel = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activePage, setActivePage] = useState('overview');
  const [authView, setAuthView] = useState('login'); // login | forgot-password | reset-password

  useEffect(() => {
    // Detect reset password route
    if (window.location.pathname.includes('/panel/reset-password')) {
      setAuthView('reset-password');
      setChecking(false);
      return;
    }
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/verify', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAuthenticated(data.authenticated);
      }
    } catch {
      setAuthenticated(false);
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    setAuthenticated(false);
    setAuthView('login');
  };

  const handleAuthNavigate = (view) => {
    setAuthView(view);
    if (view === 'login') {
      window.history.replaceState({}, '', '/panel');
    } else if (view === 'forgot-password') {
      window.history.replaceState({}, '', '/panel/forgot-password');
    }
  };

  if (checking) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#07080c',
        color: '#6b7280',
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px', height: '32px', border: '2px solid #1e2028',
            borderTopColor: '#6366f1', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
          }} />
          <span style={{ fontSize: '13px' }}>Verifying session...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!authenticated) {
    if (authView === 'forgot-password') {
      return <ForgotPassword onNavigate={handleAuthNavigate} />;
    }
    if (authView === 'reset-password') {
      return <ResetPassword onNavigate={handleAuthNavigate} />;
    }
    return <PanelLogin onSuccess={() => setAuthenticated(true)} onNavigate={handleAuthNavigate} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'overview': return <OverviewPage />;
      case 'visitors': return <VisitorsPage />;
      case 'events': return <EventsPage />;
      case 'map': return <MapPage />;
      case 'settings': return <SettingsPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <PanelLayout activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout}>
      {renderPage()}
    </PanelLayout>
  );
};

export default Panel;
