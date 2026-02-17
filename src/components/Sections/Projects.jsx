import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

const projects = [
    {
        title: 'Nova Financial',
        subtitle: 'Redesigned onboarding architecture to reduce cognitive load and increase activation.',
        description: 'Rebuilt the mobile banking experience with fluid motion and predictive interfaces. Focused on reducing friction in account setup and first transaction completion.',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop',
        tags: ['Fintech', 'Lead Product Designer', '4 Months'],
        metrics: [
            { label: 'Retention', value: '+40%', colored: true },
            { label: 'Avg. Time', value: '2.5s', colored: false },
            { label: 'Collaboration', value: 'Team of 5', colored: false },
        ],
        color: '#6E5CFF',
        gradientFrom: 'rgba(90, 74, 219, 0.2)',
        stickyTop: 96,
    },
    {
        title: 'Nexus AI',
        subtitle: 'Built the core interaction model and visual language for a generative design system.',
        description: '0 → 1 product design for an AI-powered design tool. Focused on reducing complexity in generative workflows while maintaining creative control for users.',
        image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1374&auto=format&fit=crop',
        tags: ['AI Tool', 'Founding Designer', '6 Months'],
        metrics: [
            { label: 'Users', value: '10k+', colored: true },
            { label: 'Product', value: '0 → 1', colored: false },
            { label: 'Collaboration', value: 'Team of 3', colored: false },
        ],
        color: '#A3FF12',
        gradientFrom: 'rgba(140, 230, 15, 0.2)',
        stickyTop: 112,
    },
    {
        title: 'Lumina',
        subtitle: 'Immersive e-commerce experience focused on WebGL product visualization and seamless transitions.',
        description: 'Designed a high-end lighting e-commerce platform with 3D product exploration. Balanced visual richness with performance and conversion optimization.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1470&auto=format&fit=crop',
        tags: ['E-Commerce', 'Senior Product Designer', '5 Months'],
        metrics: [
            { label: 'Conversion', value: '3x', colored: true },
            { label: 'SOTD', value: 'Awwwards', colored: false },
            { label: 'Collaboration', value: 'Team of 8', colored: false },
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
                                        <a href="#" className="project-cta" style={{ color: project.color }}>
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
