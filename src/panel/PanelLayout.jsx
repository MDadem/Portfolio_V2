import { useState } from 'react';
import {
  LayoutDashboard, Users, Zap, Globe2, Settings,
  LogOut, ArrowLeft, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'visitors', label: 'Visitors', Icon: Users },
  { id: 'events', label: 'Events', Icon: Zap },
  { id: 'map', label: 'Map', Icon: Globe2 },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

const PanelLayout = ({ children, activePage, onNavigate, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const sidebarW = collapsed ? 68 : 240;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: sidebarW,
      }}>
        {/* Brand */}
        <div style={styles.brand}>
          <div style={{
            ...styles.brandMark,
            width: collapsed ? 32 : 36,
            height: collapsed ? 32 : 36,
          }}>
            <LayoutDashboard size={collapsed ? 15 : 17} strokeWidth={1.8} />
          </div>
          {!collapsed && (
            <div style={styles.brandText}>
              <span style={styles.brandTitle}>Portfolio</span>
              <span style={styles.brandSub}>Analytics</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={styles.collapseBtn}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed
              ? <PanelLeftOpen size={16} strokeWidth={1.5} />
              : <PanelLeftClose size={16} strokeWidth={1.5} />
            }
          </button>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {!collapsed && <span style={styles.navGroup}>MENU</span>}
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activePage === id;
            const isHovered = hoveredNav === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                onMouseEnter={() => setHoveredNav(id)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navActive : {}),
                  ...(isHovered && !isActive ? styles.navHover : {}),
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '11px 0' : '10px 14px',
                }}
                title={collapsed ? label : undefined}
              >
                <div style={{
                  ...styles.navIconWrap,
                  ...(isActive ? styles.navIconActive : {}),
                }}>
                  <Icon size={17} strokeWidth={isActive ? 2 : 1.5} />
                </div>
                {!collapsed && <span style={styles.navLabel}>{label}</span>}
                {isActive && !collapsed && <div style={styles.activeIndicator} />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={styles.footer}>
          {!collapsed && <div style={styles.footerDivider} />}
          <button
            onClick={onLogout}
            style={styles.footerBtn}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'transparent'; }}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={17} strokeWidth={1.5} />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
            style={styles.footerBtn}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'transparent'; }}
            title={collapsed ? 'Back to Portfolio' : undefined}
          >
            <ArrowLeft size={17} strokeWidth={1.5} />
            {!collapsed && <span>Portfolio</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ ...styles.main, marginLeft: sidebarW }}>
        <div style={styles.mainInner}>{children}</div>
      </main>

      <style>{`
        @keyframes sidebarIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#08090d',
    fontFamily: "'Space Grotesk', -apple-system, sans-serif",
  },
  sidebar: {
    background: 'rgba(14, 16, 22, 0.95)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRight: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.25s cubic-bezier(.4,0,.2,1)',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 100,
  },
  brand: {
    padding: '20px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minHeight: '72px',
  },
  brandMark: {
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
    transition: 'all 0.25s ease',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  brandTitle: {
    color: '#f3f4f6',
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  brandSub: {
    color: '#6366f1',
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  collapseBtn: {
    background: 'none',
    border: 'none',
    color: '#4b5563',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    transition: 'color 0.2s',
  },
  nav: {
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  navGroup: {
    color: '#374151',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    padding: '8px 14px 6px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
    textAlign: 'left',
    width: '100%',
    position: 'relative',
    fontFamily: 'inherit',
  },
  navActive: {
    background: 'rgba(99,102,241,0.08)',
    color: '#e0e7ff',
  },
  navHover: {
    background: 'rgba(255,255,255,0.03)',
    color: '#d1d5db',
  },
  navIconWrap: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },
  navIconActive: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
    color: '#a5b4fc',
  },
  navLabel: {
    fontWeight: 500,
    letterSpacing: '-0.01em',
  },
  activeIndicator: {
    position: 'absolute',
    right: '10px',
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: '#6366f1',
    boxShadow: '0 0 8px rgba(99,102,241,0.6)',
  },
  footer: {
    padding: '10px 10px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  footerDivider: {
    height: '1px',
    background: 'rgba(255,255,255,0.04)',
    margin: '0 4px 6px',
  },
  footerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    padding: '9px 14px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  },
  main: {
    flex: 1,
    padding: '0',
    overflowY: 'auto',
    minHeight: '100vh',
    transition: 'margin-left 0.25s cubic-bezier(.4,0,.2,1)',
  },
  mainInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '32px 36px',
  },
};

export default PanelLayout;
