import { FiGithub, FiLinkedin, FiFacebook, FiMail } from 'react-icons/fi';

const ICONS = {
  'logo-github': FiGithub,
  'logo-linkedin': FiLinkedin,
  'logo-facebook': FiFacebook,
};

export default function Footer({ sidebar = {} }) {
  const socials = sidebar.socials || [];
  const year = 2026;
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <span>
          © {year} {sidebar.name || 'Mazba Uddin Saif'}. Built with Next.js.
        </span>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          {socials.map((s) => {
            const Icon = ICONS[s.icon] || FiMail;
            return (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                aria-label={s.label}
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
