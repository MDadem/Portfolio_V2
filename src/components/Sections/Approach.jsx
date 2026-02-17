import { useEffect, useRef } from 'react';
import { LayoutGrid, Layers, Zap, BarChart3 } from 'lucide-react';
const approaches = [
    {
        title: 'Architecture First',
        Icon: LayoutGrid,
        color: '#6E5CFF',
        bgColor: 'rgba(110, 92, 255, 0.2)',
        content: [
            'Component structure and state management come before styling.',
            'Clean architecture prevents technical debt as the product grows.',
            'Scalability is designed, not added later.',
        ],
    },
    {
        title: 'Systems Over Pages',
        Icon: Layers,
        color: '#A3FF12',
        bgColor: 'rgba(163, 255, 18, 0.2)',
        content: [
            'I build reusable component systems, not one-off screens.',
            'Consistent design tokens and patterns improve maintainability.',
            'Strong systems allow teams to move faster with fewer bugs.',
        ],
    },
    {
        title: 'Performance With Purpose',
        Icon: Zap,
        color: '#8171FF',
        bgColor: 'rgba(129, 113, 255, 0.2)',
        content: [
            'Performance is part of the user experience.',
            'Optimized rendering, lazy loading, and clean bundles matter.',
            'Animations enhance clarity — never block interaction.',
        ],
    },
    {
        title: 'Measure & Iterate',
        Icon: BarChart3,
        color: '#B4FF40',
        bgColor: 'rgba(180, 255, 64, 0.2)',
        content: [
            'Frontend decisions should align with product metrics.',
            'User behavior informs improvements and refactoring.',
            'Impact and maintainability matter more than hype.',
        ],
    },
];

const Approach = () => {
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
        <section className="approach-section">
            <div className="container-6xl">
                <div className="section-header" style={{ marginBottom: '80px' }}>
                    <span className="section-label" style={{ color: '#A3FF12' }}>02 / Approach</span>
                    <h2 className="section-title">How I <span className="text-stroke">Think</span></h2>
                </div>

                <div className="grid-2">
                    {approaches.map((item, index) => (
                        <div
                            key={index}
                            ref={(el) => (itemsRef.current[index] = el)}
                            className="thinking-pillar"
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                            <div className="pillar-header">
                                <div className="pillar-icon" style={{ background: item.bgColor }}>
                                    <item.Icon size={16} color={item.color} />
                                </div>
                                <h3 className="pillar-title">{item.title}</h3>
                            </div>
                            {item.content.map((text, i) => (
                                <p key={i} className="pillar-text">{text}</p>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Approach;
