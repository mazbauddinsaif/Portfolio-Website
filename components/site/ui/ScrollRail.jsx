'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

/* Scroll-driven horizontal rail. The section pins to the viewport and the row of
   cards translates sideways as the page scrolls through it, so the motion comes
   from the normal wheel / trackpad rather than a sideways drag.

   Below md — and whenever the visitor asks for reduced motion — it degrades to a
   plain swipeable overflow row, which is what a touch screen wants anyway.

   Progress is read straight off getBoundingClientRect in a scroll listener rather
   than motion's useScroll: useScroll wants its target hydrated before it measures,
   which it isn't on a server-rendered page, and it throws when the section is
   conditionally pinned. */
export default function ScrollRail({ children, label = 'Items', className = '' }) {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const reduce = useReducedMotion();

  // How far the row must travel for its last card to reach the right edge.
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);
  const distanceRef = useRef(0);

  const xRaw = useMotionValue(0);
  // The spring is what makes it glide instead of stepping with each wheel tick.
  const x = useSpring(xRaw, { stiffness: 90, damping: 22, mass: 0.35 });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const wide = window.matchMedia('(min-width: 768px)').matches;
    /* Travel is measured against the window the track sits in — the section's
       max-width container, not the viewport — or the last card stops short. */
    const viewport =
      viewportRef.current?.clientWidth || track.parentElement?.clientWidth || window.innerWidth;
    const travel = Math.max(0, track.scrollWidth - viewport + 24);
    distanceRef.current = travel;
    setDistance(travel);
    setPinned(wide && !reduce && travel > 0);
  }, [reduce]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    // Card images change the track width as they load in.
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [measure]);

  useEffect(() => {
    if (!pinned) {
      xRaw.set(0);
      return;
    }
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      xRaw.set(-progress * distanceRef.current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pinned, xRaw]);

  return (
    <div
      ref={sectionRef}
      className={className}
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      {pinned ? (
        <div
          ref={viewportRef}
          className="sticky top-16 flex h-[calc(100svh-4rem)] items-center overflow-hidden"
        >
          <motion.div
            ref={trackRef}
            role="region"
            aria-label={label}
            style={{ x }}
            className="flex gap-6 will-change-transform"
          >
            {children}
          </motion.div>
        </div>
      ) : (
        <div
          ref={trackRef}
          role="region"
          aria-label={label}
          tabIndex={0}
          className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
        >
          {children}
        </div>
      )}
    </div>
  );
}
