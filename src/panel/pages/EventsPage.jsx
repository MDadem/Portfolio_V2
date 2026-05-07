import { useState, useEffect, useCallback } from 'react';
import { Download, BarChart2, Clock, TrendingDown, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [frequency, setFrequency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ eventName: '', startDate: '', endDate: '' });
  const [view, setView] = useState('timeline'); // timeline | frequency | funnel

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 50 });
      if (filters.eventName) params.set('eventName', filters.eventName);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);

      const res = await fetch(`/api/panel/events?${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
        setTotalPages(data.totalPages);
        setTotal(data.total);
        setFrequency(data.frequency || []);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const exportCSV = async () => {
    const params = new URLSearchParams({ format: 'csv' });
    if (filters.eventName) params.set('eventName', filters.eventName);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);

    const res = await fetch(`/api/panel/events?${params}`, { credentials: 'include' });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'events_export.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };

  const eventColors = {
    page_view: '#6366f1',
    cv_downloaded: '#10b981',
    cv_previewed: '#06b6d4',
    project_clicked: '#f59e0b',
    contact_form_submitted: '#ec4899',
    social_link_clicked: '#8b5cf6',
    section_viewed: '#64748b',
  };

  const getEventColor = (name) => eventColors[name] || '#6b7280';

  // Funnel data
  const funnelSteps = ['page_view', 'cv_previewed', 'cv_downloaded'];
  const funnelData = funnelSteps.map(step => {
    const item = frequency.find(f => f._id === step);
    return { name: step, count: item?.count || 0 };
  });

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Events</h1>
          <p style={styles.subtitle}>{total.toLocaleString()} total events tracked</p>
        </div>
        <button onClick={exportCSV} style={styles.exportBtn}>
          <Download size={14} strokeWidth={2} />
          Export CSV
        </button>
      </div>

      {/* View Tabs */}
      <div style={styles.tabs}>
        {[
          { id: 'timeline', label: 'Timeline', Icon: Clock },
          { id: 'frequency', label: 'Frequency', Icon: BarChart2 },
          { id: 'funnel', label: 'Funnel', Icon: TrendingDown },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            style={{ ...styles.tab, ...(view === id ? styles.tabActive : {}) }}
          >
            <Icon size={13} strokeWidth={view === id ? 2 : 1.5} />
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <select
          value={filters.eventName}
          onChange={(e) => { setFilters(f => ({ ...f, eventName: e.target.value })); setPage(1); }}
          style={styles.select}
        >
          <option value="">All Events</option>
          {frequency.map(f => (
            <option key={f._id} value={f._id}>{f._id} ({f.count})</option>
          ))}
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => { setFilters(f => ({ ...f, startDate: e.target.value })); setPage(1); }}
          style={styles.dateInput}
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => { setFilters(f => ({ ...f, endDate: e.target.value })); setPage(1); }}
          style={styles.dateInput}
        />
      </div>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : (
        <>
          {/* Timeline View */}
          {view === 'timeline' && (
            <div style={styles.timeline}>
              {events.map((event, i) => (
                <div key={event._id || i} style={styles.timelineItem}>
                  <div style={{ ...styles.timelineDot, background: getEventColor(event.eventName) }} />
                  <div style={styles.timelineContent}>
                    <div style={styles.timelineHeader}>
                      <span style={{ ...styles.eventBadge, borderColor: getEventColor(event.eventName) }}>
                        {event.eventName}
                      </span>
                      <span style={styles.timelineTime}>{formatTime(event.timestamp)}</span>
                    </div>
                    {event.eventLabel && (
                      <p style={styles.eventLabel}>{event.eventLabel}</p>
                    )}
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <pre style={styles.metadata}>{JSON.stringify(event.metadata, null, 2)}</pre>
                    )}
                    <span style={styles.visitorTag}>Visitor: {event.visitorId?.slice(0, 8)}...</span>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div style={styles.loading}>No events found</div>
              )}
            </div>
          )}

          {/* Frequency View */}
          {view === 'frequency' && (
            <div style={styles.frequencyChart}>
              {frequency.map((item, i) => {
                const maxCount = frequency[0]?.count || 1;
                const width = (item.count / maxCount) * 100;
                return (
                  <div key={i} style={styles.freqItem}>
                    <span style={styles.freqLabel}>{item._id}</span>
                    <div style={styles.freqBarBg}>
                      <div style={{ ...styles.freqBar, width: `${width}%` }} />
                    </div>
                    <span style={styles.freqCount}>{item.count}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Funnel View */}
          {view === 'funnel' && (
            <div style={styles.funnel}>
              <h3 style={styles.funnelTitle}>CV Conversion Funnel</h3>
              {funnelData.map((step, i) => {
                const maxCount = funnelData[0]?.count || 1;
                const width = Math.max(20, (step.count / maxCount) * 100);
                const dropoff = i > 0 && funnelData[i - 1].count > 0
                  ? Math.round((1 - step.count / funnelData[i - 1].count) * 100)
                  : 0;
                return (
                  <div key={i} style={styles.funnelStep}>
                    <div style={{ ...styles.funnelBar, width: `${width}%` }}>
                      <span style={styles.funnelName}>{step.name}</span>
                      <span style={styles.funnelCount}>{step.count}</span>
                    </div>
                    {i > 0 && (
                      <span style={styles.dropoff}>↓ {dropoff}% drop-off</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {view === 'timeline' && totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ ...styles.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
              >
                <ChevronLeft size={15} strokeWidth={2} /> Prev
              </button>
              <span style={styles.pageInfo}>{page} <span style={{ color: '#374151' }}>/ {totalPages}</span></span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ ...styles.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
              >
                Next <ChevronRight size={15} strokeWidth={2} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  pageTitle: {
    color: '#f9fafb',
    fontSize: '26px',
    fontWeight: 700,
    margin: 0,
    letterSpacing: '-0.03em',
  },
  subtitle: {
    color: '#4b5563',
    fontSize: '13px',
    marginTop: '4px',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: 'rgba(26,28,36,0.6)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '9px 16px',
    color: '#d1d5db',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 500,
    fontFamily: 'inherit',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '16px',
    background: 'rgba(14,16,22,0.7)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '12px',
    padding: '4px',
    width: 'fit-content',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    color: '#6b7280',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 500,
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
  tabActive: {
    background: 'rgba(99,102,241,0.12)',
    color: '#a5b4fc',
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  select: {
    background: 'rgba(26,28,36,0.6)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '9px 12px',
    color: '#d1d5db',
    fontSize: '12px',
    outline: 'none',
    cursor: 'pointer',
    maxWidth: '250px',
    fontFamily: 'inherit',
  },
  dateInput: {
    background: 'rgba(26,28,36,0.6)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '9px 12px',
    color: '#d1d5db',
    fontSize: '12px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  loading: {
    color: '#6b7280',
    textAlign: 'center',
    padding: '80px 20px',
    fontSize: '13px',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  timelineItem: {
    display: 'flex',
    gap: '14px',
    padding: '14px 18px',
    background: 'rgba(18,20,26,0.5)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.03)',
    transition: 'border-color 0.15s',
  },
  timelineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginTop: '6px',
    flexShrink: 0,
    boxShadow: '0 0 6px currentColor',
  },
  timelineContent: {
    flex: 1,
    minWidth: 0,
  },
  timelineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  eventBadge: {
    fontSize: '11px',
    fontFamily: 'monospace',
    color: '#e5e7eb',
    border: '1px solid',
    borderRadius: '5px',
    padding: '2px 9px',
  },
  timelineTime: {
    color: '#4b5563',
    fontSize: '11px',
    whiteSpace: 'nowrap',
  },
  eventLabel: {
    color: '#9ca3af',
    fontSize: '12px',
    margin: '4px 0 0',
  },
  metadata: {
    color: '#4b5563',
    fontSize: '10px',
    fontFamily: 'monospace',
    background: 'rgba(8,9,13,0.8)',
    padding: '8px',
    borderRadius: '6px',
    margin: '6px 0 0',
    overflow: 'auto',
    maxHeight: '80px',
  },
  visitorTag: {
    color: '#374151',
    fontSize: '10px',
    fontFamily: 'monospace',
    marginTop: '4px',
    display: 'block',
  },
  frequencyChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    background: 'rgba(18,20,26,0.6)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '14px',
    padding: '24px',
  },
  freqItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  freqLabel: {
    color: '#9ca3af',
    fontSize: '11px',
    fontFamily: 'monospace',
    minWidth: '160px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  freqBarBg: {
    flex: 1,
    height: '6px',
    background: 'rgba(26,28,36,0.8)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  freqBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
  },
  freqCount: {
    color: '#6b7280',
    fontSize: '12px',
    minWidth: '40px',
    textAlign: 'right',
    fontWeight: 600,
  },
  funnel: {
    background: 'rgba(18,20,26,0.6)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '14px',
    padding: '32px',
  },
  funnelTitle: {
    color: '#e5e7eb',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '24px',
    letterSpacing: '-0.01em',
  },
  funnelStep: {
    marginBottom: '12px',
  },
  funnelBar: {
    background: 'linear-gradient(90deg, #6366f1, #4f46e5)',
    borderRadius: '10px',
    padding: '14px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '20%',
    transition: 'width 0.4s ease',
  },
  funnelName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '12px',
    fontFamily: 'monospace',
  },
  funnelCount: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: 700,
  },
  dropoff: {
    color: '#ef4444',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 0 8px 20px',
    opacity: 0.7,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: '20px',
  },
  pageBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(26,28,36,0.6)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '8px 14px',
    color: '#d1d5db',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'opacity 0.2s',
  },
  pageInfo: {
    color: '#e5e7eb',
    fontSize: '13px',
    fontWeight: 600,
    minWidth: '40px',
    textAlign: 'center',
  },
};

export default EventsPage;
