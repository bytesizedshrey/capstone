// Resizable panel divider
import { useRef, useCallback } from 'react';

export function ResizableDivider({ onResize, orientation = 'vertical' }) {
  const isDragging = useRef(false);
  const lastPos = useRef(0);

  const handleMouseDown = useCallback((e) => {
    isDragging.current = true;
    lastPos.current = orientation === 'vertical' ? e.clientX : e.clientY;
    document.body.style.cursor = orientation === 'vertical' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const currentPos = orientation === 'vertical' ? e.clientX : e.clientY;
      const delta = currentPos - lastPos.current;
      lastPos.current = currentPos;
      onResize(delta);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [onResize, orientation]);

  if (orientation === 'vertical') {
    return (
      <div
        onMouseDown={handleMouseDown}
        className="w-1.5 bg-black cursor-col-resize hover:bg-[#ffdd57] shrink-0 transition-colors"
        title="Drag to resize"
      />
    );
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      className="h-1.5 bg-black cursor-row-resize hover:bg-[#ffdd57] shrink-0 transition-colors"
      title="Drag to resize"
    />
  );
}
