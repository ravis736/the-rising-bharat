import React, { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const addHover = () => cursor.classList.add('hover');
    const removeHover = () => cursor.classList.remove('hover');

    document.addEventListener('mousemove', moveCursor);
    document.querySelectorAll('a, button, input, textarea, select, .card, .sidebar-category').forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return <div className="custom-cursor" />;
};

export default CustomCursor;
