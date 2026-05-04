import { useEffect, useRef } from 'react';
import {
    Brain, Server, Monitor, Shield, Zap, Code2, Trophy, Swords,
    GitBranch, Database, Container, Cpu, Sparkles, ArrowRight,
    BarChart3, Users, Layers, Bot, Gauge, Eye
} from 'lucide-react';
import logo from '../../algo_arena/logo_algoarena.png';

/* ═══════════════════════════════════════════════
   Architecture Layers — the 3-tier system
   ═══════════════════════════════════════════════ */

const architectureLayers = [
    {
        id: 'frontend',
        label: 'Frontend',
        Icon: Monitor,
        color: '#6E5CFF',
        tech: [
            { name: 'React 19', icon: '⚛️' },
            { name: 'Vite 7', icon: '⚡' },
            { name: 'Chakra UI', icon: '🎨' },
            { name: 'Monaco Editor', icon: '📝' },
            { name: 'Framer Motion', icon: '✦' },
            { name: 'Chart.js', icon: '📊' },
            { name: 'React Router 7', icon: '🔀' },
            { name: 'Tailwind CSS', icon: '💨' },
        ],
        desc: 'Interactive workspaces with a premium Monaco code editor, real-time battle interfaces, XP progression system, admin analytics dashboards, and a full accessibility suite with voice commands.',
    },
    {
        id: 'backend',
        label: 'Backend API',
        Icon: Server,
        color: '#A3FF12',
        tech: [
            { name: 'NestJS 11', icon: '🔴' },
            { name: 'TypeScript', icon: 'TS' },
            { name: 'MongoDB', icon: '🍃' },
            { name: 'Dockerode', icon: '🐳' },
            { name: 'Passport/JWT', icon: '🔑' },
            { name: 'Redis', icon: '⚡' },
            { name: 'Swagger', icon: '📜' },
            { name: 'Groq SDK', icon: '🤖' },
        ],
        desc: 'High-performance NestJS engine with Docker-sandboxed code execution (no-network, resource-limited containers), JWT + OAuth2 auth, real-time judge pipeline, and AI-powered challenge generation via LLMs.',
    },
    {
        id: 'ai',
        label: 'AI Complexity Model',
        Icon: Brain,
        color: '#00D2BE',
        tech: [
            { name: 'XGBoost', icon: '🌲' },
            { name: 'FastAPI', icon: '🚀' },
            { name: 'scikit-learn', icon: '🔬' },
            { name: 'Python AST', icon: '🐍' },
            { name: 'SSE Streaming', icon: '📡' },
            { name: 'Pattern Rules', icon: '🎯' },
        ],
        desc: 'Custom-trained XGBoost classifier (88% macro-F1 on 9,800 samples) predicts Big-O complexity of every submission. Bayesian rule–model fusion, temperature-calibrated confidence, and a continual learning pipeline that self-improves from production data.',
    },
];

/* ═══════════════════════════════════════════════
   Key Features — the highlights
   ═══════════════════════════════════════════════ */

const features = [
    { Icon: Container, title: 'Docker Sandboxed Execution', desc: 'Isolated containers with no network, limited CPU/RAM, readonly rootfs. Supports Python and JavaScript.', color: '#6E5CFF' },
    { Icon: Bot, title: 'AI Challenge Generation', desc: 'LLM-powered challenge creation via Groq. Automated difficulty calibration and test case synthesis.', color: '#A3FF12' },
    { Icon: Sparkles, title: 'Live Complexity Prediction', desc: 'SSE "thinking trace" streams analysis in real-time while Docker runs tests. ML badge shows confidence.', color: '#00D2BE' },
    { Icon: Swords, title: 'Real-Time Battle Arena', desc: 'Global matchmaking, live battle interfaces, speed challenges with timed placement flows.', color: '#FF6B6B' },
    { Icon: Trophy, title: 'XP & Rank Progression', desc: 'Gamified progression with XP gains, rank stats, streaks, leaderboard standings, and placement tests.', color: '#FFB347' },
    { Icon: Shield, title: 'Enterprise-Grade Auth', desc: 'reCAPTCHA v3, JWT rotation, OAuth2 (Google + GitHub), 2FA, RBAC with custom decorators.', color: '#8171FF' },
    { Icon: BarChart3, title: 'Admin Analytics Suite', desc: 'High-density Chart.js dashboards, audit logs with rollback, Docker sandbox telemetry, session monitoring.', color: '#FF6B6B' },
    { Icon: Eye, title: 'Full Accessibility System', desc: 'High contrast, dyslexia font, font scaling, voice mode + voice commands, draggable floating widget.', color: '#FFB347' },
];

/* ═══════════════════════════════════════════════
   Stats
   ═══════════════════════════════════════════════ */

const stats = [
    { value: '50+', label: 'API Endpoints' },
    { value: '3', label: 'Micro-services' },
    { value: '92%', label: 'ML Model F1' },
    { value: '9.8K', label: 'Training Samples' },
];

