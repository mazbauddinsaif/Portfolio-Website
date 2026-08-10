'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import RollIcon from './ui/RollIcon';

/* Absolute hrefs so the nav also works from /play and /blog/[slug].
   The drawer always lists everything; the inline bar shows the same links once
   there is room (md+), dropping `wide` ones until xl.

   `drawerOnly` keeps a section out of the inline bar entirely. Seven links
   crowded the centre of the bar at every width; these three still have
   sections on the page, so they stay reachable from the drawer rather than
   being deleted — a link removed from both places leaves a section nothing
   points at. */
const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack', drawerOnly: true },
  { id: 'experience', label: 'Experience' },
  { id: 'research', label: 'Research', drawerOnly: true },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements', wide: true },
  { id: 'blog', label: 'Blog', drawerOnly: true },
];

/* One dot colour per menu row, cycled — the only colour in the drawer, so the
   list reads as a list rather than a wall of text. */
const DOTS = ['#f5b301', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316'];

export default function Nav({ name = 'Portfolio', sidebar }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Performs an immediate non-animated jump directly to target section
  const handleJump = (e, id) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'instant' });
        window.history.pushState(null, '', `/#${id}`);
      }
    }
    setOpen(false);
  };

  const first = name.split(' ')[0];
  const socials = sidebar?.socials || [];

  return (
    <>
      <header
        className={`print-hide fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'border-b border-line bg-bg-0/90 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
      <nav className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 md:px-10">
        <Link href="/" className="display text-xl tracking-wide" onClick={() => setOpen(false)}>
          {first}
          <span className="text-accent-text">.</span>
        </Link>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex xl:gap-7">
          {LINKS.filter((l) => !l.drawerOnly).map((l) => (
            <li key={l.id} className={l.wide ? 'hidden xl:block' : undefined}>
              <Link
                href={`/#${l.id}`}
                onClick={(e) => handleJump(e, l.id)}
                className="text-[0.8125rem] font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/#contact"
            onClick={(e) => handleJump(e, 'contact')}
            className="btn-accent hidden sm:inline-flex"
            data-track-click="nav_lets_talk"
          >
            Let&apos;s Talk
          </Link>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent-text"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX size={17} /> : <FiMenu size={17} />}
          </button>
        </div>
        </nav>
      </header>

      {/* Drawer lives outside <header>: the bar's backdrop-blur makes it a containing
          block for fixed children, which clipped the panel to the 4rem-tall bar. */}
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 hidden cursor-default bg-black/50 backdrop-blur-[2px] sm:block"
        />
        <div
          className="absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto border-l border-line bg-bg-1 pt-5 pb-10 shadow-2xl transition-transform duration-300 ease-out sm:w-[26rem]"
          style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
        >
          <div className="flex justify-end px-6 md:px-10">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid size-11 place-items-center border border-accent text-ink transition-colors hover:bg-accent hover:text-accent-ink"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="mt-10 flex flex-1 flex-col gap-12 px-6 md:px-10">
            <div>
              <p className="eyebrow mb-5 text-ink-faint">Menu</p>
              <ul className="flex flex-col gap-3.5">
                {LINKS.map((l, i) => (
                  <li key={l.id}>
                    <Link
                      href={`/#${l.id}`}
                      onClick={(e) => handleJump(e, l.id)}
                      className="group inline-flex items-center gap-3.5 text-[1.0625rem] text-ink-muted transition-colors hover:text-ink"
                    >
                      <span
                        className="size-2.5 shrink-0 rounded-full transition-transform group-hover:scale-125"
                        style={{ background: DOTS[i % DOTS.length] }}
                      />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {socials.length > 0 && (
              <div>
                <p className="eyebrow mb-5 text-ink-faint">Social</p>
                <ul className="flex flex-col gap-3.5">
                  {socials.map((s, i) => (
                    <li key={i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/roll inline-flex items-center gap-3 text-[1.0625rem] text-ink-muted transition-colors hover:text-accent-text"
                      >
                        <RollIcon name={s.icon} size={16} />
                        {s.label || s.icon}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(sidebar?.email || sidebar?.phoneDisplay) && (
              <div className="mt-auto">
                <p className="eyebrow mb-4 text-ink-faint">Get in touch</p>
                {sidebar.email && (
                  <a
                    href={`mailto:${sidebar.email}`}
                    className="block text-[1.0625rem] text-ink-muted transition-colors hover:text-accent-text"
                  >
                    {sidebar.email}
                  </a>
                )}
                {sidebar.phoneDisplay && (
                  <a
                    href={`tel:${sidebar.phone || sidebar.phoneDisplay}`}
                    className="mt-1.5 block text-[1.0625rem] text-ink-muted transition-colors hover:text-accent-text"
                  >
                    {sidebar.phoneDisplay}
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-col gap-3 px-6 md:px-10">
            <Link href="/play" onClick={() => setOpen(false)} className="btn-accent w-full justify-center">
              Play With Me
            </Link>
            <Link
              href="/#contact"
              onClick={(e) => handleJump(e, 'contact')}
              className="btn-ghost w-full justify-center"
            >
              Let&apos;s Talk
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
