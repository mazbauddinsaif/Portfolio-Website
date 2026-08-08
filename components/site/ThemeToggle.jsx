'use client';
import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

export default function ThemeToggle() {
  // null until mounted — the server can't know the visitor's theme.
  const [dark, setDark] = useState(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid size-9 place-items-center rounded-full border border-line text-ink-muted transition-colors hover:border-accent-text hover:text-accent-text"
    >
      {dark === null ? null : dark ? <FiSun size={15} /> : <FiMoon size={15} />}
    </button>
  );
}
