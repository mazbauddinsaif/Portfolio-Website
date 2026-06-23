'use client';

import { useEffect, useRef, useState } from 'react';

/* Fade + rise into view on scroll. Respects prefers-reduced-motion via CSS.
   Safety net: content is force-revealed after a short timeout so it can never
   stay permanently hidden if the observer misfires. */
export default function Reveal({ children, as: Tag = 'div', delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );
    obs.observe(el);

    // Reveal immediately if already in the viewport on mount.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) setVisible(true);

    // Safety net: never leave content hidden.
    const failSafe = setTimeout(() => setVisible(true), 1500);

    return () => {
      obs.disconnect();
      clearTimeout(failSafe);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
