import { getPortfolioData } from '@/lib/data';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Publications from '@/components/sections/Publications';
import Certifications from '@/components/sections/Certifications';
import Contact from '@/components/sections/Contact';

export default async function HomePage() {
  const data = await getPortfolioData();
  const sidebar = data?.sidebar || {};
  const achievements = data?.achievements || [];
  const publications = data?.publications || [];

  const totalCerts = achievements.reduce((n, g) => n + (g.certs?.length || 0), 0);

  const stats = [
    { num: `${totalCerts}+`, label: 'Certifications & awards' },
    { num: `${publications.length}`, label: 'Publications' },
    { num: '37th', label: 'NSU admission rank' },
    { num: '75%', label: 'Merit scholarship' },
  ];

  return (
    <>
      <Hero sidebar={sidebar} stats={stats} />
      <About about={data?.about || {}} />
      <Experience resume={data?.resume || {}} />
      <Publications publications={publications} preview />
      <Certifications achievements={achievements} />
      <Contact sidebar={sidebar} />
    </>
  );
}
