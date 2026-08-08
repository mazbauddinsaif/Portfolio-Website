'use client';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/* Types text character-by-character with a blinking caret.
   Reduced motion (or done) → full text, no caret churn. */
export default function Typewriter({ text, speed = 18, startDelay = 400, className = '' }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? text.length : 0);

  useEffect(() => {
    if (reduce) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    let interval;
    const kickoff = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(kickoff);
      clearInterval(interval);
    };
  }, [text, speed, startDelay, reduce]);

  const done = count >= text.length;

  return (
    <span className={className} aria-label={text}>
      {text.slice(0, count)}
      {!done && (
        <span aria-hidden="true" className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] animate-pulse bg-accent-text" />
      )}
    </span>
  );
}