/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */

const AlgoArena = () => {
    const layerRefs = useRef([]);
    const featureRefs = useRef([]);

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
            { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
        );
        [...layerRefs.current, ...featureRefs.current].forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section className="arena-section">
            <div className="container-6xl">
                {/* ── Header ── */}
                <div className="arena-header">
                    <span className="section-label" style={{ color: '#00D2BE' }}>
                        Featured Project
                    </span>
                    <div className="arena-title-row">
                        <img src={logo} alt="AlgoArena Logo" className="arena-logo" />
                        <div>
                            <h2 className="section-title" style={{ marginBottom: '8px' }}>
                                Algo<span className="text-stroke">Arena</span>
                            </h2>
                            <p className="arena-tagline">
                                A full-stack competitive programming platform with AI-powered
                                complexity analysis — built for learners, engineers, and recruiters
                                who want proof that code quality matters.
                            </p>
                        </div>
                    </div>
                    <p className="arena-desc">
                        Three independently deployed services — React frontend, NestJS API, and a Python ML
                        microservice — orchestrated to deliver real-time code evaluation, gamified progression,
                        and intelligent complexity prediction on every submission.
                    </p>
                </div>

                {/* ── Stats Bar ── */}
                <div className="arena-stats">
                    {stats.map((stat, i) => (
                        <div key={i} className="arena-stat">
                            <span className="arena-stat-value">{stat.value}</span>
                            <span className="arena-stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* ── Architecture Layers ── */}
                <h3 className="arena-section-heading">
                    <Layers size={18} color="#6E5CFF" />
                    Three-Layer Architecture
                </h3>

                <div className="arena-layers">
                    {architectureLayers.map((layer, i) => (
                        <div
                            key={layer.id}
                            ref={(el) => (layerRefs.current[i] = el)}
                            className="arena-layer"
                            style={{ transitionDelay: `${i * 0.12}s`, '--layer-color': layer.color }}
                        >
                            <div className="arena-layer-header">
                                <div className="arena-layer-icon" style={{ background: `${layer.color}18` }}>
                                    <layer.Icon size={20} color={layer.color} />
                                </div>
                                <h4 className="arena-layer-title">{layer.label}</h4>
                            </div>

                            <p className="arena-layer-desc">{layer.desc}</p>

                            <div className="arena-layer-tech">
                                {layer.tech.map((t) => (
                                    <span key={t.name} className="arena-tech-chip">
                                        <span className="arena-tech-chip-icon">{t.icon}</span>
                                        {t.name}
                                    </span>
                                ))}
                            </div>

                            <div className="arena-layer-glow" style={{ background: layer.color }} />
                        </div>
                    ))}
                </div>

                {/* ── Data Flow ── */}
                <div className="arena-flow">
                    <div className="arena-flow-step">
                        <Code2 size={18} color="#6E5CFF" />
                        <span>User submits code</span>
                    </div>
                    <div className="arena-flow-arrow">→</div>
                    <div className="arena-flow-step">
                        <Container size={18} color="#A3FF12" />
                        <span>Docker sandbox executes</span>
                    </div>
                    <div className="arena-flow-arrow">→</div>
                    <div className="arena-flow-step">
                        <Brain size={18} color="#00D2BE" />
                        <span>ML model predicts O(n)</span>
                    </div>
                    <div className="arena-flow-arrow">→</div>
                    <div className="arena-flow-step">
                        <Trophy size={18} color="#FFB347" />
                        <span>XP awarded, rank updated</span>
                    </div>
                </div>

                {/* ── Key Features ── */}
                <h3 className="arena-section-heading">
                    <Zap size={18} color="#A3FF12" />
                    Engineering Highlights
                </h3>

                <div className="arena-features-grid">
                    {features.map((feat, i) => (
                        <div
                            key={i}
                            ref={(el) => (featureRefs.current[i] = el)}
                            className="arena-feature"
                            style={{ transitionDelay: `${i * 0.06}s` }}
                        >
                            <div className="arena-feature-icon" style={{ background: `${feat.color}14` }}>
                                <feat.Icon size={18} color={feat.color} />
                            </div>
                            <div>
                                <h5 className="arena-feature-title">{feat.title}</h5>
                                <p className="arena-feature-desc">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Links ── */}
                <div className="arena-links">
                    <a
                        href="https://github.com/Salemdiber/Esprit-PI-4twin4-2026-AlgoArena-FrontEnd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="arena-link arena-link--primary"
                    >
                        <GitBranch size={16} />
                        Frontend Repo
                        <ArrowRight size={14} />
                    </a>
                    <a
                        href="https://github.com/Salemdiber/Esprit-PI-4twin4-2026-AlgoArena-BackEnd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="arena-link arena-link--secondary"
                    >
                        <Server size={16} />
                        Backend Repo
                        <ArrowRight size={14} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default AlgoArena;
