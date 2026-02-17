import { useRef, useEffect } from 'react';

const Navbar = () => {
    const btnRef = useRef(null);

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
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 40,
                padding: '24px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mixBlendMode: 'difference',
            }}
            className="navbar"
        >
            {/* Logo */}
            <div
                style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '20px',
                    letterSpacing: '-0.02em',
                }}
            >
                <span style={{ color: '#E5E5E5' }}>ADEM</span>
                <span style={{ color: '#525252' }}>.MILADI</span>
            </div>

            {/* Nav Links */}
            <div className="nav-links">
                <a href="#work">Work</a>
                <a href="#thinking">Thinking</a>
                <a href="#about">About</a>
            </div>

            {/* CTA Button → LinkedIn */}
            <a
                ref={btnRef}
                href="https://www.linkedin.com/in/miladi-adem/"
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-btn nav-cta group"
                style={{ textDecoration: 'none' }}
            >

                <span className="nav-cta-text">Let's Talk</span>
                <div className="nav-cta-fill" />
            </a>
        </nav>

    );
};

export default Navbar;
