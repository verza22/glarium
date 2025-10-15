import React, { useRef, useState, useEffect } from 'react';

interface DragToScrollProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    x?: number; // initial scrollLeft
    y?: number; // initial scrollTop
    centerVertical?: boolean; // optionally center vertically
}

const DragToScroll: React.FC<DragToScrollProps> = ({
    children,
    className,
    style,
    x = 0,
    y = 0,
    centerVertical = false,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    // --- Set initial scroll position on mount or when x/y change ---
    useEffect(() => {
        setTimeout(() => {
            if (ref.current) {
                const el = ref.current;
                el.scrollLeft = x === 0 ? ((el.scrollWidth - el.clientWidth) / 2) : x;
                if(centerVertical || y >0)
                    el.scrollTop = centerVertical ? ((el.scrollHeight - el.clientHeight) / 2) : y;

            }
        }, 100)
    }, [x, y, centerVertical]);

    // --- Mouse events ---
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        setIsDragging(true);
        setStartX(e.clientX);
        setStartY(e.clientY);
        setScrollLeft(ref.current.scrollLeft);
        setScrollTop(ref.current.scrollTop);
    };

    const handleMouseUpOrLeave = () => setIsDragging(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !ref.current) return;
        e.preventDefault();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        ref.current.scrollLeft = scrollLeft - dx;
        ref.current.scrollTop = scrollTop - dy;
    };

    // --- Touch events ---
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setStartY(e.touches[0].clientY);
        setScrollLeft(ref.current.scrollLeft);
        setScrollTop(ref.current.scrollTop);
    };

    const handleTouchEnd = () => setIsDragging(false);

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging || !ref.current) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        ref.current.scrollLeft = scrollLeft - dx;
        ref.current.scrollTop = scrollTop - dy;
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                overflow: 'auto',
                width: '100%',
                height: '100%',
                touchAction: 'none',
                ...style,
            }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUpOrLeave}
            onMouseUp={handleMouseUpOrLeave}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
        >
            {children}
        </div>
    );
};

export default DragToScroll;