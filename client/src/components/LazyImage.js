import React, { useState, useRef, useEffect } from "react";
import getImageUrl from "../utils/imageUrl";

const LazyImage = ({ src, alt, className, style, fallback = "" }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const resolvedSrc = getImageUrl(src);

  useEffect(() => {
    setLoaded(false);
    setError(false);

    if (!resolvedSrc) {
      setLoaded(true);
      setError(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = resolvedSrc;
          img.onload = () => setLoaded(true);
          img.onerror = () => {
            setLoaded(true);
            setError(true);
          };
          observerRef.current.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [resolvedSrc]);

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        ...style,
        background: !loaded ? "var(--border-color)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {loaded && !error && (
        <img
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
       )}
       {loaded && error && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--border-color)",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
          }}
        >
          {fallback || "Image"}
        </div>
      )}
    </div>
  );
};

export default LazyImage;
