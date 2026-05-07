import { useState, useEffect, useCallback } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Radio } from 'lucide-react';

const VisitorsPage = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, sort });
      if (search) params.set('search', search);

      const res = await fetch(`/api/panel/visitors?${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setVisitors(data.visitors);
        setTotalPages(data.totalPages);
        setTotal(data.total);
        setLiveCount(data.liveCount);
      }
    } catch (err) {
      console.error('Failed to fetch visitors:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, sort]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  useEffect(() => {
    const interval = setInterval(fetchVisitors, 30000);
    return () => clearInterval(interval);
  }, [fetchVisitors]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVisitors();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '-';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Visitors</h1>
          <p style={styles.subtitle}>{total.toLocaleString()} total visits recorded</p>
        </div>
        {liveCount > 0 && (
          <div style={styles.liveBadge}>
            <Radio size={12} strokeWidth={2} style={{ animation: 'pulse 2s infinite' }} />
            {liveCount} live now
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchWrap}>
            <Search size={14} strokeWidth={1.8} style={{ color: '#4b5563', flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country, browser, IP..."
              style={styles.searchInput}
            />
          </div>
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>
        <div style={styles.sortWrap}>
          <ArrowUpDown size={13} strokeWidth={1.8} style={{ color: '#4b5563' }} />
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} style={styles.select}>
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="-sessionDuration">Longest Session</option>
            <option value="country">Country A–Z</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={styles.loading}>
          <div style={styles.loadingSpinner} />
          <span>Loading visitors...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Time','IP','Location','Browser','OS','Device','Referrer','Duration','Pages'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visitors.map((v, i) => (
                <tr key={v._id || i} style={styles.tr}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={styles.td}>{formatDate(v.createdAt)}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px', color: '#6b7280' }}>{v.ip}</td>
                  <td style={styles.td}>
                    <span style={styles.countryTag}>{v.country}</span>
                    {v.city && v.city !== 'Unknown' && (
                      <span style={styles.cityLabel}> {v.city}</span>
                    )}
                  </td>
                  <td style={styles.td}>{v.browser} <span style={styles.dimText}>{v.browserVersion}</span></td>
                  <td style={styles.td}>{v.os}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.deviceBadge,
                      background: v.deviceType === 'mobile' ? 'rgba(139,92,246,0.1)' : v.deviceType === 'tablet' ? 'rgba(6,182,212,0.1)' : 'rgba(99,102,241,0.1)',
                      color: v.deviceType === 'mobile' ? '#a78bfa' : v.deviceType === 'tablet' ? '#22d3ee' : '#818cf8',
                    }}>{v.deviceType || '—'}</span>
                  </td>
                  <td style={{ ...styles.td, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {v.referrer || <span style={styles.dimText}>direct</span>}
                  </td>
                  <td style={styles.td}>{formatDuration(v.sessionDuration)}</td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <span style={styles.pageCountBadge}>{v.pagesVisited?.length || 0}</span>
                  </td>
                </tr>
              ))}
              {visitors.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ ...styles.td, textAlign: 'center', padding: '48px', color: '#374151' }}>
                    No visitors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ ...styles.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={15} strokeWidth={2} />
            Prev
          </button>
          <span style={styles.pageInfo}>
            {page} <span style={{ color: '#374151' }}>/ {totalPages}</span>
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ ...styles.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
          >
            Next
            <ChevronRight size={15} strokeWidth={2} />
          </button>
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
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
  liveBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: 'rgba(16,185,129,0.08)',
    border: '1px solid rgba(16,185,129,0.15)',
    borderRadius: '20px',
    padding: '6px 14px',
    color: '#34d399',
    fontSize: '12px',
    fontWeight: 500,
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  searchForm: {
    display: 'flex',
    gap: '8px',
    flex: 1,
    minWidth: '200px',
  },
  searchWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(26,28,36,0.6)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '0 14px',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    padding: '10px 0',
    color: '#f3f4f6',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  searchBtn: {
    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 18px',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 500,
    fontFamily: 'inherit',
  },
  sortWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(26,28,36,0.6)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '0 14px',
  },
  select: {
    background: 'none',
    border: 'none',
    padding: '10px 0',
    color: '#d1d5db',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  tableWrapper: {
    overflowX: 'auto',
    background: 'rgba(14,16,22,0.6)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '14px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
  },
  th: {
    color: '#374151',
    fontWeight: 600,
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    padding: '14px 16px',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    whiteSpace: 'nowrap',
    background: 'rgba(18,20,26,0.4)',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    transition: 'background 0.15s',
  },
  td: {
    color: '#d1d5db',
    padding: '13px 16px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
  },
  countryTag: {
    color: '#e5e7eb',
    fontWeight: 500,
  },
  cityLabel: {
    color: '#4b5563',
    fontSize: '11px',
  },
  dimText: {
    color: '#4b5563',
  },
  deviceBadge: {
    borderRadius: '6px',
    padding: '3px 9px',
    fontSize: '11px',
    fontWeight: 500,
    textTransform: 'capitalize',
  },
  pageCountBadge: {
    background: 'rgba(99,102,241,0.1)',
    color: '#818cf8',
    borderRadius: '6px',
    padding: '2px 9px',
    fontSize: '11px',
    fontWeight: 600,
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

export default VisitorsPage;
