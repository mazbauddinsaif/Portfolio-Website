import { FiGithub, FiLinkedin, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiGlobe, FiMail } from 'react-icons/fi';

/* The CMS stores ionicon names ("logo-github"); map them onto Feather icons. */
export function SocialIcon({ name, size = 16 }) {
  const key = (name || '').toLowerCase();
  if (key.includes('github')) return <FiGithub size={size} />;
  if (key.includes('linkedin')) return <FiLinkedin size={size} />;
  if (key.includes('facebook')) return <FiFacebook size={size} />;
  if (key.includes('twitter') || key.includes('x-')) return <FiTwitter size={size} />;
  if (key.includes('instagram')) return <FiInstagram size={size} />;
  if (key.includes('youtube')) return <FiYoutube size={size} />;
  if (key.includes('mail')) return <FiMail size={size} />;
  return <FiGlobe size={size} />;
}

export default function Footer({ sidebar }) {
  return (
    <footer className="print-hide border-t border-line">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row md:px-10">
        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} {sidebar?.name || 'Portfolio'}. All rights reserved.
        </p>
        <ul className="flex items-center gap-4">
          {(sidebar?.socials || []).map((s, i) => (
            <li key={i}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.icon}
                className="text-ink-faint transition-colors hover:text-accent-text"
              >
                <SocialIcon name={s.icon} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
