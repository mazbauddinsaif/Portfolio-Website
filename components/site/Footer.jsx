import SocialIcon from './ui/SocialIcon';
import RollIcon from './ui/RollIcon';

// Kept as a named re-export: several sections import { SocialIcon } from './Footer'.
export { SocialIcon };

export default function Footer({ sidebar }) {
  return (
    <footer className="print-hide border-t border-line">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row md:px-10">
        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} {sidebar?.name || 'Portfolio'}. All rights reserved.
        </p>
        <ul className="flex items-center gap-2">
          {(sidebar?.socials || []).map((s, i) => (
            <li key={i}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label || s.icon}
                className="group/roll grid size-9 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-bg-2 hover:text-accent-text"
              >
                <RollIcon name={s.icon} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
