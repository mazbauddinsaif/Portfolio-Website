'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import ThemeScope from './ThemeScope';
import Nav from './Nav';
import Footer from './Footer';
import Reveal from './ui/Reveal';
import EntryDetail from './EntryDetail';
import { ResearchItem, PublicationItem } from './ResearchCards';

/* The full listing behind a rail's "See all" card: every visible entry of one kind,
   laid out as a grid rather than a row. */
export default function ResearchGallery({ data, kind }) {
  const [detail, setDetail] = useState(null);

  const isResearch = kind === 'research';
  const Item = isResearch ? ResearchItem : PublicationItem;
  const items = ((isResearch ? data?.research : data?.publications) || []).filter((x) => !x.hidden);

  const title = isResearch ? 'All Research' : 'All Publications';
  const blurb = isResearch
    ? 'Every research project and ongoing investigation.'
    : 'Every publication and book contribution.';

  return (
    <ThemeScope theme={data?.siteTheme}>
      <div id="top" />
      <Nav name={data?.sidebar?.name} sidebar={data?.sidebar} />

      <main className="mx-auto w-full max-w-7xl px-5 pt-32 pb-24 md:px-10 md:pt-40">
        <Reveal className="flex flex-col items-center gap-6 text-center">
          <Link href="/#research" className="btn-ghost">
            <FiArrowLeft size={14} /> Back to home
          </Link>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl">{title}</h1>
          <p className="max-w-xl text-sm text-ink-muted">{blurb}</p>
        </Reveal>

        {items.length === 0 ? (
          <p className="mt-20 text-center text-sm text-ink-faint">Nothing published here yet.</p>
        ) : (
          <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item, i) => (
              <Item
                key={i}
                item={item}
                delay={Math.min(i * 0.04, 0.4)}
                onOpen={() => setDetail({ item, kind })}
                variant="grid"
              />
            ))}
          </div>
        )}
      </main>

      <Footer sidebar={data?.sidebar} />

      {detail && <EntryDetail entry={detail} onClose={() => setDetail(null)} />}
    </ThemeScope>
  );
}
