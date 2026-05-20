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

export default function PortfolioClient({ data }) {
  const [activePage, setActivePage] = useState('about');

  useEffect(() => {
    document.title = `${data.sidebar?.name || 'Portfolio'} - Personal Portfolio`;
  }, [data.sidebar?.name]);

  return (
    <main>
      <Sidebar data={data.sidebar} />
      <div className="main-content">
        <Navbar activePage={activePage} setActivePage={setActivePage} />
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
