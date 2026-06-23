'use client';

import { useMemo, useState } from 'react';
import { FiAward, FiArrowRight } from 'react-icons/fi';
import Reveal from '../ui/Reveal';

const PREVIEW_COUNT = 9;

export default function Certifications({ achievements = [], full = false }) {
  const groups = [...new Set(achievements.map((a) => a.group).filter(Boolean))];
  const allCerts = useMemo(
    () =>
      achievements.flatMap((a) =>
        (a.certs || []).map((c) => ({ ...c, group: a.group }))
      ),
    [achievements]
  );

  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(full);

  const filtered = filter === 'All' ? allCerts : allCerts.filter((c) => c.group === filter);
  const visible = showAll ? filtered : filtered.slice(0, PREVIEW_COUNT);

  return (
    <section id="certifications" className="section" style={{ background: full ? 'transparent' : 'var(--bg-subtle)' }}>
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Achievements</span>
            <h2>Certifications &amp; awards</h2>
            <p>{allCerts.length}+ certifications across olympiads, scholarships, and competitions — from district to national level.</p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="cert-filter" role="group" aria-label="Filter certifications">
            {['All', ...groups].map((g) => (
              <button
                key={g}
                aria-pressed={filter === g}
                onClick={() => {
                  setFilter(g);
                  setShowAll(full);
                }}
                dangerouslySetInnerHTML={{ __html: g }}
              />
            ))}
          </div>
        </Reveal>

        <div className="grid grid-3">
          {visible.map((c, i) => (
            <Reveal key={`${c.cardTitle}-${i}`} delay={(i % 3) * 50}>
              <div className="card" style={{ height: '100%' }}>
                <span className="pill" style={{ marginBottom: '0.6rem' }}>
                  <FiAward size={14} /> {c.group}
                </span>
                <h3 style={{ fontSize: '1.05rem' }} dangerouslySetInnerHTML={{ __html: c.cardTitle || c.title }} />
                {c.issuer && <p className="cert-card__issuer" dangerouslySetInnerHTML={{ __html: c.issuer }} />}
              </div>
            </Reveal>
          ))}
        </div>

        {!showAll && filtered.length > PREVIEW_COUNT && (
          <button className="btn btn-ghost" style={{ marginTop: '1.5rem' }} onClick={() => setShowAll(true)}>
            Show all {filtered.length} <FiArrowRight size={16} />
          </button>
        )}
      </div>
    </section>
  );
}
