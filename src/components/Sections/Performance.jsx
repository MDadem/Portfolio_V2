import { useEffect, useRef, useState } from 'react';
import { Zap, FileCode, Package, Globe, Timer, BarChart3, ArrowRight, TrendingUp, Gauge } from 'lucide-react';

/* ═══════════════════════════════════════════
   Real Lighthouse data from AlgoArena project
   Source: lighthouse_proofs/ folder
   ═══════════════════════════════════════════ */

const lighthouseCategories = [
    { label: 'Performance', before: 25, after: 95 },
    { label: 'Accessibility', before: 85, after: 100 },
    { label: 'Best Practices', before: 96, after: 100 },
    { label: 'SEO', before: 100, after: 100 },
];

const webVitals = [
    { label: 'First Contentful Paint', abbr: 'FCP', before: '3.7s', after: '0.7s', reduction: 81 },
    { label: 'Largest Contentful Paint', abbr: 'LCP', before: '9.9s', after: '1.0s', reduction: 90 },
    { label: 'Total Blocking Time', abbr: 'TBT', before: '3,320ms', after: '240ms', reduction: 93 },
    { label: 'Speed Index', abbr: 'SI', before: '8.2s', after: '1.6s', reduction: 80 },
];

const techniques = [
    {
        Icon: Package,
        title: '12+ Vendor Chunks',
        desc: 'Route-level code splitting with Vite/Rollup. React, Monaco Editor, Chart.js, Framer Motion, jsPDF — each in isolated cacheable chunks.',
        color: '#6E5CFF',
        bg: 'rgba(110, 92, 255, 0.08)',
    },
    {
        Icon: FileCode,
        title: 'Terser 3-Pass Minification',
        desc: 'Triple-pass Terser with console stripping, dead code elimination, mangle, and pure function removal. CSS code-split and minified per route.',
        color: '#A3FF12',
        bg: 'rgba(163, 255, 18, 0.08)',
    },
    {
        Icon: Timer,
        title: 'Lazy Loading Everywhere',
        desc: 'Route-level React.lazy for all pages. Component-level lazy for battle filters, rank stats, charts, modals, and analytics panels.',
        color: '#00D2BE',
        bg: 'rgba(0, 210, 190, 0.08)',
    },
    {
        Icon: Globe,
        title: 'Brotli + Backend Compression',
        desc: 'shrink-ray-current for Brotli on the API layer, gzip fallback via compression middleware. Static assets served with immutable cache headers.',
        color: '#FF6B6B',
        bg: 'rgba(255, 107, 107, 0.08)',
    },
    {
        Icon: BarChart3,
        title: 'Unlighthouse CI Audits',
        desc: 'Automated multi-route audits across 5+ pages. Continuous Lighthouse CI scoring on every build to catch regressions before deploy.',
        color: '#FFB347',
        bg: 'rgba(255, 179, 71, 0.08)',
    },
    {
        Icon: Zap,
        title: 'PWA + Workbox Caching',
        desc: 'Service Worker with NetworkFirst for pages, StaleWhileRevalidate for JS/CSS, CacheFirst for images and fonts. Offline-capable.',
        color: '#8171FF',
        bg: 'rgba(129, 113, 255, 0.08)',
    },
];

/* ── Animated score ring with before→after transition ── */
const ScoreRing = ({ before, after, label, delay = 0 }) => {
    const [phase, setPhase] = useState('idle');
    const [value, setValue] = useState(0);
    const ref = useRef(null);

    const getColor = (v) => {
        if (v < 50) return '#FF4E42';
        if (v < 90) return '#FFA400';
        return '#0CCE6B';
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setPhase('before');
                        animateTo(before, 1200, () => {
                            setTimeout(() => {
                                setPhase('after');
                                animateTo(after, 1400);
                            }, 800);
                        });
                    }, delay);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [before, after, delay]);

    const animateTo = (target, duration, onDone) => {
        const startTime = performance.now();
        const startVal = 0;
        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
            else if (onDone) onDone();
        };
        setValue(0);
        requestAnimationFrame(animate);
    };

    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    const color = getColor(value);
    const delta = after - before;

    return (
        <div ref={ref} className="perf-ring-card">
            <div className="perf-ring-svg-wrap">
                <svg width="128" height="128" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                    <circle
                        cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 0.08s linear, stroke 0.3s', transform: 'rotate(-90deg)', transformOrigin: '50% 50%', filter: `drop-shadow(0 0 8px ${color}55)` }}
                    />
                </svg>
                <span className="perf-ring-value" style={{ color }}>{value}</span>
            </div>
            <span className="perf-ring-label">{label}</span>
            {phase === 'after' && delta > 0 && (
                <span className="perf-ring-delta">+{delta}</span>
            )}
        </div>
    );
};

