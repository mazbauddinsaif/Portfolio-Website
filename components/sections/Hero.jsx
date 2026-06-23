import { FiGithub, FiLinkedin, FiFacebook, FiArrowRight, FiDownload } from 'react-icons/fi';
import Reveal from '../ui/Reveal';
import Boop from '../ui/Boop';

const ICONS = {
  'logo-github': FiGithub,
  'logo-linkedin': FiLinkedin,
  'logo-facebook': FiFacebook,
};

export default function Hero({ sidebar = {}, stats = [] }) {
  const socials = sidebar.socials || [];
  return (
    <section className="hero">
      <div className="hero__blob" aria-hidden="true" />
      <div className="container hero__inner">
        <Reveal>
          <span className="pill">
            <span aria-hidden="true">👋</span> {sidebar.location || 'Dhaka, Bangladesh'}
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1>
            Hi, I&apos;m <span className="gradient-text">{sidebar.name || 'Mazba Uddin Saif'}</span>.
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="hero__lead">
            {sidebar.title || 'Junior Software Developer | Instructor'} — a Computer Science
            undergraduate building efficient software, competing in olympiads, and exploring secure,
            scalable systems and AI.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="hero__cta">
            <a href="/cv" className="btn btn-primary">
              <FiDownload size={16} /> View CV
            </a>
            <a href="/#publications" className="btn btn-ghost">
              See research <FiArrowRight size={16} />
            </a>
          </div>
        </Reveal>
        <Reveal delay={260}>
          <div className="hero__socials">
            {socials.map((s) => {
              const Icon = ICONS[s.icon] || FiArrowRight;
              return (
                <Boop key={s.url} rotation={-8} scale={1.15}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    aria-label={s.label}
                  >
                    <Icon size={18} />
                  </a>
                </Boop>
              );
            })}
          </div>
        </Reveal>

        {stats.length > 0 && (
          <Reveal delay={320}>
            <div className="stats" style={{ marginTop: '3rem' }}>
              {stats.map((s) => (
                <div className="stat" key={s.label}>
                  <div className="stat__num gradient-text">{s.num}</div>
                  <div className="stat__label">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
