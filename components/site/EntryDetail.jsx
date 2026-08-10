'use client';
import { useEffect, useState } from 'react';
import { FiExternalLink, FiLink } from 'react-icons/fi';
import Modal from './ui/Modal';
import SafeImage from './ui/SafeImage';
import { decodeEntities } from './ui/text';

/* Everything a research entry or publication holds, in one dialog: a gallery of its
   images (cover, credits page, anything else) with the full write-up beside it. */

function Row({ label, children }) {
  if (!children) return null;
  return (
    <div className="flex gap-3 border-t border-line py-2.5 first:border-t-0">
      <span className="w-28 shrink-0 text-[0.6875rem] tracking-wider text-ink-faint uppercase">
        {label}
      </span>
      <span className="min-w-0 flex-1 text-[0.875rem] text-ink-muted">{children}</span>
    </div>
  );
}

export function imagesOf(item) {
  return [
    item?.image && { img: item.image, caption: 'Cover' },
    item?.creditImage && { img: item.creditImage, caption: item.creditCaption || 'Credits page' },
    ...(item?.gallery || []).map((g) => (g?.img ? { img: g.img, caption: g.caption || '' } : null)),
  ].filter(Boolean);
}

export default function EntryDetail({ entry, onClose }) {
  const item = entry?.item;
  const isResearch = entry?.kind === 'research';
  const images = imagesOf(item);
  const [active, setActive] = useState(0);

  // A fresh entry always opens on its first image.
  useEffect(() => setActive(0), [item]);

  if (!item) return <Modal open={false} onClose={onClose} />;

  const meta = isResearch
    ? [item.role, item.institution, item.period].filter(Boolean)
    : [item.type, item.venue || item.publisher, item.date].filter(Boolean);

  const body = isResearch ? item.description : item.abstract;

  return (
    <Modal open onClose={onClose} label={decodeEntities(item.title)}>
      {images.length > 0 && (
        <div className="border-b border-line bg-bg-2">
          <div className="flex justify-center">
            <SafeImage
              src={images[active].img}
              alt={images[active].caption}
              loading="eager"
              className="max-h-[55vh] w-auto max-w-full object-contain"
            />
          </div>

          {images.length > 1 && (
            <ul className="flex flex-wrap justify-center gap-3 p-4">
              {images.map((im, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={i === active}
                    className={`block w-20 overflow-hidden rounded border p-1 transition-colors ${
                      i === active ? 'border-accent-text' : 'border-line hover:border-ink-muted'
                    }`}
                  >
                    <SafeImage src={im.img} alt={im.caption} className="h-16 w-full object-contain" />
                    <span className="mt-1 block truncate text-[0.625rem] text-ink-faint">
                      {im.caption}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="p-6 sm:p-8">
        {isResearch && item.status && (
          <span className="mb-3 inline-block rounded-full bg-accent px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-accent-ink uppercase">
            {decodeEntities(item.status)}
          </span>
        )}

        <h3 className="text-xl font-semibold sm:text-2xl">{decodeEntities(item.title)}</h3>

        {item.authors && (
          <p className="mt-2 text-[0.9375rem] text-ink-muted">{decodeEntities(item.authors)}</p>
        )}

        {meta.length > 0 && (
          <p className="mt-1.5 text-xs tracking-wide text-ink-faint uppercase">
            {meta.map(decodeEntities).join(' · ')}
          </p>
        )}

        {body && (
          <div
            className="mt-5 text-[0.9375rem] leading-relaxed text-ink-muted [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}

        <div className="mt-6">
          {isResearch ? (
            <>
              <Row label="Field">{item.field && decodeEntities(item.field)}</Row>
              <Row label="Supervisor">{item.supervisor && decodeEntities(item.supervisor)}</Row>
              <Row label="With">
                {item.collaborators?.length ? item.collaborators.map(decodeEntities).join(', ') : null}
              </Row>
            </>
          ) : (
            <>
              <Row label="Publisher">{item.publisher && decodeEntities(item.publisher)}</Row>
              <Row label="Journal">{item.venue && decodeEntities(item.venue)}</Row>
              <Row label="Date">{item.date && decodeEntities(item.date)}</Row>
              <Row label="DOI">{item.doi}</Row>
            </>
          )}
          <Row label="Keywords">
            {item.keywords?.length ? item.keywords.map(decodeEntities).join(' · ') : null}
          </Row>
        </div>

        {(item.url || item.doi) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-accent">
                <FiExternalLink size={13} /> {isResearch ? 'View work' : 'Read publication'}
              </a>
            )}
            {item.doi && (
              <a
                href={item.doi.startsWith('http') ? item.doi : `https://doi.org/${item.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <FiLink size={13} /> DOI
              </a>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
