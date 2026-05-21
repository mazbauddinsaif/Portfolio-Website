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
        <ResumeSection data={data.resume} active={activePage === 'resume'} />
        <AchievementsSection data={data.achievements} active={activePage === 'achievements'} />
        <ProjectsSection data={data.portfolio} active={activePage === 'projects'} />
        <BlogSection data={data.blog} active={activePage === 'blog'} />
        <ContactSection data={data.contact} active={activePage === 'contact'} />
      </div>
    </main>
  );
}
