'use client';
import { motion, useReducedMotion } from 'motion/react';
import { FiArrowDown } from 'react-icons/fi';
import StatCounter from './ui/StatCounter';

/* Years of experience = earliest year found in resume.experience periods → now. */
function deriveYears(experience) {
  const years = (experience || [])
    .flatMap((org) => [org.period, ...(org.roles || []).map((r) => r.period)])
    .flatMap((p) => String(p || '').match(/\d{4}/g) || [])
    .map(Number);
  if (!years.length) return 1;
  return Math.max(1, new Date().getFullYear() - Math.min(...years));
}

function firstSentence(text) {
  if (!text) return '';
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const m = plain.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : plain).trim();
}

export default function Hero({ sidebar, about, contact, resume, portfolio, achievements }) {
  const reduce = useReducedMotion();
  const years = deriveYears(resume?.experience);
  const projectCount = Math.max(portfolio?.projects?.length || 0, 5);
  const certCount = (achievements || []).reduce((s, c) => s + (c.certs?.length || 0), 0);

  // "Junior Software Developer | Instructor" → two display lines.
  const titleWords = (sidebar?.title || 'Software Developer').split('|')[0].trim();
  const intro = firstSentence(about?.paragraphs?.[0]);

  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
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

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 content-center gap-16 px-5 pt-6 pb-12 md:px-10 lg:grid-cols-[1.7fr_auto] lg:items-end">
        <div className="lg:pb-6">
          <motion.h1
            {...rise(0.08)}
            className="display text-[15vw] leading-[0.9] sm:text-[11.5vw] lg:text-[7.25rem]"
          >
            {titleWords.split(' ').map((w, i, arr) => (
              <span key={i} className={i === 0 ? 'block text-accent-text' : 'block'}>
                {w}
              </span>
            ))}
          </motion.h1>

          <motion.div {...rise(0.16)} className="mt-10 max-w-xl">
            <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
              {intro || `Hi, I'm ${sidebar?.name?.split(' ')[0] || 'a developer'} — I build web products.`}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#contact" className="btn-accent" data-track-click="hero_lets_talk">
                Let&apos;s Talk
              </a>
              <a href="#projects" className="btn-ghost" data-track-click="hero_see_work">
                See Work <FiArrowDown size={13} />
              </a>
            </div>

          </motion.div>
        </div>

        {/* Stats stacked vertically, pinned bottom-right — tajmirul-style. */}
        <motion.div
          {...rise(0.24)}
          className="flex flex-row flex-wrap items-end justify-end gap-x-12 gap-y-8 text-right lg:flex-col lg:gap-10 lg:pb-6"
        >
          <StatCounter value={years} label="Years of Experience" align="right" />
          <StatCounter value={projectCount} label="Completed Projects" align="right" />
          <StatCounter value={certCount} label="Certificates Earned" align="right" />
        </motion.div>
      </div>
    </section>
  );
}
