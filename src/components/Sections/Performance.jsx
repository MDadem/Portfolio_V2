import { useEffect, useRef, useState } from 'react';
import { Zap, FileCode, Package, Globe, Timer, BarChart3 } from 'lucide-react';

/* ── Lighthouse-style animated score ring ── */
const ScoreRing = ({ score, label, color, delay = 0 }) => {
    const [animated, setAnimated] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const duration = 1800;
                    const startTime = performance.now();
                    const animate = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setAnimated(Math.round(eased * score));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    setTimeout(() => requestAnimationFrame(animate), delay);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [score, delay]);

    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animated / 100) * circumference;

    return (
        <div ref={ref} className="perf-ring-card">
            <div className="perf-ring-svg-wrap">
                <svg width="128" height="128" viewBox="0 0 128 128">
                    <circle
                        cx="64" cy="64" r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="8"
                    />
                    <circle
                        cx="64" cy="64" r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{
                            transition: 'stroke-dashoffset 0.1s linear',
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%',
                            filter: `drop-shadow(0 0 8px ${color}55)`,
                        }}
                    />
                </svg>
                <span className="perf-ring-value" style={{ color }}>{animated}</span>
            </div>
            <span className="perf-ring-label">{label}</span>
        </div>
    );
};

/* ── Web Vital metric bar ── */
const VitalBar = ({ label, value, unit, threshold, color, delay = 0 }) => {
    const [width, setWidth] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        const pct = Math.min((1 - threshold) * 100, 95);
                        setWidth(pct);
                    }, delay);
                }
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold, delay]);

    return (
        <div ref={ref} className="perf-vital">
            <div className="perf-vital-header">
                <span className="perf-vital-label">{label}</span>
                <span className="perf-vital-value" style={{ color }}>
                    {value}<span className="perf-vital-unit">{unit}</span>
                </span>
            </div>
            <div className="perf-vital-track">
                <div
                    className="perf-vital-fill"
                    style={{
                        width: `${width}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}88)`,
                        boxShadow: `0 0 12px ${color}44`,
                    }}
                />
            </div>
        </div>
    );
};

/* ── Optimization technique cards ── */
const techniques = [
    {
        Icon: Package,
        title: 'Code Splitting & Chunking',
        desc: 'Dynamic imports and route-level splitting to ship only the code users need. Lazy-loaded chunks reduce initial bundle by up to 60%.',
        color: '#6E5CFF',
        bg: 'rgba(110, 92, 255, 0.08)',
    },
    {
        Icon: FileCode,
        title: 'CSS & Asset Minification',
        desc: 'Tree-shaken CSS, Brotli compression, and PurgeCSS pipelines eliminate dead code. Critical CSS inlined, rest deferred.',
        color: '#A3FF12',
        bg: 'rgba(163, 255, 18, 0.08)',
    },
    {
        Icon: Timer,
        title: 'Load Time Optimization',
        desc: 'Preloading critical resources, image optimization with AVIF/WebP, font-display swap, and skeleton screens for perceived performance.',
        color: '#00D2BE',
        bg: 'rgba(0, 210, 190, 0.08)',
    },
    {
        Icon: Globe,
        title: 'API Bottleneck Reduction',
        desc: 'Request batching, edge caching with stale-while-revalidate, GraphQL query optimization, and connection pooling to cut TTFB.',
        color: '#FF6B6B',
        bg: 'rgba(255, 107, 107, 0.08)',
    },
    {
        Icon: BarChart3,
        title: 'Lighthouse & Unlighthouse Audits',
        desc: 'Automated multi-page audits via Unlighthouse, continuous CI scoring with Lighthouse CI, and budget alerts on regressions.',
        color: '#FFB347',
        bg: 'rgba(255, 179, 71, 0.08)',
    },
    {
        Icon: Zap,
        title: 'Runtime Performance',
        desc: 'React profiling, memoization strategies, virtualized lists, debounced events, and Web Workers for heavy computations.',
        color: '#8171FF',
        bg: 'rgba(129, 113, 255, 0.08)',
    },
];

const Performance = () => {
    const cardsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.transition =
                            'opacity 0.7s ease-out, transform 0.7s ease-out';
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
                        04 / Performance
                    </span>
                    <h2 className="section-title" style={{ marginBottom: '16px' }}>
                        Obsessed with <span className="text-stroke">Speed</span>
                    </h2>
                    <p className="perf-subtitle">
                        Every millisecond counts. I engineer applications that score green across
                        Lighthouse, pass Core Web Vitals, and deliver instant experiences.
                    </p>
                </div>

                {/* Dashboard: Scores + Vitals side by side */}
                <div className="perf-dashboard">
                    {/* Lighthouse Scores */}
                    <div className="perf-scores-card">
                        <div className="perf-scores-label">
                            <Zap size={14} color="#A3FF12" />
                            <span>Lighthouse Scores</span>
                        </div>
                        <div className="perf-rings">
                            <ScoreRing score={98} label="Performance" color="#A3FF12" delay={0} />
                            <ScoreRing score={100} label="Accessibility" color="#6E5CFF" delay={150} />
                            <ScoreRing score={95} label="Best Practices" color="#00D2BE" delay={300} />
                            <ScoreRing score={100} label="SEO" color="#FFB347" delay={450} />
                        </div>
                    </div>

                    {/* Web Vitals */}
                    <div className="perf-vitals-card">
                        <div className="perf-scores-label">
                            <BarChart3 size={14} color="#00D2BE" />
                            <span>Core Web Vitals</span>
                        </div>
                        <div className="perf-vitals-list">
                            <VitalBar label="LCP" value="1.2" unit="s" threshold={0.52} color="#A3FF12" delay={200} />
                            <VitalBar label="FID" value="8" unit="ms" threshold={0.92} color="#6E5CFF" delay={350} />
                            <VitalBar label="CLS" value="0.02" unit="" threshold={0.8} color="#00D2BE" delay={500} />
                            <VitalBar label="TTFB" value="120" unit="ms" threshold={0.76} color="#FFB347" delay={650} />
                            <VitalBar label="INP" value="45" unit="ms" threshold={0.82} color="#8171FF" delay={800} />
                        </div>
                    </div>
                </div>

                {/* Technique Cards */}
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
