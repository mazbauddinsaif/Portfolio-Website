'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/* Counts 0 → value the first time the stat scrolls into view. */
export default function StatCounter({ value, suffix = '+', label, align = 'left' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      // prefers-reduced-motion is client-only, so the count has to be
      // corrected after mount; a lazy initialiser would break hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf;
    let timeout;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // rAF is throttled/paused in hidden tabs — snap instead of animating.
        if (document.hidden) {
          setDisplay(value);
          return;
        }
        const start = performance.now();
        const dur = 1200;
        const tick = (now) => {
          const t = Math.min((now - start) / dur, 1);
          // ease-out cubic
          setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    // Safety nets: land on the real value even if the tab loaded hidden
    // (rAF paused, IO silent, timers throttled) and was revealed later.
    const onVisible = () => {
      if (!document.hidden) setDisplay((d) => (d === 0 ? value : d));
    };
    document.addEventListener('visibilitychange', onVisible);
    timeout = setTimeout(() => setDisplay(value), 2500);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [value, reduce]);

  const right = align === 'right';
  return (
    <div ref={ref} className={right ? 'text-right' : ''}>
      <p className="display text-4xl text-accent-text sm:text-5xl">
        {display.toLocaleString()}
        {suffix}
      </p>
      <p
        className={`mt-2 max-w-36 text-xs leading-relaxed text-ink-muted uppercase tracking-wider ${
          right ? 'ml-auto' : ''
        }`}
      >
        {label}
      </p>
    </div>
  );
}
