import { FiArrowRight } from 'react-icons/fi';
import Reveal from '../ui/Reveal';

export default function Publications({ publications = [], preview = true }) {
  const items = preview ? publications.slice(0, 3) : publications;
  if (items.length === 0) return null;

  return (
    <section id="publications" className="section">
      <div className="container container-narrow">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Research</span>
            <h2>Publications</h2>
            <p>Peer-reviewed papers and research contributions.</p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card" style={{ padding: '0.5rem 1.5rem' }}>
            {items.map((pub, i) => (
              <article className="pub" key={i}>
                <div className="pub__title">{pub.title}</div>
                <div className="pub__meta">
                  {pub.authors}
                  {pub.venue && (
                    <>
                      {' · '}
                      <span className="pub__venue">{pub.venue}</span>
                    </>
                  )}
                  {pub.year && ` · ${pub.year}`}
                </div>
                {pub.links && pub.links.length > 0 && (
                  <div className="pub__links">
                    {pub.links.map((l) => (
                      <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer">
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </Reveal>
        {preview && publications.length > items.length && (
          <Reveal delay={140}>
            <a href="/publications" className="btn btn-ghost" style={{ marginTop: '1.5rem' }}>
              All publications <FiArrowRight size={16} />
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
