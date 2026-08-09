'use client';
import { useEffect, useRef } from 'react';
import ThemeScope from './ThemeScope';
import Nav from './Nav';
import Footer from './Footer';
import Hero from './Hero';
import About from './About';
import Stack from './Stack';
import Experience from './Experience';
import Education from './Education';
import Projects from './Projects';
import Achievements from './Achievements';
import Blog from './Blog';
import Contact from './Contact';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function track(body) {
  fetch(`${API_URL}/api/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ referrer: document.referrer || '', ...body }),
  }).catch(() => {});
}

export default function SiteShell({ data }) {
  const analyticsOff = data?.enableAnalytics === false;
  const seen = useRef(new Set());

  // Pageview per section: fires once per section per visit as it scrolls into view.
  useEffect(() => {
    if (analyticsOff) return;
    track({ type: 'pageview', page: 'home' });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const id = e.target.id;
          if (e.isIntersecting && id && !seen.current.has(id)) {
            seen.current.add(id);
            track({ type: 'pageview', page: id });
          }
        });
      },
      { threshold: 0.25 }
    );
    document.querySelectorAll('section[id]').forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [analyticsOff]);

  // Click tracking via data-track-click, same contract as the old UI.
  useEffect(() => {
    if (analyticsOff) return;
    const onClick = (e) => {
      const el = e.target.closest('[data-track-click]');
      if (!el) return;
      track({ type: 'click', page: 'home', eventData: el.getAttribute('data-track-click') });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [analyticsOff]);

  return (
    <ThemeScope theme={data?.siteTheme}>
      <div id="top" />
      <Nav name={data.sidebar?.name} />
      <main>
        <Hero sidebar={data.sidebar} about={data.about} contact={data.contact} resume={data.resume} portfolio={data.portfolio} achievements={data.achievements} />
        <About about={data.about} />
        <Stack skillsMatrix={data.resume?.skillsMatrix} />
        <Experience experience={data.resume?.experience} sidebar={data.sidebar} />
        <Education education={data.resume?.education} />
        <Projects portfolio={data.portfolio} />
        <Achievements achievements={data.achievements} />
        <Blog />
        <Contact contact={data.contact} sidebar={data.sidebar} />
      </main>
      <Footer sidebar={data.sidebar} />
    </ThemeScope>
  );
}
