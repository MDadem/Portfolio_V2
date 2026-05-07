import { useState, useEffect } from 'react';
import { Globe2, MapPin, Monitor, Smartphone, Calendar, ChevronRight } from 'lucide-react';

const MapPage = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryVisitors, setCountryVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      const res = await fetch('/api/panel/map-data', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCountries(data.countries || []);
      }
    } catch (err) {
      console.error('Failed to fetch map data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountryVisitors = async (country) => {
    setSelectedCountry(country);
    try {
      const res = await fetch(`/api/panel/map-data?country=${encodeURIComponent(country)}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCountryVisitors(data.visitors || []);
      }
    } catch (err) {
      console.error('Failed to fetch country visitors:', err);
    }
  };

  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.loadingSpinner} />
      <span>Loading map data...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const maxCount = Math.max(...countries.map(c => c.count), 1);

  return (
    <div>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Map</h1>
          <p style={styles.subtitle}>Geographic distribution of visitors</p>
        </div>
        <div style={styles.countBadge}>
          <Globe2 size={13} strokeWidth={2} />
          {countries.length} countries
        </div>
      </div>

      <div style={styles.grid}>
        {/* Country List */}
        <div style={styles.countryList}>
          <div style={styles.sectionHeader}>
            <MapPin size={14} strokeWidth={1.8} style={{ color: '#6366f1' }} />
            <h3 style={styles.sectionTitle}>Countries</h3>
          </div>
          {countries.map((c, i) => {
            const width = (c.count / maxCount) * 100;
            const isActive = selectedCountry === c._id;
            return (
              <button
                key={i}
                onClick={() => fetchCountryVisitors(c._id)}
                style={{
                  ...styles.countryItem,
                  ...(isActive ? styles.countryItemActive : {}),
                }}
              >
                <div style={styles.countryRank}>{i + 1}</div>
                <span style={styles.countryName}>{c._id || 'Unknown'}</span>
                <div style={styles.countryBarBg}>
                  <div style={{ ...styles.countryBar, width: `${width}%` }} />
                </div>
                <span style={styles.countryCount}>{c.count}</span>
                <ChevronRight size={12} strokeWidth={2} style={{ color: isActive ? '#6366f1' : '#374151', flexShrink: 0 }} />
              </button>
            );
          })}
          {countries.length === 0 && (
            <p style={styles.empty}>No visitor data yet</p>
          )}
        </div>

        {/* Country Detail */}
        <div style={styles.detail}>
          {selectedCountry ? (
            <>
              <div style={styles.sectionHeader}>
                <MapPin size={14} strokeWidth={1.8} style={{ color: '#10b981' }} />
                <h3 style={styles.sectionTitle}>Visitors from {selectedCountry}</h3>
              </div>
              <div style={styles.visitorGrid}>
                {countryVisitors.map((v, i) => (
                  <div key={v._id || i} style={styles.visitorCard}>
                    <div style={styles.visitorCardRow}>
                      <div style={styles.visitorField}>
                        <span style={styles.visitorLabel}>City</span>
                        <span style={styles.visitorValue}>{v.city || '—'}</span>
                      </div>
                      <div style={styles.visitorField}>
                        <span style={styles.visitorLabel}>Device</span>
                        <span style={{ ...styles.deviceBadge,
                          background: v.deviceType === 'mobile' ? 'rgba(139,92,246,0.1)' : 'rgba(99,102,241,0.1)',
                          color: v.deviceType === 'mobile' ? '#a78bfa' : '#818cf8',
                        }}>{v.deviceType || '—'}</span>
                      </div>
                    </div>
                    <div style={styles.visitorCardRow}>
                      <div style={styles.visitorField}>
                        <span style={styles.visitorLabel}>Browser</span>
                        <span style={styles.visitorValue}>{v.browser}</span>
                      </div>
                      <div style={styles.visitorField}>
                        <span style={styles.visitorLabel}>OS</span>
                        <span style={styles.visitorValue}>{v.os}</span>
                      </div>
                    </div>
                    <div style={styles.visitorDate}>
                      <Calendar size={11} strokeWidth={1.5} />
                      {new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                ))}
                {countryVisitors.length === 0 && (
                  <p style={styles.empty}>No visitors found</p>
                )}
              </div>
            </>
          ) : (
            <div style={styles.placeholder}>
              <Globe2 size={32} strokeWidth={1} style={{ color: '#1f2937', marginBottom: '12px' }} />
              <p style={styles.placeholderText}>Select a country to view visitor details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageHeader: {
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
  countBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: '20px',
    padding: '6px 14px',
    color: '#818cf8',
    fontSize: '12px',
    fontWeight: 500,
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  countryList: {
    background: 'rgba(14,16,22,0.6)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '14px',
    padding: '20px',
    maxHeight: '620px',
    overflow: 'auto',
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
  },
  countryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '9px 10px',
    border: '1px solid transparent',
    borderRadius: '10px',
    background: 'transparent',
    cursor: 'pointer',
    marginBottom: '3px',
    textAlign: 'left',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  countryItemActive: {
    background: 'rgba(99,102,241,0.08)',
    borderColor: 'rgba(99,102,241,0.15)',
  },
  countryRank: {
    color: '#374151',
    fontSize: '10px',
    fontWeight: 700,
    minWidth: '16px',
    textAlign: 'center',
  },
  countryName: {
    color: '#d1d5db',
    fontSize: '12px',
    fontWeight: 500,
    minWidth: '80px',
    whiteSpace: 'nowrap',
  },
  countryBarBg: {
    flex: 1,
    height: '4px',
    background: 'rgba(26,28,36,0.8)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  countryBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  countryCount: {
    color: '#6b7280',
    fontSize: '11px',
    fontWeight: 600,
    minWidth: '24px',
    textAlign: 'right',
  },
  detail: {
    background: 'rgba(14,16,22,0.6)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '14px',
    padding: '20px',
    maxHeight: '620px',
    overflow: 'auto',
  },
  visitorGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  visitorCard: {
    background: 'rgba(8,9,13,0.6)',
    border: '1px solid rgba(255,255,255,0.03)',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  visitorCardRow: {
    display: 'flex',
    gap: '16px',
  },
  visitorField: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  visitorLabel: {
    color: '#374151',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  visitorValue: {
    color: '#d1d5db',
    fontSize: '12px',
    fontWeight: 500,
  },
  deviceBadge: {
    borderRadius: '6px',
    padding: '3px 9px',
    fontSize: '11px',
    fontWeight: 500,
    textTransform: 'capitalize',
    width: 'fit-content',
  },
  visitorDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#374151',
    fontSize: '11px',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '260px',
  },
  placeholderText: {
    color: '#374151',
    fontSize: '13px',
  },
  empty: {
    color: '#374151',
    fontSize: '12px',
    textAlign: 'center',
    padding: '24px',
  },
};

export default MapPage;
