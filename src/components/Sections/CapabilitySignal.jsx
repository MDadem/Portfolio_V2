import { useEffect, useRef } from 'react';

const CapabilitySignal = () => {
    const itemsRef = useRef([]);

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
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        itemsRef.current.forEach((item) => {
            if (item) observer.observe(item);
        });

        return () => observer.disconnect();
    }, []);

    const capabilities = [
        { title: 'Product Design (0 → 1 & Scaling)', desc: 'End-to-end product design from concept to production-ready systems.', dotColor: '#6E5CFF' },
        { title: 'Motion Systems for Digital Products', desc: 'Interaction design and motion language that communicates intent.', dotColor: '#A3FF12' },
        { title: 'Growth-Focused UX Strategy', desc: 'Design decisions driven by activation, retention, and conversion metrics.', dotColor: '#8171FF' },
        { title: 'Design Systems & Interaction Architecture', desc: 'Scalable component libraries and interaction patterns that reduce design debt.', dotColor: '#B4FF40' },
    ];

    return (
        <section className="capability-section">
            <div className="container-6xl">
                <div className="grid-12">
                    <div className="col-span-4">
                        <h3 className="capability-heading">What I Do</h3>
                        <div className="capability-line" />
                    </div>
                    <div className="col-span-8">
                        <div className="capability-grid">
                            {capabilities.map((cap, index) => (
                                <div
                                    key={index}
                                    ref={(el) => (itemsRef.current[index] = el)}
                                    className="capability-item"
                                    style={{ transitionDelay: `${index * 0.1}s` }}
                                >
                                    <div className="capability-item-inner">
                                        <div className="capability-dot" style={{ background: cap.dotColor }} />
                                        <div>
                                            <h4 className="capability-title">{cap.title}</h4>
                                            <p className="capability-desc">{cap.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CapabilitySignal;
