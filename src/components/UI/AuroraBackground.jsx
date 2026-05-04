import { useEffect, useRef } from 'react';

const AuroraBackground = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationId;
        let mouseX = 50;
        let mouseY = 50;
        let currentX = 50;
        let currentY = 50;

        const handleMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth) * 100;
            mouseY = (e.clientY / window.innerHeight) * 100;
        };

        const animate = () => {
            currentX += (mouseX - currentX) * 0.02;
            currentY += (mouseY - currentY) * 0.02;
            container.style.setProperty('--mouse-x', `${currentX}%`);
            container.style.setProperty('--mouse-y', `${currentY}%`);
            animationId = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div ref={containerRef} className="aurora-bg" aria-hidden="true">
            <div className="aurora-orb aurora-orb--1" />
            <div className="aurora-orb aurora-orb--2" />
            <div className="aurora-orb aurora-orb--3" />
            <div className="aurora-orb aurora-orb--4" />
            <div className="aurora-orb aurora-orb--5" />
            <div className="aurora-orb aurora-orb--mouse" />
            <div className="aurora-noise" />
            <div className="aurora-grid" />
        </div>
    );
};

export default AuroraBackground;