/* ── Core Web Vital comparison row ── */
const VitalRow = ({ vital, delay = 0 }) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setTimeout(() => setVisible(true), delay); },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div ref={ref} className={`perf-vital-row ${visible ? 'perf-vital-row--visible' : ''}`}>
            <div className="perf-vital-meta">
                <span className="perf-vital-abbr">{vital.abbr}</span>
                <span className="perf-vital-name">{vital.label}</span>
            </div>
            <div className="perf-vital-comparison">
                <span className="perf-vital-before">{vital.before}</span>
                <ArrowRight size={14} className="perf-vital-arrow" />
                <span className="perf-vital-after">{vital.after}</span>
            </div>
            <div className="perf-vital-bar-wrap">
                <div
                    className="perf-vital-bar"
                    style={{ width: visible ? `${vital.reduction}%` : '0%' }}
                />
            </div>
            <span className="perf-vital-reduction">−{vital.reduction}%</span>
        </div>
    );
};

const Performance = () => {
    const cardsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        cardsRef.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section className="perf-section">
            <div className="container-6xl">
                {/* Header */}
                <div className="perf-header">
                    <span className="section-label" style={{ color: '#00D2BE' }}>
                        05 / Performance Engineering
                    </span>
                    <h2 className="section-title" style={{ marginBottom: '16px' }}>
                        From <span style={{ color: '#FF4E42' }}>25</span> to{' '}
                        <span style={{ color: '#0CCE6B' }}>95</span>
                    </h2>
                    <p className="perf-subtitle">
                        Real Lighthouse scores from a production optimization I led on AlgoArena — a competitive
                        programming platform. Every metric measured, every bottleneck eliminated.
                    </p>
                </div>

                {/* Case Study Context Bar */}
                <div className="perf-context-bar">
                    <div className="perf-context-item">
                        <Gauge size={16} color="#6E5CFF" />
                        <span>Audited with Lighthouse & Unlighthouse CI</span>
                    </div>
                    <div className="perf-context-divider" />
                    <div className="perf-context-item">
                        <TrendingUp size={16} color="#A3FF12" />
                        <span>Route: /battles — Vite dev → Production</span>
                    </div>
                </div>

                {/* Before → After Score Rings */}
                <div className="perf-scores-card">
                    <div className="perf-scores-header">
                        <div className="perf-scores-label">
                            <Zap size={14} color="#A3FF12" />
                            <span>Lighthouse Scores — Watch the Transformation</span>
                        </div>
                        <div className="perf-phase-legend">
                            <span className="perf-legend-before">Before</span>
                            <ArrowRight size={12} style={{ color: '#525252' }} />
                            <span className="perf-legend-after">After</span>
                        </div>
                    </div>
                    <div className="perf-rings">
                        {lighthouseCategories.map((cat, i) => (
                            <ScoreRing
                                key={cat.label}
                                before={cat.before}
                                after={cat.after}
                                label={cat.label}
                                delay={i * 200}
                            />
                        ))}
                    </div>
                </div>

                {/* Core Web Vitals Comparison */}
                <div className="perf-vitals-card">
                    <div className="perf-scores-label">
                        <BarChart3 size={14} color="#00D2BE" />
                        <span>Core Web Vitals — Before vs After</span>
                    </div>
                    <div className="perf-vitals-list">
                        {webVitals.map((vital, i) => (
                            <VitalRow key={vital.abbr} vital={vital} delay={i * 150} />
                        ))}
                    </div>
                </div>

                {/* Optimization Techniques */}
                <h3 className="perf-techniques-heading">How I Got There</h3>
                <div className="perf-techniques-grid">
                    {techniques.map((tech, i) => (
                        <div
                            key={i}
                            ref={(el) => (cardsRef.current[i] = el)}
                            className="perf-tech-card"
                            style={{ transitionDelay: `${i * 0.08}s` }}
                        >
                            <div className="perf-tech-icon" style={{ background: tech.bg }}>
                                <tech.Icon size={20} color={tech.color} />
                            </div>
                            <h4 className="perf-tech-title">{tech.title}</h4>
                            <p className="perf-tech-desc">{tech.desc}</p>
                            <div className="perf-tech-glow" style={{ background: tech.color }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Performance;
