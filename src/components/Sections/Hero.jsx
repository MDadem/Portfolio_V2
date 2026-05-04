import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const techRow1 = [
    { name: 'React', icon: '⚛️' },
    { name: 'Next.js', icon: '▲' },
    { name: 'TypeScript', icon: 'TS' },
    { name: 'Node.js', icon: '⬢' },
    { name: 'Framer Motion', icon: '✦' },
    { name: 'TailwindCSS', icon: '🎨' },
    { name: 'GraphQL', icon: '◈' },
    { name: 'Docker', icon: '🐳' },
];

const techRow2 = [
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'Redux', icon: '⟳' },
    { name: 'REST APIs', icon: '⇄' },
    { name: 'Git', icon: '⎇' },
    { name: 'CI/CD', icon: '♾️' },
    { name: 'AWS', icon: '☁️' },
    { name: 'Figma', icon: '◉' },
    { name: 'MongoDB', icon: '🍃' },
];

const Hero = () => {
    const heroContainerRef = useRef(null);

    useEffect(() => {
        const heroContainer = heroContainerRef.current;
        if (!heroContainer) return;

        const handleMouseMove = (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 60;
            const y = (window.innerHeight / 2 - e.clientY) / 60;
            heroContainer.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const textVariants = {
        hidden: {
            y: 120,
            opacity: 0,
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
        },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            transition: {
                delay: 0.3 + i * 0.12,
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
            },
        }),
    };

    const fadeUp = {
        hidden: { y: 30, opacity: 0 },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            transition: { delay: 0.8 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        }),
    };

    const renderPills = (items) =>
        [...items, ...items, ...items].map((tech, i) => (
            <span key={i} className="hero-pill">
                <span className="hero-pill-icon">{tech.icon}</span>
                <span className="hero-pill-name">{tech.name}</span>
            </span>
        ));

    return (
        <section className="hero-section">
            {/* Hero Text Container - 3D Parallax */}
            <div ref={heroContainerRef} className="hero-text-container perspective-1000">

                {/* Availability Badge */}
                <motion.div
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="hero-badge"
                >
                    <span className="hero-badge-dot" />
                    <span>Available for work</span>
                </motion.div>

                {/* Giant Background Word */}
                <h1 className="hero-giant-text hero-giant-text--animated">FULLSTACK</h1>

                {/* Main Headline */}
                <div className="hero-lines">
                    <div style={{ overflow: 'hidden' }}>
                        <motion.h1
                            custom={0}
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            className="hero-line"
                        >
                            I CRAFT <span className="gradient-primary">DIGITAL</span>
                        </motion.h1>
                    </div>

                    <div style={{ overflow: 'hidden' }}>
                        <motion.h1
                            custom={1}
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            className="hero-line"
                        >
                            <span className="gradient-secondary">EXPERIENCES</span> THAT
                        </motion.h1>
                    </div>

                    <div style={{ overflow: 'hidden' }}>
                        <motion.h1
                            custom={2}
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            className="hero-line"
                        >
                            <span className="text-stroke-animated">PERFORM</span>
                        </motion.h1>
                    </div>
                </div>

                {/* Subtitle */}
                <motion.div
                    custom={1}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="hero-subtitle-wrapper"
                >
                    <p className="hero-subtitle-desc">
                        FullStack Engineer crafting high-performance web applications
                        <br className="hidden-mobile" />
                        with scalable architecture, seamless interactions & pixel-perfect UI.
                    </p>
                </motion.div>
            </div>

            {/* Stats Row — separate from parallax container */}
            <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="hero-stats"
            >
                <div className="hero-stat">
                    <span className="hero-stat-value gradient-primary">3+</span>
                    <span className="hero-stat-label">Years Experience</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                    <span className="hero-stat-value gradient-secondary">15+</span>
                    <span className="hero-stat-label">Projects Delivered</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                    <span className="hero-stat-value" style={{ color: '#00D2BE' }}>100%</span>
                    <span className="hero-stat-label">Client Satisfaction</span>
                </div>
            </motion.div>

            {/* Creative Tech Carousel */}
            <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="hero-carousel"
            >
                <div className="hero-carousel-row hero-carousel-row--left">
                    <div className="hero-carousel-track">{renderPills(techRow1)}</div>
                </div>
                <div className="hero-carousel-row hero-carousel-row--right">
                    <div className="hero-carousel-track hero-carousel-track--reverse">{renderPills(techRow2)}</div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="scroll-indicator"
            >
                <div className="scroll-mouse">
                    <div className="scroll-mouse-wheel" />
                </div>
                <span>Scroll to explore</span>
            </motion.div>
        </section>
    );
};

export default Hero;
