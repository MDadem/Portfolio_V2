import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Hero = () => {
    const heroContainerRef = useRef(null);

    useEffect(() => {
        const heroContainer = heroContainerRef.current;
        if (!heroContainer) return;

        const handleMouseMove = (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 50;
            const y = (window.innerHeight / 2 - e.clientY) / 50;
            heroContainer.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const textVariants = {
        hidden: {
            y: 100,
            opacity: 0,
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
        },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            transition: {
                delay: i * 0.1,
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
            },
        }),
    };

    return (
        <section className="hero-section">
            {/* Background Blobs */}
            <div className="hero-blobs">
                <div className="hero-blob hero-blob--primary animate-float" />
                <div className="hero-blob hero-blob--secondary animate-float" style={{ animationDelay: '-3s' }} />
            </div>

            {/* Hero Text Container - 3D parallax */}
            <div ref={heroContainerRef} className="hero-text-container perspective-1000">
                {/* Giant background text */}
                <h1 className="hero-giant-text text-stroke">SYSTEMS</h1>

                {/* Main text lines */}
                <div className="hero-lines">
                    <div style={{ overflow: 'hidden' }}>
                        <motion.h1
                            custom={0}
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            className="hero-line"
                        >
                            I DESIGN <span className="gradient-primary">SCALABLE</span>
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
                            <span className="gradient-secondary">PRODUCT</span> SYSTEMS
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
                            THAT <span style={{ color: '#525252' }}>GROW</span>
                        </motion.h1>
                    </div>
                </div>

                {/* Subtitle */}
                <div className="hero-subtitle-wrapper">
                    <motion.div
                        custom={6}
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="hero-subtitle-title">Product Designer</p>
                        <p className="hero-subtitle-desc">
                            Focused on scalable systems, interaction clarity, and measurable outcomes.
                            <br className="hidden-mobile" />
                            I turn complexity into usable structure.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="scroll-indicator animate-bounce">
                <span>Scroll to explore</span>
                <ArrowDown size={16} />
            </div>
        </section>
    );
};

export default Hero;
