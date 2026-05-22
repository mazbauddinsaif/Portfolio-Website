'use client';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AboutSection from './AboutSection';
import ResumeSection from './ResumeSection';
import AchievementsSection from './AchievementsSection';
import ProjectsSection from './ProjectsSection';
import BlogSection from './BlogSection';
import ContactSection from './ContactSection';

const VALID_PAGES = ['about', 'resume', 'achievements', 'projects', 'blog', 'contact'];

function getPageFromHash() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  return VALID_PAGES.includes(hash) ? hash : 'about';
}

export default function PortfolioClient({ data }) {
  const [activePage, setActivePage] = useState('about');

  // On mount: read page from URL hash
  useEffect(() => {
    setActivePage(getPageFromHash());

    // Also listen for browser back/forward
    const onHashChange = () => setActivePage(getPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // When page changes: update URL hash
  const navigateTo = (page) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo(0, 0);
  };

  // Track page views
  useEffect(() => {
    if (data?.enableAnalytics === false) return;

    const trackPageView = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        await fetch(`${apiUrl}/api/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'pageview',
            page: activePage,
            referrer: document.referrer || ''
          })
        });
      } catch (err) {
        console.error('Failed to track page view:', err);
      }
    };

    trackPageView();
  }, [activePage, data?.enableAnalytics]);

  // Track clicks globally for elements with data-track-click attribute
  useEffect(() => {
    if (data?.enableAnalytics === false) return;

    const handleGlobalClick = async (e) => {
      const trackable = e.target.closest('[data-track-click]');
      if (!trackable) return;

      const eventData = trackable.getAttribute('data-track-click');
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        await fetch(`${apiUrl}/api/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'click',
            page: activePage,
            eventData: eventData,
            referrer: document.referrer || ''
          })
        });
      } catch (err) {
        console.error('Failed to track click:', err);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [activePage, data?.enableAnalytics]);

  useEffect(() => {
    document.title = `${data.sidebar?.name || 'Portfolio'} - Personal Portfolio`;
    if (data.sidebar?.avatar) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = data.sidebar.avatar;
    }
  }, [data.sidebar?.name, data.sidebar?.avatar]);

  return (
    <main>
      <Sidebar data={data.sidebar} />
      <div className="main-content">
        <Navbar activePage={activePage} setActivePage={navigateTo} />
        <AboutSection data={data.about} active={activePage === 'about'} />
        <ResumeSection data={data.resume} sidebarData={data.sidebar} active={activePage === 'resume'} />
        <AchievementsSection data={data.achievements} active={activePage === 'achievements'} />
        <ProjectsSection data={data.portfolio} active={activePage === 'projects'} />
        <BlogSection data={data.blog} active={activePage === 'blog'} />
        <ContactSection data={data.contact} active={activePage === 'contact'} />
      </div>
    </main>
  );
}
