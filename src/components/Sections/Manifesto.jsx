import { useEffect, useRef } from 'react';

const items = [
    { text: 'Design is decision-making', highlight: 'under constraint.', color: '#525252' },
    { text: 'Speed without structure', highlight: 'creates debt.', color: '#6E5CFF' },
    { text: 'Motion is communication,', highlight: 'not decoration.', color: '#A3FF12' },
    { text: 'Systems scale.', highlight: "Screens don't.", color: '#E5E5E5' },
    { text: 'Clarity', highlight: 'reduces cost.', color: '#8171FF' },
];

const Manifesto = () => {
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
            if (item) {
                item.style.transform = 'translateY(20px)';
                observer.observe(item);
            }
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section id="thinking" className="manifesto-section">
            <div className="container-6xl">
                <div className="grid-12">
                    <div className="col-span-4">
                        <span className="section-label" style={{ color: '#6E5CFF' }}>01 / Principles</span>
                        <div className="manifesto-line" />
                    </div>
                    <div className="col-span-8 manifesto-items">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                ref={(el) => (itemsRef.current[index] = el)}
                                className="manifesto-item"
                            >
                                <h2 className="manifesto-heading">
                                    {item.text} <br />
                                    <span style={{ color: item.color }}>{item.highlight}</span>
                                </h2>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Manifesto;
