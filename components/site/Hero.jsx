'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { FiArrowDown, FiPlay } from 'react-icons/fi';
import StatCounter from './ui/StatCounter';

/* Years of experience = earliest year found in resume.experience periods → now. */
function firstSentence(text) {
  if (!text) return '';
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const m = plain.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : plain).trim();
}

export default function Hero({ sidebar, about }) {
  const reduce = useReducedMotion();

  // "Junior Software Developer | Instructor" → stacked display lines.
  const titleWords = (sidebar?.title || 'Software Developer').split('|')[0].trim().split(' ');
  const intro = firstSentence(about?.paragraphs?.[0]) || `Hi, I'm ${sidebar?.name?.split(' ')[0] || 'a developer'} — I build web products.`;

  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
        };

  // Each title word rises out of a clipping mask with a slight blur, staggered.
  const word = (i) =>
    reduce
      ? {}
      : {
          initial: { y: '100%', opacity: 0, filter: 'blur(6px)' },
          animate: { y: 0, opacity: 1, filter: 'blur(0px)' },
          transition: { duration: 0.7, delay: 0.1 + i * 0.14, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section
      id="hero"
      className="print-hide relative flex min-h-svh flex-col justify-center overflow-hidden pt-16"
    >
      {/* Oversized watermark of the first name, pinned to the bottom edge. */}
      <div
        aria-hidden="true"
        className="display pointer-events-none absolute -bottom-4 left-0 w-full text-center text-[22vw] leading-none text-ink opacity-[0.04] select-none"
      >
        {(sidebar?.name || 'PORTFOLIO').split(' ')[0]}
      </div>

      {/* Sideways email rail, tajmirul-style (desktop only). */}
      {sidebar?.email && (
        <a
          href={`mailto:${sidebar.email}`}
          className="absolute left-5 bottom-1/2 hidden translate-y-1/2 text-[0.6875rem] tracking-[0.18em] text-ink-faint transition-colors hover:text-accent-text xl:block"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {sidebar.email}
        </a>
      )}

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 content-center gap-12 px-5 pt-4 pb-10 md:px-10 lg:grid-cols-[1.7fr_auto] lg:items-center lg:gap-20">
        <div>
          <h1 className="display text-[15vw] leading-[0.92] sm:text-[11.5vw] lg:text-[7rem]">
            {titleWords.map((w, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  {...word(i)}
                  className={`block ${i === 0 ? 'text-accent-text' : ''}`}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div {...rise(0.55)} className="mt-9 max-w-lg">
            <p className="text-[0.9375rem] leading-relaxed text-ink-muted sm:text-base">{intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/play" className="btn-accent" data-track-click="hero_play_with_me">
                <FiPlay size={13} /> Play With Me
              </Link>
              <a href="#projects" className="btn-ghost" data-track-click="hero_see_work">
                See Work <FiArrowDown size={13} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Stats stacked vertically, right-aligned — tajmirul-style. */}
        <motion.div
          {...rise(0.7)}
          className="flex flex-row flex-wrap items-end justify-end gap-x-12 gap-y-8 text-right lg:flex-col lg:items-end lg:gap-11"
        >
          <StatCounter value={4} label="Industry Projects" align="right" />
          <StatCounter value={8} label="Personal Projects" align="right" />
          <StatCounter value={50} label="Achievements" align="right" />
        </motion.div>
      </div>
    </section>
  );
}
