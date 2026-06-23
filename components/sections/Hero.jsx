import { FiGithub, FiLinkedin, FiFacebook, FiArrowRight, FiDownload } from 'react-icons/fi';
import Reveal from '../ui/Reveal';
import Boop from '../ui/Boop';
import HeroDecoration from './HeroDecoration';

const ICONS = {
  'logo-github': FiGithub,
  'logo-linkedin': FiLinkedin,
  'logo-facebook': FiFacebook,
};

export default function Hero({ sidebar = {} }) {
  const socials = sidebar.socials || [];
  const avatar = sidebar.avatar ? encodeURI(sidebar.avatar) : null;

  return (
    <section className="hero">
      <HeroDecoration />
      <div className="container hero__inner hero__grid">
        <div className="hero__text">
          <Reveal>
            <span className="pill" style={{ background: 'var(--sky-pill-bg)', color: 'var(--sky-pill-text)' }}>
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
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={s.label}>
                      <Icon size={18} />
                    </a>
                  </Boop>
                );
              })}
            </div>
          </Reveal>
        </div>

        <div className="hero__avatar-wrap">
          {avatar && (
            <Boop scale={1.04} rotation={2}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hero__avatar" src={avatar} alt={sidebar.name || 'Portrait'} />
            </Boop>
          )}
        </div>
      </div>

      <div className="hero__waves" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="var(--wave-1)"
            d="M0,64 C240,110 480,20 720,48 C960,76 1200,120 1440,72 L1440,120 L0,120 Z"
          />
          <path
            fill="var(--wave-2)"
            d="M0,90 C240,120 480,70 720,86 C960,102 1200,118 1440,96 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}
