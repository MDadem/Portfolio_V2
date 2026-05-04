import { useRef, useEffect, useState } from 'react';

const Navbar = () => {
    const btnRef = useRef(null);
    const navRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;

        const handleMouseMove = (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        };

        const handleMouseLeave = () => {
            btn.style.transform = 'translate(0px, 0px)';
        };

        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            btn.removeEventListener('mousemove', handleMouseMove);
            btn.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <nav
            ref={navRef}
            className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        >
            {/* Logo */}
            <div className="nav-logo">
                <span className="nav-logo-primary">AD</span>
                <span className="nav-logo-secondary">.dev</span>
            </div>

            {/* Nav Links */}
            <div className="nav-links">
                <a href="#work" className="nav-link">
                    <span className="nav-link-text">Work</span>
                </a>
                <a href="#thinking" className="nav-link">
                    <span className="nav-link-text">Thinking</span>
                </a>
                <a href="#about" className="nav-link">
                    <span className="nav-link-text">About</span>
                </a>
            </div>

            {/* CTA Button */}
            <a
                ref={btnRef}
                href="https://www.linkedin.com/in/miladi-adem/"
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-btn nav-cta"
                style={{ textDecoration: 'none' }}
            >
                <span className="nav-cta-glow" />
                <span className="nav-cta-text">Let's Talk</span>
            </a>
        </nav>
    );
};

export default Navbar;
