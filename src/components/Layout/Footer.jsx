import { useEffect, useState, useRef } from 'react';
import CvModal from '../CvModal/CvModal';
import { trackEvent } from '../../tracker/TrackingProvider';

const Footer = () => {
    const [time, setTime] = useState('--:-- PST');
    const [cvOpen, setCvOpen] = useState(false);
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
        const cleanups = [];
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

            cleanups.push(() => {
                btn.removeEventListener('mousemove', handleMouseMove);
                btn.removeEventListener('mouseleave', handleMouseLeave);
            });
        });

        return () => cleanups.forEach((fn) => fn());
    }, []);

    return (
        <section id="about" className="footer-section">
            {/* Top gradient line */}
            <div className="footer-top-line" />

            <div className="container-5xl footer-content">
                {/* CTA Heading */}
                <h2 className="footer-heading">
                    Let's create <br />
                    <span className="gradient-primary-secondary">something extraordinary.</span>
                </h2>

                {/* CTA Buttons */}
                <div className="footer-cta-group">
                    <a
                        ref={(el) => (magneticRefs.current[0] = el)}
                        href="mailto:miladiadem58@gmail.com"
                        className="magnetic-btn footer-cta-primary"
                        onClick={() => trackEvent('email_clicked', { email: 'miladiadem58@gmail.com' })}
                    >
                        @Adem_Miladi
                    </a>
                    <button
                        ref={(el) => (magneticRefs.current[1] = el)}
                        onClick={() => {
                            trackEvent('cv_downloaded', { fileType: 'pdf', source: 'footer_button' });
                            const a = document.createElement('a');
                            a.href = '/Adem_cv_final.pdf';
                            a.download = 'Adem_Miladi_CV.pdf';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }}
                        className="magnetic-btn footer-cta-secondary"
                    >
                        Download CV
                    </button>
                    <button
                        ref={(el) => (magneticRefs.current[2] = el)}
                        onClick={() => setCvOpen(true)}
                        className="magnetic-btn footer-cta-secondary"
                    >
                        View CV
                    </button>
                </div>

                {/* Footer Grid */}
                <div className="footer-grid">
                    <div>
                        <h4 className="footer-grid-label">Socials</h4>
                        <ul className="footer-grid-list">
                            <li><a href="https://github.com/MDadem" className="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                            <li><a href="https://www.linkedin.com/in/miladi-adem/" className="footer-link" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            <li><a href="https://www.instagram.com/adem.miladi/" className="footer-link" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                            <li><a href="https://www.facebook.com/adem.miladi.79" className="footer-link" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="footer-grid-label">Services</h4>
                        <ul className="footer-grid-list">
                            <li>Frontend Development</li>
                            <li>React & Next.js Applications</li>
                            <li>Responsive Web Design</li>
                            <li>UI Implementation from Figma</li>
                            <li>Performance Optimization</li>
                            <li>Interactive Animations (GSAP / Framer Motion)</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="footer-grid-label">Location</h4>
                        <p className="footer-grid-text">
                            Tunis, Tunisia<br />
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
                    <span>© 2025 Adem Miladi.</span>
                    <span>All Rights Reserved.</span>
                </div>
            </div>

            <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />

            {/* Background blob */}
            <div className="footer-blob" />
        </section>
    );
};

export default Footer;
