import Reveal from '../ui/Reveal';

export default function Experience({ resume = {} }) {
  const experience = resume.experience || [];
  const education = resume.education || [];

  return (
    <section id="experience" className="section" style={{ background: 'var(--bg-subtle)' }}>
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Experience &amp; Education</span>
            <h2>Where I&apos;ve worked &amp; studied</h2>
          </div>
        </Reveal>

        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <div>
            {experience.map((exp, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <h3 dangerouslySetInnerHTML={{ __html: exp.organization }} />
                    {exp.period && <span className="pill">{exp.period}</span>}
                  </div>
                  {(exp.roles || []).map((r, j) => (
                    <div key={j} style={{ marginTop: '0.75rem' }}>
                      <strong style={{ color: 'var(--text)' }} dangerouslySetInnerHTML={{ __html: r.role }} />
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-faint)' }}>
                        {[r.period, r.location].filter(Boolean).join(' · ')}
                      </div>
                      {r.description && (
                        <p style={{ marginTop: '0.3rem', fontSize: '0.95rem' }} dangerouslySetInnerHTML={{ __html: r.description }} />
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <div>
            {education.map((ed, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <h3 dangerouslySetInnerHTML={{ __html: ed.institution }} />
                    {ed.period && <span className="pill">{ed.period}</span>}
                  </div>
                  {ed.description && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }} dangerouslySetInnerHTML={{ __html: ed.description }} />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
