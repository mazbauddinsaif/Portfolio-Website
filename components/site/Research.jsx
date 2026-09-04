'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import Section from './ui/Section';
import Reveal from './ui/Reveal';
import ScrollRail from './ui/ScrollRail';
import EntryDetail from './EntryDetail';
import { ResearchItem, PublicationItem } from './ResearchCards';

/* The home page carries one rail per list, holding only the entries flagged
   "show in horizontal row" in the panel. Everything else lives on the full
   listing page the rail's last card links to. */

function SeeAllCard({ href, count, what }) {
  return (
    <Reveal
      as="div"
      className="flex w-[85vw] shrink-0 snap-start flex-col items-center justify-center gap-5 rounded-xl border border-line bg-bg-1 p-8 text-center sm:w-[22rem]"
    >
      <span
        aria-hidden="true"
        className="size-12 rounded-full bg-accent/80 blur-[2px]"
      />
      <p className="display text-2xl sm:text-3xl">Want to see more?</p>
      <p className="max-w-[22ch] text-sm text-ink-muted">
        {count > 0 ? `All ${count} ${what} in one place.` : `Browse every ${what.replace(/s$/, '')}.`}
      </p>
      <Link href={href} className="btn-accent mt-1">
        See all {what} <FiArrowRight size={14} />
      </Link>
    </Reveal>
  );
}

function Rail({ id, title, items, href, what, onOpen, Item }) {
  if (!items.length) return null;
  return (
    <div id={id} className="scroll-mt-24">
      <Reveal className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="display text-2xl sm:text-3xl">{title}</h3>
        <Link
          href={href}
          className="text-xs font-semibold text-ink-muted transition-colors hover:text-accent-text"
        >
          View all →
        </Link>
      </Reveal>
      <ScrollRail label={title}>
        {items.map((item, i) => (
          <Item
            key={i}
            item={item}
            delay={i * 0.04}
            onOpen={() => onOpen(item)}
            variant="rail"
            eagerImage={i === 0}
          />
        ))}
        <SeeAllCard href={href} count={items.length} what={what} />
      </ScrollRail>
    </div>
  );
}

export default function Research({ research = [], publications = [] }) {
  // { item, kind } — the entry whose detail dialog is open.
  const [detail, setDetail] = useState(null);

  // `featured` is the panel's "Show in horizontal row" switch; older entries predate
  // it, so anything without the field still shows.
  const shown = (list) => (list || []).filter((x) => !x.hidden && x.featured !== false);

  const featuredResearch = shown(research);
  const featuredPublications = shown(publications);

  if (!featuredResearch.length && !featuredPublications.length) return null;

  return (
    <Section
      id="research"
      title="Research & Publications"
      eyebrow={`${featuredResearch.length + featuredPublications.length} highlighted`}
    >
      <div className="flex flex-col gap-24">
        <Rail
          id="research-row"
          title="Research"
          items={featuredResearch}
          href="/research"
          what="research"
          Item={ResearchItem}
          onOpen={(item) => setDetail({ item, kind: 'research' })}
        />
        <Rail
          id="publications-row"
          title="Publications"
          items={featuredPublications}
          href="/publications"
          what="publications"
          Item={PublicationItem}
          onOpen={(item) => setDetail({ item, kind: 'publications' })}
        />
      </div>

      {detail && <EntryDetail entry={detail} onClose={() => setDetail(null)} />}
    </Section>
  );
}
