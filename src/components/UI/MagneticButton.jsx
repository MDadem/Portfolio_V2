import { useRef, useEffect } from 'react';

const MagneticButton = ({ children, className = '', ...props }) => {
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const handleMouseMove = (e) => {
            const rect = node.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            node.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        };

        const handleMouseLeave = () => {
            node.style.transform = 'translate(0px, 0px)';
        };

        node.addEventListener('mousemove', handleMouseMove);
        node.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            node.removeEventListener('mousemove', handleMouseMove);
            node.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div ref={ref} className={`magnetic-btn ${className}`} {...props}>
            {children}
        </div>
    );
};

export default MagneticButton;
