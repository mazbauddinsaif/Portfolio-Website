'use client';
import { useState } from 'react';

/* Drop-in <img> replacement:
   - decoding="async" so image decode never blocks the main thread
   - onError fallback so a missing/404 image shows a neutral box, not a broken icon
   - passes through loading / fetchPriority / width / height for CLS + LCP control */
export default function SafeImage({
  src,
  alt = '',
  className = '',
  loading = 'lazy',
  fetchPriority,
  width,
  height,
  style,
  ...rest
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <span
        className={`img-fallback ${className}`}
        role="img"
        aria-label={alt}
        style={{ width, height, ...style }}
      />
    );
  }

  return (
    // next/image can't express the onError fallback this needs, and the CMS
    // serves arbitrary remote hosts (GitHub OG images, uploaded logos).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      width={width}
      height={height}
      style={style}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
