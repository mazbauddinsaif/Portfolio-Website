'use client';

import { useState } from 'react';

/* Josh Comeau-style "boop": a playful springy nudge on hover. */
export default function Boop({ children, rotation = 0, scale = 1.08, y = 0, timing = 200 }) {
  const [active, setActive] = useState(false);

  const style = {
    transform: active
      ? `translateY(${y}px) rotate(${rotation}deg) scale(${scale})`
      : 'translateY(0) rotate(0) scale(1)',
    transition: `transform ${timing}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
  };

  return (
    <span
      className="boop"
      style={style}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {children}
    </span>
  );
}
