import { useState, useEffect } from 'react';
import {
  Users, UserCheck, CalendarDays, FileDown, Eye, Clock,
  Globe2, Monitor, ExternalLink, TrendingUp, BarChart3,
  Smartphone, Zap,
} from 'lucide-react';

const OverviewPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/panel/analytics', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.loadingSpinner} />
      <span>Loading analytics...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!data) return <div style={styles.loading}>Failed to load data</div>;

  const { overview, charts } = data;

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Overview</h1>
          <p style={styles.pageSubtitle}>Your portfolio performance at a glance</p>
        </div>
        <div style={styles.refreshBadge}>
          <div style={styles.liveDot} />
          <span>Live</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <StatCard icon={Users} label="Total Visitors" value={overview.totalVisitors.toLocaleString()} color="#6366f1" />
        <StatCard icon={UserCheck} label="Unique Visitors" value={overview.uniqueVisitors.toLocaleString()} color="#8b5cf6" />
        <StatCard icon={CalendarDays} label="Today" value={overview.todayVisitors.toLocaleString()} color="#10b981" accent />
        <StatCard icon={FileDown} label="CV Downloads" value={overview.cvDownloads.toLocaleString()} color="#f59e0b" />
        <StatCard icon={Eye} label="CV Previews" value={overview.cvPreviews.toLocaleString()} color="#06b6d4" />
        <StatCard icon={Clock} label="Avg Session" value={formatDuration(overview.avgSessionDuration)} color="#ec4899" />
        <StatCard icon={Globe2} label="Top Country" value={overview.topCountry} color="#14b8a6" />
        <StatCard icon={Monitor} label="Top Browser" value={overview.topBrowser} color="#f97316" />
        <StatCard icon={ExternalLink} label="Top Referrer" value={overview.topReferrer} color="#a78bfa" />
      </div>

      {/* Charts Section */}
      <div style={styles.chartsGrid}>
        {/* Daily Visitors Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Visitors (Last 30 Days)</h3>
          <div style={styles.barChart}>
            {charts.dailyVisitors.map((day, i) => {
              const maxCount = Math.max(...charts.dailyVisitors.map(d => d.count), 1);
              const height = (day.count / maxCount) * 100;
              return (
                <div key={i} style={styles.barCol} title={`${day._id}: ${day.count} visitors`}>
                  <div style={{ ...styles.bar, height: `${height}%` }} />
                  <span style={styles.barLabel}>{day._id.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Countries */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Top Countries</h3>
          <div style={styles.listChart}>
            {charts.topCountries.slice(0, 8).map((item, i) => {
              const maxCount = charts.topCountries[0]?.count || 1;
              const width = (item.count / maxCount) * 100;
              return (
                <div key={i} style={styles.listItem}>
                  <span style={styles.listLabel}>{item._id}</span>
                  <div style={styles.listBarBg}>
                    <div style={{ ...styles.listBar, width: `${width}%` }} />
                  </div>
                  <span style={styles.listValue}>{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browser Distribution */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Browsers</h3>
          <div style={styles.listChart}>
            {charts.topBrowsers.map((item, i) => {
              const total = charts.topBrowsers.reduce((s, b) => s + b.count, 0) || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={i} style={styles.listItem}>
                  <span style={styles.listLabel}>{item._id}</span>
                  <div style={styles.listBarBg}>
                    <div style={{ ...styles.listBar, width: `${pct}%` }} />
                  </div>
                  <span style={styles.listValue}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Types */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Devices</h3>
          <div style={styles.listChart}>
            {charts.deviceTypes.map((item, i) => {
              const total = charts.deviceTypes.reduce((s, d) => s + d.count, 0) || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={i} style={styles.listItem}>
                  <span style={styles.listLabel}>{item._id || 'unknown'}</span>
                  <div style={styles.listBarBg}>
                    <div style={{ ...styles.listBar, width: `${pct}%` }} />
                  </div>
                  <span style={styles.listValue}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Events */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Most Triggered Events</h3>
          <div style={styles.listChart}>
            {charts.eventFrequency.slice(0, 10).map((item, i) => {
              const maxCount = charts.eventFrequency[0]?.count || 1;
              const width = (item.count / maxCount) * 100;
              return (
                <div key={i} style={styles.listItem}>
                  <span style={{ ...styles.listLabel, fontFamily: 'monospace', fontSize: '11px' }}>
                    {item._id}
                  </span>
                  <div style={styles.listBarBg}>
                    <div style={{ ...styles.listBar, width: `${width}%`, background: '#8b5cf6' }} />
                  </div>
                  <span style={styles.listValue}>{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hourly Heatmap */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Peak Hours Heatmap</h3>
          <div style={styles.heatmap}>
            <div style={styles.heatmapRow}>
              <span style={styles.heatmapLabel}></span>
              {Array.from({ length: 24 }, (_, h) => (
                <span key={h} style={styles.heatmapColHeader}>{h}</span>
              ))}
            </div>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIdx) => (
              <div key={dayIdx} style={styles.heatmapRow}>
                <span style={styles.heatmapLabel}>{day}</span>
                {Array.from({ length: 24 }, (_, hour) => {
                  const cell = charts.hourlyHeatmap.find(
                    h => h._id.dayOfWeek === dayIdx + 1 && h._id.hour === hour
                  );
                  const count = cell?.count || 0;
                  const maxHeat = Math.max(...charts.hourlyHeatmap.map(h => h.count), 1);
                  const intensity = count / maxHeat;
                  return (
                    <div
                      key={hour}
                      style={{
                        ...styles.heatmapCell,
                        background: intensity > 0
                          ? `rgba(99, 102, 241, ${0.1 + intensity * 0.9})`
                          : '#1a1c24',
                      }}
                      title={`${day} ${hour}:00 — ${count} visits`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color = '#6366f1', accent }) => (
  <div style={{
    ...styles.statCard,
    ...(accent ? { borderColor: `${color}30`, boxShadow: `0 0 20px ${color}10` } : {}),
  }}>
    <div style={styles.statTop}>
      <div style={{
        ...styles.statIconWrap,
        background: `${color}12`,
        color: color,
      }}>
        <Icon size={16} strokeWidth={1.8} />
      </div>
    </div>
    <span style={styles.statValue}>{value}</span>
    <span style={styles.statLabel}>{label}</span>
  </div>
);

const styles = {
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
  },
  pageTitle: {
    color: '#f9fafb',
    fontSize: '26px',
    fontWeight: 700,
    margin: 0,
    letterSpacing: '-0.03em',
  },
  pageSubtitle: {
    color: '#4b5563',
    fontSize: '13px',
    marginTop: '4px',
  },
  refreshBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(16,185,129,0.08)',
    border: '1px solid rgba(16,185,129,0.15)',
    borderRadius: '20px',
    padding: '6px 14px',
    color: '#34d399',
    fontSize: '12px',
    fontWeight: 500,
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#34d399',
    boxShadow: '0 0 8px rgba(52,211,153,0.6)',
  },
  loading: {
    color: '#6b7280',
    textAlign: 'center',
    padding: '80px 20px',
    fontSize: '13px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  loadingSpinner: {
    width: '28px',
    height: '28px',
    border: '2px solid #1e2028',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '14px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'rgba(18, 20, 26, 0.7)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  statIconWrap: {
    width: '34px',
    height: '34px',
    borderRadius: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: '#f3f4f6',
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '11px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '14px',
  },
  chartCard: {
    background: 'rgba(18, 20, 26, 0.7)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '14px',
    padding: '24px',
  },
  chartTitle: {
    color: '#e5e7eb',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '16px',
    letterSpacing: '-0.01em',
  },
  barChart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '2px',
    height: '120px',
    overflow: 'hidden',
  },
  barCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    background: 'linear-gradient(180deg, #6366f1, #4f46e5)',
    borderRadius: '2px 2px 0 0',
    minHeight: '2px',
    transition: 'height 0.3s',
  },
  barLabel: {
    color: '#6b7280',
    fontSize: '8px',
    marginTop: '4px',
    transform: 'rotate(-45deg)',
    whiteSpace: 'nowrap',
  },
  listChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  listLabel: {
    color: '#d1d5db',
    fontSize: '12px',
    minWidth: '80px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  listBarBg: {
    flex: 1,
    height: '6px',
    background: '#1a1c24',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  listBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
    borderRadius: '3px',
    transition: 'width 0.3s',
  },
  listValue: {
    color: '#9ca3af',
    fontSize: '11px',
    minWidth: '32px',
    textAlign: 'right',
  },
  heatmap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflow: 'auto',
  },
  heatmapRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  heatmapLabel: {
    color: '#6b7280',
    fontSize: '9px',
    width: '28px',
    flexShrink: 0,
  },
  heatmapColHeader: {
    color: '#6b7280',
    fontSize: '8px',
    width: '14px',
    textAlign: 'center',
    flexShrink: 0,
  },
  heatmapCell: {
    width: '14px',
    height: '14px',
    borderRadius: '2px',
    flexShrink: 0,
  },
};

export default OverviewPage;
