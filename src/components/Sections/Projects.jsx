import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { trackEvent } from '../../tracker/TrackingProvider';

const projects = [
    {
        title: 'FitForge',
        subtitle: 'Modern fitness web application for workout tracking and performance analytics.',
        description:
            'Built a responsive gym management and workout tracking platform with real-time progress charts, authentication, and performance dashboards. Focused on clean architecture, optimized rendering, and smooth micro-interactions.',
        image:
            'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1470&auto=format&fit=crop',
        tags: ['Fitness App', 'React', '6 Months'],
        metrics: [
            { label: 'Active Users', value: '1k+', colored: true },
            { label: 'Performance', value: '95+ Lighthouse', colored: false },
            { label: 'Stack', value: 'React / Node', colored: false },
        ],
        color: '#6E5CFF',
        gradientFrom: 'rgba(110, 92, 255, 0.2)',
        stickyTop: 96,
    },
    {
        title: 'InsightAI Dashboard',
        subtitle: 'AI-powered analytics dashboard for business intelligence.',
        description:
            'Developed a scalable frontend architecture for an AI SaaS dashboard with dynamic data visualization, role-based access, and real-time updates. Emphasized performance optimization, reusable component systems, and clean state management.',
        image:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop',
        tags: ['AI SaaS', 'Dashboard', '5 Months'],
        metrics: [
            { label: 'Data Points', value: '1M+', colored: true },
            { label: 'Load Time', value: '<1.5s', colored: false },
            { label: 'Team', value: 'Team of 1', colored: false },
        ],
        color: '#A3FF12',
        gradientFrom: 'rgba(163, 255, 18, 0.2)',
        stickyTop: 112,
    },
    {
        title: 'NovaCommerce',
        subtitle: 'High-performance e-commerce platform with advanced UI interactions.',
        description:
            'Engineered a modern e-commerce frontend with product filtering, smooth animations, and optimized checkout flows. Focused on accessibility, performance budgets, and scalable component design.',
        image:
            'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1470&auto=format&fit=crop',
        tags: ['E-Commerce', 'Frontend Engineering', '4 Months'],
        metrics: [
            { label: 'Conversion', value: '+32%', colored: true },
            { label: 'Core Web Vitals', value: 'Optimized', colored: false },
            { label: 'Stack', value: 'React / Stripe', colored: false },
        ],
        color: '#8171FF',
        gradientFrom: 'rgba(129, 113, 255, 0.2)',
        stickyTop: 128,
    },
];


const Projects = () => {
    const cardRefs = useRef([]);

    useEffect(() => {
        const cards = cardRefs.current;
        if (!cards || cards.length === 0) return;

        function updateCardTransforms() {
            const viewportH = window.innerHeight;

            cards.forEach((wrapper, i) => {
                if (!wrapper) return;

                const innerCard = wrapper.querySelector('.project-card');
                if (!innerCard) return;

                const rect = wrapper.getBoundingClientRect();
                const stickyTop = projects[i].stickyTop;

                const offset = rect.top - stickyTop;

                // Card is in sticky zone
                if (offset <= 0) {

                    // How much it has moved past sticky point
                    const progress = Math.min(1, Math.abs(offset) / (viewportH * 0.5));

                    // Stronger stacking effect
                    const scale = 1 - (progress * 0.1);       // 1 → 0.9
                    const translateY = -(progress * 60);      // 0 → -60px
                    const opacity = 1 - (progress * 0.3);     // 1 → 0.7

                    innerCard.style.transform = `translateY(${translateY}px) scale(${scale})`;
                    innerCard.style.opacity = opacity;

                    // Push older cards back in depth
                    innerCard.style.zIndex = 10 - i;
                } else {
                    innerCard.style.transform = `translateY(0px) scale(1)`;
                    innerCard.style.opacity = 1;
                    innerCard.style.zIndex = 10 - i;
                }
            });
        }


        // Throttle scroll updates for performance
        let ticking = false;
        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateCardTransforms();
                    ticking = false;
                });
                ticking = true;
            }
        }

        // Run immediately
        updateCardTransforms();

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', updateCardTransforms, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateCardTransforms);
        };
    }, []);

    return (
        <section id="work" className="projects-section">
            <div className="container-7xl">
                {/* Section Header */}
                <div style={{ marginBottom: '96px' }}>
                    <span className="section-label" style={{ color: '#6E5CFF' }}>03 / Selected Work</span>
                    <h2 className="section-title" style={{ marginBottom: '24px' }}>
                        Product <span className="text-stroke">Systems</span>
                    </h2>
                    <p className="projects-subtitle">
                        Case studies focused on strategy, constraints, and measurable impact.
                    </p>
                </div>

                {/* Project Cards — stacking like papers on a desk */}
                {projects.map((project, index) => (
                    <div
                        key={index}
                        ref={(el) => (cardRefs.current[index] = el)}
                        className="project-card-wrapper"
                        style={{
                            position: 'sticky',
                            top: `${project.stickyTop}px`,
                            zIndex: index + 1,
                            marginBottom: '96px',
                        }}
                    >
                        <div
                            className="project-card group"
                            style={{ '--project-color': project.color }}
                        >
                            <div className="project-grid">
                                {/* Left: Content */}
                                <div className="project-info">
                                    <div>
                                        <div className="project-tags">
                                            {project.tags.map((tag) => (
                                                <span key={tag} className="project-tag">{tag}</span>
                                            ))}
                                        </div>
                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-subtitle">{project.subtitle}</p>
                                        <p className="project-desc">{project.description}</p>
                                    </div>
                                    <div className="project-bottom">
                                        <div className="project-metrics">
                                            {project.metrics.map((metric) => (
                                                <div key={metric.label}>
                                                    <span
                                                        className="metric-value"
                                                        style={{ color: metric.colored ? project.color : '#E5E5E5' }}
                                                    >
                                                        {metric.value}
                                                    </span>
                                                    <span className="metric-label">{metric.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <a
                                            href="#"
                                            className="project-cta"
                                            style={{ color: project.color }}
                                            onClick={() => trackEvent('project_clicked', { projectName: project.title })}
                                        >
                                            View Full Case Study <ArrowRight size={16} />
                                        </a>
                                    </div>
                                </div>

                                {/* Right: Image */}
                                <div className="project-image-wrapper">
                                    <div
                                        className="project-image-overlay"
                                        style={{
                                            background: `linear-gradient(to bottom right, ${project.gradientFrom}, rgba(11, 13, 18, 0.8))`,
                                        }}
                                    />
                                    <img
                                        src={project.image}
                                        alt={`${project.title} Interface`}
                                        className="project-image"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;
