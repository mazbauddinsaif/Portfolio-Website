'use client';
import { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useReducedMotion } from 'motion/react';
import { FiDownload } from 'react-icons/fi';
import Section from './ui/Section';
import Reveal from './ui/Reveal';
import Modal from './ui/Modal';
import SafeImage from './ui/SafeImage';
import { decodeEntities } from './ui/text';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/* Periods are free text written the way LinkedIn writes them ("Jun 2025 — Present",
   "2019 – 2024"), so the endpoints are parsed out rather than stored as dates.
   Returns months since epoch-ish so two endpoints can simply be subtracted. */
function parseEndpoint(str, { end = false } = {}) {
  const s = String(str || '').trim().toLowerCase();
  if (!s) return null;
  if (/present|now|current|ongoing/.test(s)) {
    const d = new Date();
    return d.getFullYear() * 12 + d.getMonth();
  }
  const year = s.match(/\d{4}/);
  if (!year) return null;
  const monthName = MONTHS.findIndex((m) => s.startsWith(m) || s.includes(` ${m}`));
  // A bare year counts from January, or through December when it is the end.
  const month = monthName >= 0 ? monthName : end ? 11 : 0;
  return parseInt(year[0], 10) * 12 + month;
}

/* Splits "Jun 2025 — Present" into [start, end] month numbers. Any of the dash
   characters people actually type, plus "to". */
function spanOf(period) {
  const parts = String(period || '').split(/\s*(?:—|–|-|to)\s*/i).filter(Boolean);
  if (parts.length < 2) return null;
  const start = parseEndpoint(parts[0]);
  const end = parseEndpoint(parts[parts.length - 1], { end: true });
  if (start === null || end === null || end < start) return null;
  return [start, end];
}

/* "1 yr 4 mon" — inclusive of both endpoint months. */
function formatMonths(months) {
  const yrs = Math.floor(months / 12);
  const mon = months % 12;
  return [
    yrs ? `${yrs} yr${yrs > 1 ? 's' : ''}` : '',
    mon ? `${mon} mon` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function durationOf(period) {
  const span = spanOf(period);
  return span ? formatMonths(span[1] - span[0] + 1) : '';
}

/* Overall time at an organization: its own period if it has one, otherwise the
   full span covered by its roles. */
function orgDuration(org) {
  const own = durationOf(org.period);
  if (own) return own;
  const spans = (org.roles || []).map((r) => spanOf(r.period)).filter(Boolean);
  if (!spans.length) return '';
  const start = Math.min(...spans.map((s) => s[0]));
  const end = Math.max(...spans.map((s) => s[1]));
  return formatMonths(end - start + 1);
}

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
  const [media, setMedia] = useState(null);
  const closeMedia = useCallback(() => setMedia(null), []);
  // Line grows as the timeline scrolls through the viewport.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.75', 'end 0.45'],
    // Measuring in a layout effect runs before hydration completes and motion throws.
    layoutEffect: false,
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
                          {[org.type, org.period, orgDuration(org)].filter(Boolean).join(' · ')}
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
                          <span className="text-xs text-ink-faint">
                            {[r.period, durationOf(r.period)].filter(Boolean).join(' · ')}
                          </span>
                        </div>
                        {r.location && <p className="mt-0.5 text-xs text-ink-faint">{r.location}</p>}
                        {r.description && (
                          <div
                            className="mt-2 max-w-2xl text-[0.8125rem] leading-relaxed text-ink-muted [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-5"
                            dangerouslySetInnerHTML={{ __html: r.description }}
                          />
                        )}
                        {/* LinkedIn-style media strip: thumbnails a click away from the full image. */}
                        {r.media?.length > 0 && (
                          <ul className="print-hide mt-4 flex flex-wrap gap-3">
                            {r.media.map((m, mi) => (
                              <li key={mi}>
                                <button
                                  type="button"
                                  onClick={() => setMedia(m)}
                                  className="group block w-28 text-left sm:w-32"
                                >
                                  <span className="block aspect-[4/3] overflow-hidden rounded border border-line bg-bg-2">
                                    <SafeImage
                                      src={m.img}
                                      alt={m.caption || `${orgName} media`}
                                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                                    />
                                  </span>
                                  {m.caption && (
                                    <span className="mt-1.5 line-clamp-2 block text-[0.6875rem] leading-snug text-ink-faint">
                                      {decodeEntities(m.caption)}
                                    </span>
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </ol>
        </div>

        <Modal open={Boolean(media)} onClose={closeMedia} label={media?.caption || 'Media'}>
          {media && (
            <>
              {/* The image sets its own height so nothing is cropped, whatever its aspect. */}
              <div className="flex justify-center border-b border-line bg-bg-2">
                <SafeImage
                  src={media.img}
                  alt={media.caption || ''}
                  loading="eager"
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
              </div>
              {(media.caption?.trim().length > 1 || media.url) && (
                <div className="p-6 sm:p-8">
                  {media.caption?.trim().length > 1 && (
                    <p className="text-sm text-ink-muted">{decodeEntities(media.caption)}</p>
                  )}
                  {media.url && (
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost mt-5"
                    >
                      Open link
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </Modal>
      </Section>
    </>
  );
}
