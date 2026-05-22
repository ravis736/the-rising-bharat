import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.to('.preloader', {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          setHidden(true);
          if (onComplete) onComplete();
        },
      });
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div className="preloader">
      <div className="preloader-content">
        <div className="preloader-logo">The Rising Bharat</div>
        <div className="loader-bar">
          <div className="loader-bar-inner" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
