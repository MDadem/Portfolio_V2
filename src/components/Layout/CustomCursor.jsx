import { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const dotRef = useRef(null);
    const outlineRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const dot = dotRef.current;
        const outline = outlineRef.current;
        const glow = glowRef.current;
        if (!dot || !outline || !glow) return;

        let isHovering = false;

        const handleMouseMove = (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            dot.style.left = `${posX}px`;
            dot.style.top = `${posY}px`;

            outline.animate(
                { left: `${posX}px`, top: `${posY}px` },
                { duration: 400, fill: 'forwards' }
            );

            glow.animate(
                { left: `${posX}px`, top: `${posY}px` },
                { duration: 800, fill: 'forwards' }
            );
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                if (!isHovering) {
                    isHovering = true;
                    outline.style.width = '60px';
                    outline.style.height = '60px';
                    outline.style.borderColor = 'rgba(110, 92, 255, 0.8)';
                    dot.style.transform = 'translate(-50%, -50%) scale(0)';
                    glow.style.opacity = '0.6';
                }
            }
        };

        const handleMouseOut = () => {
            if (isHovering) {
                isHovering = false;
                outline.style.width = '40px';
                outline.style.height = '40px';
                outline.style.borderColor = 'rgba(163, 255, 18, 0.5)';
                dot.style.transform = 'translate(-50%, -50%) scale(1)';
                glow.style.opacity = '0.3';
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" />
            <div ref={outlineRef} className="cursor-outline" />
            <div ref={glowRef} className="cursor-glow" />
        </>
    );
};

export default CustomCursor;
