'use client';

import { useEffect, useState } from 'react';
import SafeImage from './SafeImage';

/* Renders only the active theme's portrait so light+dark aren't both downloaded.
   Falls back to the light src on the server / first paint to protect LCP. */
export default function ThemePortrait({
  light,
  dark,
  alt = 'Portrait',
  className = '',
  width,
  height,
}) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDarkMode(root.classList.contains('dark'));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);

  const src = darkMode ? dark || light : light || dark;
  if (!src) return null;

  return (
    <SafeImage
      key={src}
      src={src}
      alt={alt}
      loading="eager"
      fetchPriority="high"
      width={width}
      height={height}
      className={className}
    />
  );
}
