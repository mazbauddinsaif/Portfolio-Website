'use client';
import { useEffect, useRef, useState } from 'react';
import SafeImage from './ui/SafeImage';
import { decodeEntities } from './ui/text';

const RADIUS = 400;       // distance of each thumb from the ring's centre (px)
const TILT = -9;          // degrees — how much the ring leans back to form the oval
const ROTATE_SPEED = 6;   // degrees per second

export default function AchievementsRing({ certs, onOpen }) {
  const [rotation, setRotation] = useState(0);
  const [hovered, setHovered] = useState(null);
  const pausedRef = useRef(false);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);

  const angleStep = 360 / certs.length;

  useEffect(() => {
    const tick = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      if (!pausedRef.current) {
        setRotation((r) => (r + ROTATE_SPEED * dt) % 360);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; setHovered(null); };

  return (
    <div
      className="relative mx-auto h-[420px] max-w-5xl overflow-hidden sm:h-[480px]"
      style={{ perspective: '1400px', perspectiveOrigin: '50% 30%' }}
    >
      {/* static tilt — turns the vertical ring into the oval you see from above */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d', transform: `rotateX(${TILT}deg)` }}
      >
        {/* rotating ring */}
        <div
          className="relative"
          style={{ transformStyle: 'preserve-3d', transform: `rotateY(${rotation}deg)` }}
        >
          {certs.map((cert, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => { pause(); setHovered(cert); }}
              onMouseLeave={resume}
              onFocus={() => { pause(); setHovered(cert); }}
              onBlur={resume}
              onClick={() => onOpen(cert)}
              className="absolute left-1/2 top-1/2 h-14 w-9 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-line bg-bg-2 shadow-md transition hover:brightness-110 sm:h-20 sm:w-12"
              style={{
  transform: `rotateY(${i * angleStep}deg) translateZ(${RADIUS}px) rotateX(${-TILT}deg)`,
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
}}
            >
              <SafeImage
                src={cert.img}
                alt={cert.cardTitle}
                width={120}
                height={200}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* centre preview card, shown while a thumb is hovered/focused */}
      <div
        className={`pointer-events-none absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {hovered && (
          <div
            className="pointer-events-auto w-56 cursor-pointer sm:w-72"
            onMouseEnter={pause}
            onMouseLeave={resume}
            onClick={() => onOpen(hovered)}
          >
            <div className="aspect-[4/3] overflow-hidden rounded border border-line bg-bg-2 shadow-xl">
              <SafeImage
                src={hovered.img}
                alt={hovered.cardTitle}
                width={640}
                height={480}
                className="size-full object-cover"
              />
            </div>
            <h4 className="mt-3 text-center text-sm font-semibold">
              {decodeEntities(hovered.cardTitle)}
            </h4>
            <p className="mt-0.5 text-center text-xs text-ink-muted">
              {decodeEntities(hovered.cardIssuer)}
            </p>
            <p className="mt-1 text-center text-[0.6875rem] tracking-wider text-accent-text uppercase">
              Click to enlarge +
            </p>
          </div>
        )}
      </div>
    </div>
  );
}