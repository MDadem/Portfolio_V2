import { useState, useEffect } from 'react';
import {
  Activity, Trash2, Download, Lock, Info, Eye, EyeOff, CheckCircle2, XCircle,
} from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [clearDays, setClearDays] = useState(30);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordHash, setPasswordHash] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/panel/settings', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleClearData = async () => {
    if (!confirm(`Delete all data older than ${clearDays} days? This cannot be undone.`)) return;

    try {
      const res = await fetch('/api/panel/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'clear_old_data', payload: { days: clearDays } }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(`Deleted ${data.deletedVisitors} visitors and ${data.deletedEvents} events.`);
        fetchSettings();
      } else {
        showMessage(data.error || 'Failed to clear data');
      }
    } catch (err) {
      showMessage('Network error');
    }
  };

  const handleExport = async (format) => {
    try {
      const res = await fetch('/api/panel/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'export_data', payload: { format } }),
      });

      if (format === 'csv') {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio_export.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio_export.json';
        a.click();
        URL.revokeObjectURL(url);
      }
      showMessage('Export downloaded');
    } catch (err) {
      showMessage('Export failed');
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      showMessage('Both current and new password are required');
      return;
    }
    if (newPassword.length < 8) {
      showMessage('New password must be at least 8 characters');
      return;
    }

    try {
      const res = await fetch('/api/panel/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'change_password', payload: { currentPassword, newPassword } }),
      });
      const data = await res.json();

      if (res.ok) {
        showMessage('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setPasswordHash('');
      } else {
        showMessage(data.error || 'Password change failed');
      }
    } catch (err) {
      showMessage('Password change failed');
    }
  };

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.loadingSpinner} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const isGoodPassword = newPassword.length >= 8;

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Settings</h1>
      </div>

      {message && (
        <div style={{
          ...styles.message,
          borderColor: message.includes('success') || message.includes('updated') || message.includes('Deleted') || message.includes('downloaded')
            ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
          color: message.includes('success') || message.includes('updated') || message.includes('Deleted') || message.includes('downloaded')
            ? '#34d399' : '#f87171',
          background: message.includes('success') || message.includes('updated') || message.includes('Deleted') || message.includes('downloaded')
            ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
        }}>
          {message.includes('success') || message.includes('updated') || message.includes('Deleted') || message.includes('downloaded')
            ? <CheckCircle2 size={14} strokeWidth={2} />
            : <XCircle size={14} strokeWidth={2} />
          }
          {message}
        </div>
      )}

      {/* Status */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Activity size={15} strokeWidth={2} style={{ color: '#6366f1' }} />
          <h3 style={styles.sectionTitle}>Status</h3>
          <span style={{
            ...styles.trackingBadge,
            background: settings?.trackingEnabled ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
            color: settings?.trackingEnabled ? '#34d399' : '#f87171',
            borderColor: settings?.trackingEnabled ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
          }}>
            {settings?.trackingEnabled ? 'Tracking On' : 'Tracking Off'}
          </span>
        </div>
        <div style={styles.statusGrid}>
          {[
            { label: 'Total Visitors', value: settings?.totalVisitors?.toLocaleString() },
            { label: 'Total Events', value: settings?.totalEvents?.toLocaleString() },
            { label: 'Whitelisted IPs', value: settings?.whitelistIps?.join(', ') || 'None' },
            settings?.oldestRecord && { label: 'Oldest Record', value: new Date(settings.oldestRecord).toLocaleDateString() },
          ].filter(Boolean).map(({ label, value }) => (
            <div key={label} style={styles.statusItem}>
              <span style={styles.statusLabel}>{label}</span>
              <span style={styles.statusValue}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Data */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Trash2 size={15} strokeWidth={2} style={{ color: '#ef4444' }} />
          <h3 style={styles.sectionTitle}>Clear Old Data</h3>
        </div>
        <p style={styles.sectionDesc}>Delete visitor and event records older than a specified number of days.</p>
        <div style={styles.row}>
          <div style={styles.numberWrap}>
            <input
              type="number"
              value={clearDays}
              onChange={(e) => setClearDays(parseInt(e.target.value) || 0)}
              min={1}
              style={styles.numberInput}
            />
            <span style={styles.inputSuffix}>days</span>
          </div>
          <button onClick={handleClearData} style={styles.dangerBtn}>
            <Trash2 size={13} strokeWidth={2} />
            Clear Data
          </button>
        </div>
      </div>

      {/* Export */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Download size={15} strokeWidth={2} style={{ color: '#10b981' }} />
          <h3 style={styles.sectionTitle}>Export Data</h3>
        </div>
        <p style={styles.sectionDesc}>Download all visitor and event data as JSON or CSV.</p>
        <div style={styles.row}>
          <button onClick={() => handleExport('json')} style={styles.btn}>
            <Download size={13} strokeWidth={2} />
            Export JSON
          </button>
          <button onClick={() => handleExport('csv')} style={styles.btn}>
            <Download size={13} strokeWidth={2} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Password Change */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Lock size={15} strokeWidth={2} style={{ color: '#f59e0b' }} />
          <h3 style={styles.sectionTitle}>Change Password</h3>
        </div>
        <p style={styles.sectionDesc}>Update your admin password. Stored securely with bcrypt.</p>
        <div style={styles.fieldGroup}>
          <div style={styles.passwordWrap}>
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              style={styles.passwordInput}
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
              {showCurrent ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
            </button>
          </div>
          <div style={styles.passwordWrap}>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 chars)"
              style={{
                ...styles.passwordInput,
                borderColor: newPassword ? (isGoodPassword ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)') : 'rgba(255,255,255,0.05)',
              }}
            />
            <button type="button" onClick={() => setShowNew(!showNew)} style={styles.eyeBtn}>
              {showNew ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
            </button>
          </div>
          <button onClick={handlePasswordChange} style={styles.btn}>
            <Lock size={13} strokeWidth={2} />
            Update Password
          </button>
        </div>
      </div>

      {/* Notes */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Info size={15} strokeWidth={2} style={{ color: '#6b7280' }} />
          <h3 style={styles.sectionTitle}>Configuration Notes</h3>
        </div>
        <div style={styles.notesList}>
          {[
            ['TRACKING_ENABLED=false', 'to disable analytics tracking'],
            ['WHITELIST_IPS=ip1,ip2', 'to exclude your own IPs from tracking'],
            ['Passwords', 'are stored securely in MongoDB with bcrypt'],
            ['Vercel env changes', 'require a redeployment to take effect'],
          ].map(([key, desc]) => (
            <div key={key} style={styles.noteItem}>
              <code style={styles.noteCode}>{key}</code>
              <span style={styles.noteDesc}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageHeader: {
    marginBottom: '28px',
  },
  pageTitle: {
    color: '#f9fafb',
    fontSize: '26px',
    fontWeight: 700,
    margin: 0,
    letterSpacing: '-0.03em',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '80px',
  },
  loadingSpinner: {
    width: '28px',
    height: '28px',
    border: '2px solid #1e2028',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '13px',
    marginBottom: '20px',
  },
  section: {
    background: 'rgba(14,16,22,0.6)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '14px',
    padding: '24px',
    marginBottom: '14px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  sectionTitle: {
    color: '#e5e7eb',
    fontSize: '13px',
    fontWeight: 600,
    margin: 0,
    letterSpacing: '-0.01em',
    flex: 1,
  },
  trackingBadge: {
    fontSize: '11px',
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: '20px',
    border: '1px solid',
  },
  sectionDesc: {
    color: '#4b5563',
    fontSize: '12px',
    marginBottom: '16px',
  },
  statusGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statusLabel: {
    color: '#374151',
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 600,
  },
  statusValue: {
    color: '#d1d5db',
    fontSize: '14px',
    fontWeight: 600,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  numberWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(26,28,36,0.6)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '0 14px',
  },
  numberInput: {
    background: 'none',
    border: 'none',
    padding: '10px 0',
    color: '#f3f4f6',
    fontSize: '13px',
    outline: 'none',
    width: '60px',
    fontFamily: 'inherit',
  },
  inputSuffix: {
    color: '#4b5563',
    fontSize: '12px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
  },
  passwordWrap: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(26,28,36,0.6)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  passwordInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    padding: '11px 14px',
    color: '#f3f4f6',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    padding: '0 12px',
    color: '#4b5563',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 18px',
    color: '#fff',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 500,
    fontFamily: 'inherit',
  },
  dangerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: 'rgba(220,38,38,0.12)',
    border: '1px solid rgba(220,38,38,0.25)',
    borderRadius: '10px',
    padding: '10px 18px',
    color: '#f87171',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 500,
    fontFamily: 'inherit',
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  noteItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    background: 'rgba(8,9,13,0.4)',
    borderRadius: '8px',
  },
  noteCode: {
    color: '#818cf8',
    fontSize: '11px',
    fontFamily: 'monospace',
    background: 'rgba(99,102,241,0.1)',
    padding: '2px 8px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
  },
  noteDesc: {
    color: '#6b7280',
    fontSize: '12px',
  },
};

export default SettingsPage;
