import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed', bottom: '30px', right: '30px',
        width: '50px', height: '50px', borderRadius: '50%',
        background: 'var(--accent)', color: '#fff', border: 'none',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1.2rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: 999, fontFamily: 'var(--font-family)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.5)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      aria-label="Back to top"
    >
      <FiArrowUp />
    </button>
  );
};

export default BackToTop;
