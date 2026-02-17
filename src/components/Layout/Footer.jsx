import { useEffect, useState, useRef } from 'react';

const Footer = () => {
    const [time, setTime] = useState('--:-- PST');
    const magneticRefs = useRef([]);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short',
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        magneticRefs.current.forEach((btn) => {
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
        });
    }, []);

    return (
        <section id="about" className="footer-section">
            {/* Top gradient line */}
            <div className="footer-top-line" />

            <div className="container-5xl footer-content">
                {/* CTA Heading */}
                <h2 className="footer-heading">
                    Let's build <br />
                    <span className="gradient-primary-secondary">scalable systems.</span>
                </h2>

                {/* CTA Buttons */}
                <div className="footer-cta-group">
                    <a
                        ref={(el) => (magneticRefs.current[0] = el)}
                        href="mailto:hello@alex.design"
                        className="magnetic-btn footer-cta-primary"
                    >
                        hello@alex.design
                    </a>
                    <a
                        ref={(el) => (magneticRefs.current[1] = el)}
                        href="#"
                        className="magnetic-btn footer-cta-secondary"
                    >
                        Download CV
                    </a>
                </div>

                {/* Footer Grid */}
                <div className="footer-grid">
                    <div>
                        <h4 className="footer-grid-label">Socials</h4>
                        <ul className="footer-grid-list">
                            <li><a href="#" className="footer-link">Twitter / X</a></li>
                            <li><a href="#" className="footer-link">LinkedIn</a></li>
                            <li><a href="#" className="footer-link">Instagram</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="footer-grid-label">Services</h4>
                        <ul className="footer-grid-list">
                            <li>Product Design</li>
                            <li>Design Systems</li>
                            <li>Motion Direction</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="footer-grid-label">Location</h4>
                        <p className="footer-grid-text">
                            San Francisco, CA<br />
                            Remote Available
                        </p>
                    </div>
                    <div>
                        <h4 className="footer-grid-label">Time</h4>
                        <p className="footer-grid-text">{time}</p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-copyright">
                    <span>© 2024 Alex Design.</span>
                    <span>All Rights Reserved.</span>
                </div>
            </div>

            {/* Background blob */}
            <div className="footer-blob" />
        </section>
    );
};

export default Footer;
