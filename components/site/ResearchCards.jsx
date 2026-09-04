'use client';
import { FiExternalLink, FiLink } from 'react-icons/fi';
import Reveal from './ui/Reveal';
import SafeImage from './ui/SafeImage';
import { decodeEntities } from './ui/text';

/* Research entries and publications are two shapes of the same thing — a title, a
   venue, a date and some artwork — so they share one card frame in three layouts:
   `rail` (fixed-width card in the horizontal row), `grid` (full listing pages) and
   `row` (wide text-left / images-right). */

export function Keywords({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {items.map((k, i) => (
        <li key={i} className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-ink-faint">
          {decodeEntities(k)}
        </li>
      ))}
    </ul>
  );
}

const FRAME = {
  rail: 'flex w-[85vw] shrink-0 snap-start flex-col gap-5 rounded-xl border border-line bg-bg-1 p-6 sm:w-[26rem]',
  grid: 'flex h-full flex-col gap-5 rounded-xl border border-line bg-bg-1 p-6',
  row: 'grid gap-6 border-t border-line py-8 first:border-t-0 first:pt-0 md:grid-cols-[1fr_auto]',
};

export function Card({ children, image, credit, alt, delay = 0, onOpen, variant = 'row', eagerImage = false }) {
  const stacked = variant !== 'row';

  /* The whole card opens the detail dialog; the images are just a shortcut into it
     with that image already selected. */
  const shot = (src, label) => (
    <button
      type="button"
      onClick={() => onOpen?.()}
      aria-label={`Open ${label}`}
      className="group block w-full overflow-hidden rounded border border-line bg-bg-2 p-3"
    >
      {/* Book covers are portrait and credits pages are scans, so nothing is cropped. */}
      <SafeImage
        src={src}
        alt={label}
        loading={eagerImage ? 'eager' : 'lazy'}
        className="mx-auto max-h-64 w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </button>
  );

  const art = (image || credit) && (
    <div className={stacked ? 'flex gap-3' : 'flex w-full shrink-0 gap-3 md:w-72'}>
      {image && <div className="flex-1">{shot(image, `${alt} cover`)}</div>}
      {credit && <div className="flex-1">{shot(credit, `${alt} — credits page`)}</div>}
    </div>
  );

  return (
    <Reveal
      as={variant === 'row' ? 'li' : 'div'}
      delay={delay}
      className={`${FRAME[variant]} ${onOpen ? 'cursor-pointer transition-colors hover:border-accent-text' : ''}`}
      onClick={onOpen}
    >
      {stacked && art}
      <div className="min-w-0">{children}</div>
      {!stacked && art}
    </Reveal>
  );
}

export function ResearchItem({ item, delay, onOpen, variant, eagerImage = false }) {
  const meta = [item.role, item.institution, item.period].filter(Boolean);
  return (
    <Card
      image={item.image}
      alt={decodeEntities(item.title)}
      delay={delay}
      onOpen={onOpen}
      variant={variant}
      eagerImage={eagerImage}
    >
      <div className="flex flex-wrap items-center gap-3">
        {item.status && (
          <span className="rounded-full bg-accent px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-accent-ink uppercase">
            {decodeEntities(item.status)}
          </span>
        )}
        {item.field && (
          <span className="text-[0.6875rem] tracking-wider text-ink-faint uppercase">
            {decodeEntities(item.field)}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-semibold sm:text-xl">{decodeEntities(item.title)}</h3>

      {meta.length > 0 && (
        <p className="mt-1.5 text-xs text-ink-faint">{meta.map(decodeEntities).join(' · ')}</p>
      )}

      {item.supervisor && (
        <p className="mt-1 text-xs text-ink-faint">
          Supervisor: <span className="text-ink-muted">{decodeEntities(item.supervisor)}</span>
        </p>
      )}

      {item.collaborators?.length > 0 && (
        <p className="mt-1 text-xs text-ink-faint">
          With:{' '}
          <span className="text-ink-muted">{item.collaborators.map(decodeEntities).join(', ')}</span>
        </p>
      )}

      {item.description && (
        <div
          className="mt-3 max-w-2xl text-[0.875rem] leading-relaxed text-ink-muted [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      )}

      <Keywords items={item.keywords} />

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="btn-ghost mt-5"
        >
          <FiExternalLink size={13} /> View work
        </a>
      )}
    </Card>
  );
}

export function PublicationItem({ item, delay, onOpen, variant, eagerImage = false }) {
  const meta = [item.type, item.venue || item.publisher, item.date].filter(Boolean);
  return (
    <Card
      image={item.image}
      credit={item.creditImage}
      alt={decodeEntities(item.title)}
      delay={delay}
      onOpen={onOpen}
      variant={variant}
      eagerImage={eagerImage}
    >
      <h3 className="text-lg font-semibold sm:text-xl">{decodeEntities(item.title)}</h3>

      {item.authors && (
        <p className="mt-1.5 text-[0.875rem] text-ink-muted">{decodeEntities(item.authors)}</p>
      )}

      {meta.length > 0 && (
        <p className="mt-1 text-xs tracking-wide text-ink-faint uppercase">
          {meta.map(decodeEntities).join(' · ')}
        </p>
      )}

      {item.abstract && (
        <div
          className="mt-3 max-w-2xl text-[0.875rem] leading-relaxed text-ink-muted [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: item.abstract }}
        />
      )}

      <Keywords items={item.keywords} />

      <div className="mt-5 flex flex-wrap gap-3">
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn-ghost"
          >
            <FiExternalLink size={13} /> Read publication
          </a>
        )}
        {item.doi && (
          <a
            href={item.doi.startsWith('http') ? item.doi : `https://doi.org/${item.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn-ghost"
          >
            <FiLink size={13} /> DOI
          </a>
        )}
      </div>
    </Card>
  );
}
