import { useEffect, useRef } from 'react';
import { LayoutGrid, Layers, Zap, BarChart3 } from 'lucide-react';

const approaches = [
    {
        title: 'Structure First',
        Icon: LayoutGrid,
        color: '#6E5CFF',
        bgColor: 'rgba(110, 92, 255, 0.2)',
        content: [
            'Information architecture and user flow precede visual design.',
            'Clear hierarchy reduces cognitive load and increases task completion.',
            'Structure is the foundation of scalable product design.',
        ],
    },
    {
        title: 'Systems Over Screens',
        Icon: Layers,
        color: '#A3FF12',
        bgColor: 'rgba(163, 255, 18, 0.2)',
        content: [
            'I design component libraries, not isolated mockups.',
            'Reusable patterns reduce design and engineering time.',
            'Systems thinking enables teams to ship faster with consistency.',
        ],
    },
    {
        title: 'Motion With Purpose',
        Icon: Zap,
        color: '#8171FF',
        bgColor: 'rgba(129, 113, 255, 0.2)',
        content: [
            'Animation communicates state, hierarchy, and feedback.',
            'Every transition should reduce confusion, not add decoration.',
            'Motion is a design tool, not an afterthought.',
        ],
    },
    {
        title: 'Measure Everything',
        Icon: BarChart3,
        color: '#B4FF40',
        bgColor: 'rgba(180, 255, 64, 0.2)',
        content: [
            'Design decisions should be validated with user behavior data.',
            'Metrics like activation, retention, and conversion guide iteration.',
            'Impact matters more than aesthetics.',
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
