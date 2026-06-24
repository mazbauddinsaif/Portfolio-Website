'use client';
import { useEffect } from 'react';

/* Image loading strategy:
   - Preload the avatar (the above-the-fold LCP image) immediately, high priority.
   - Warm the cache for the heavy off-screen images (50+ certificates, logos,
     project/blog covers) during browser idle time, at low priority, so they
     appear instantly when the user opens those tabs — without competing with
     the initial render. */
export default function ImagePrefetch({ data }) {
  useEffect(() => {
    if (!data) return;
    const added = [];

    const addLink = (href, rel, priority) => {
      if (!href) return;
      // Idempotent: don't add a duplicate hint for the same image.
      if (document.head.querySelector(`link[rel="${rel}"][as="image"][href="${CSS.escape(href)}"]`)) return;
      const link = document.createElement('link');
      link.rel = rel;
      link.as = 'image';
      link.href = href;
      if (priority) link.setAttribute('fetchpriority', priority);
      document.head.appendChild(link);
      added.push(link);
    };

    // LCP: avatar, right away.
    addLink(data.sidebar?.avatar, 'preload', 'high');

    // Everything else: collect, dedupe, prefetch on idle.
    const rest = [];
    (data.achievements || []).forEach((c) => (c.certs || []).forEach((x) => x.img && rest.push(x.img)));
    (data.about?.workedWithList || []).forEach((w) => w.logo && rest.push(w.logo));
    (data.resume?.education || []).forEach((e) => e.logo && rest.push(e.logo));
    (data.resume?.experience || []).forEach((e) => e.logo && rest.push(e.logo));
    (data.portfolio?.projects || []).forEach((p) => p.image && rest.push(p.image));
    (data.blog?.posts || []).forEach((p) => p.coverImage && rest.push(p.coverImage));
    const unique = [...new Set(rest.filter(Boolean))];

    const run = () => unique.forEach((href) => addLink(href, 'prefetch'));
    let idleId;
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(run, { timeout: 2500 });
    } else {
      idleId = window.setTimeout(run, 1500);
    }

    return () => {
      added.forEach((l) => l.remove());
      if (typeof window.cancelIdleCallback === 'function' && typeof idleId === 'number') {
        try { window.cancelIdleCallback(idleId); } catch {}
      }
      window.clearTimeout(idleId);
    };
  }, [data]);

  return null;
}
