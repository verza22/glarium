import React, { useRef, useState, useEffect } from 'react';

interface DragToScrollProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  centerVertical?: boolean;
}

const DragToScroll: React.FC<DragToScrollProps> = ({ children, className, style, centerVertical = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // --- Center the scroll when mounted ---
  useEffect(() => {
    if (ref.current) {
      const el = ref.current;
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      if(centerVertical)
        el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
    }
  }, []);

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