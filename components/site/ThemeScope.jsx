'use client';
import { useEffect } from 'react';

/* Applies the admin-selected accent theme. The class also lands on <html>
   so body background, ::selection and the scrollbar pick it up. */
export default function ThemeScope({ theme, children }) {
  const cobalt = theme === 'cobalt';

  useEffect(() => {
    document.documentElement.classList.toggle('theme-cobalt', cobalt);
  }, [cobalt]);

  return <div className={cobalt ? 'theme-cobalt bg-bg-0 text-ink' : ''}>{children}</div>;
}
