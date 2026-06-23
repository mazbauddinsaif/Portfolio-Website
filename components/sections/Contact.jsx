import { FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi';
import Reveal from '../ui/Reveal';
import Boop from '../ui/Boop';

export default function Contact({ sidebar = {} }) {
  return (
    <section id="contact" className="section">
      <div className="container container-narrow" style={{ textAlign: 'center' }}>
        <Reveal>
          <span className="eyebrow">Contact</span>
          <h2 style={{ marginTop: '0.5rem' }}>
            Let&apos;s <span className="gradient-text">build something</span> together.
          </h2>
          <p style={{ margin: '1rem auto 0', maxWidth: '52ch' }}>
            Open to internships, research collaborations, and PhD opportunities. The fastest way to
            reach me is email.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.8rem' }}>
            <Boop scale={1.04} y={-2}>
              <a href={`mailto:${sidebar.email || ''}`} className="btn btn-primary">
                <FiMail size={16} /> {sidebar.email || 'Email me'}
              </a>
            </Boop>
            <a href="/cv" className="btn btn-ghost">
              View CV <FiArrowRight size={16} />
            </a>
          </div>
          {sidebar.location && (
            <p style={{ marginTop: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiMapPin size={15} /> {sidebar.location}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
