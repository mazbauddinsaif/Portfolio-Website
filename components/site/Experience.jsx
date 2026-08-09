'use client';
import { useRef } from 'react';
import { motion, useScroll, useReducedMotion } from 'motion/react';
import { FiDownload } from 'react-icons/fi';
import Section from './ui/Section';
import Reveal from './ui/Reveal';
import SafeImage from './ui/SafeImage';
import { decodeEntities } from './ui/text';

/* Big right-hand label per company: "NOW" while ongoing, otherwise the
   latest year found in its period ("2019 — 2024" → 2024). */
function yearLabel(orgPeriod, roles) {
  for (const p of [orgPeriod, ...(roles || []).map((r) => r.period)]) {
    const str = String(p || '');
    if (/present|now|current/i.test(str)) return 'NOW';
    const years = str.match(/\d{4}/g);
    if (years) return years[years.length - 1];
  }
  return '';
}

export default function Experience({ experience, sidebar, showDownloadPDF = true }) {
  const listRef = useRef(null);
  const reduce = useReducedMotion();
  // Line grows as the timeline scrolls through the viewport.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.75', 'end 0.45'],
  });

  if (!experience?.length) return null;

  return (
    <>
      {sidebar && (
        <div className="print-only print-header">
          <p className="print-name">{sidebar.name}</p>
          <p className="print-title">{sidebar.title}</p>
          <div className="print-contact">
            <span>{sidebar.email}</span>
            <span>·</span>
            <span>{sidebar.phoneDisplay}</span>
            <span>·</span>
            <span>{sidebar.location}</span>
          </div>
        </div>
      )}

      <Section
        id="experience"
        title="My Experience"
        eyebrow="Career"
        printSection
        aside={showDownloadPDF === false ? null : (
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-ghost print-hide"
            data-track-click="download_resume_pdf"
          >
            <FiDownload size={13} /> Resume PDF
          </button>
        )}
      >
        <div ref={listRef} className="relative">
          {/* Timeline spine: static hairline + accent line that grows with scroll. */}
          <div className="print-hide absolute top-0 bottom-0 left-0 w-px bg-line" aria-hidden="true" />
          <motion.div
            aria-hidden="true"
            className="print-hide absolute top-0 bottom-0 left-0 w-[3px] origin-top -translate-x-[1px]"
            style={{
              scaleY: reduce ? 1 : scrollYProgress,
              background:
                'linear-gradient(to top, var(--c-accent) 20%, color-mix(in srgb, var(--c-accent) 55%, transparent) 60%, transparent 98%)',
            }}
          >
            {/* Glowing tip dot riding the end of the line. */}
            <span
              className="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-accent"
              style={{
                boxShadow:
                  '0 0 5px 2px color-mix(in srgb, var(--c-accent) 80%, transparent), 0 0 18px 6px color-mix(in srgb, var(--c-accent) 45%, transparent), 0 0 70px 18px color-mix(in srgb, var(--c-accent) 25%, transparent)',
              }}
            />
          </motion.div>

          <ol className="flex flex-col gap-16 pl-8 sm:pl-12">
            {experience.map((org, i) => {
              const orgName = decodeEntities(org.organization);
              const logo = org.logo ? (
                <SafeImage
                  src={org.logo}
                  alt={`${orgName} logo`}
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded border border-line bg-bg-1 object-contain"
                />
              ) : (
                <div className="size-12 shrink-0 rounded border border-line bg-bg-2" />
              );

              return (
                <Reveal as="li" key={i} delay={i * 0.04} className="print-avoid-break">
                  {/* Company header: logo + name left, big year right */}
                  <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-2">
                    <div className="flex min-w-0 items-center gap-4">
                      {logo}
                      <div className="min-w-0">
                        {org.url ? (
                          <a
                            href={org.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold transition-colors hover:text-accent-text sm:text-[1.375rem]"
                          >
                            {orgName}
                          </a>
                        ) : (
                          <h3 className="text-lg font-semibold sm:text-[1.375rem]">{orgName}</h3>
                        )}
                        <p className="mt-0.5 text-xs tracking-wide text-ink-faint uppercase">
                          {[org.type, org.period].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </div>
                    <span className="display shrink-0 text-3xl text-ink sm:text-4xl">
                      {yearLabel(org.period, org.roles)}
                    </span>
                  </div>

                  {/* Roles under this company, indented past the logo column */}
                  <ul className="mt-5 flex flex-col gap-6 border-l border-line pl-5 sm:ml-6 sm:pl-6">
                    {(org.roles || []).map((r, ri) => (
                      <li key={ri}>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                          <h4 className="text-[0.9375rem] font-medium text-accent-text">
                            {decodeEntities(r.role)}
                          </h4>
                          <span className="text-xs text-ink-faint">{r.period}</span>
                        </div>
                        {r.location && <p className="mt-0.5 text-xs text-ink-faint">{r.location}</p>}
                        {r.description && (
                          <div
                            className="mt-2 max-w-2xl text-[0.8125rem] leading-relaxed text-ink-muted [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-5"
                            dangerouslySetInnerHTML={{ __html: r.description }}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Section>
    </>
  );
}
