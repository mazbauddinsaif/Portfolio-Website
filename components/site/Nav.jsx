'use client';
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'blog', label: 'Blog' },
];

export default function Nav({ name = 'Portfolio' }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll while the mobile overlay is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const first = name.split(' ')[0];

  return (
    <header
      className={`print-hide fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-line bg-bg-0/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 md:px-10">
        <a href="#top" className="display text-xl tracking-wide" onClick={() => setOpen(false)}>
          {first}
          <span className="text-accent-text">.</span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className="text-[0.8125rem] font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href="#contact" className="btn-accent hidden sm:inline-flex" data-track-click="nav_lets_talk">
            Let&apos;s Talk
          </a>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-line text-ink lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX size={17} /> : <FiMenu size={17} />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {open && (
        <div className="fixed inset-0 top-16 z-40 flex flex-col bg-bg-0 lg:hidden">
          <ul className="flex flex-1 flex-col justify-center gap-2 px-8">
            {LINKS.map((l, i) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="display block py-2 text-5xl text-ink-muted transition-colors hover:text-ink"
                >
                  <span className="mr-4 text-base text-accent-text">_0{i + 1}.</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-8 pb-10">
            <a href="#contact" onClick={() => setOpen(false)} className="btn-accent w-full justify-center">
              Let&apos;s Talk
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
