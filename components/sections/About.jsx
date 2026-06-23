import Reveal from '../ui/Reveal';

export default function About({ about = {} }) {
  const paragraphs = (about.paragraphs || []).slice(0, 4);
  const services = about.services || [];
  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">About</span>
            <h2>A bit about me</h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="prose" style={{ marginBottom: '2.5rem' }}>
            {paragraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>
        </Reveal>
        {services.length > 0 && (
          <div className="grid grid-2">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <div className="card">
                  <h3 dangerouslySetInnerHTML={{ __html: s.title }} />
                  <p style={{ marginTop: '0.5rem' }}>{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
