import { useEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';

const differentiators = [
    {
        text: "I've shipped production products, not just prototypes.",
        color: '#6E5CFF',
        bgColor: 'rgba(110, 92, 255, 0.1)',
    },
    {
        text: 'I understand product constraints, not just UI polish.',
        color: '#A3FF12',
        bgColor: 'rgba(163, 255, 18, 0.1)',
    },
    {
        text: 'I work comfortably inside engineering realities.',
        color: '#8171FF',
        bgColor: 'rgba(129, 113, 255, 0.1)',
    },
    {
        text: 'I optimize for business impact, not Dribbble likes.',
        color: '#B4FF40',
        bgColor: 'rgba(180, 255, 64, 0.1)',
    },
];

const Differentiation = () => {
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

    return (
        <section className="diff-section">
            <div className="container-5xl">
                <div className="diff-header">
                    <span className="section-label" style={{ color: '#A3FF12' }}>04 / Differentiation</span>
                    <h2 className="section-title">Why I'm <span className="text-stroke">Different</span></h2>
                </div>

                <div className="grid-2">
                    {differentiators.map((item, index) => (
                        <div
                            key={index}
                            ref={(el) => (itemsRef.current[index] = el)}
                            className="diff-item"
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                            <div className="diff-item-inner">
                                <div className="diff-icon" style={{ background: item.bgColor }}>
                                    <CheckCircle size={20} color={item.color} />
                                </div>
                                <div>
                                    <p className="diff-text">{item.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Differentiation;
