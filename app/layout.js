import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider, themeInitScript } from '@/components/ui/ThemeProvider';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { getPortfolioData } from '@/lib/data';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata = {
  metadataBase: new URL('https://mazbauddinsaif.com'),
  title: {
    default: 'Mazba Uddin Saif — Software Developer & CS Researcher',
    template: '%s · Mazba Uddin Saif',
  },
  description:
    'Computer Science undergraduate at North South University. Software developer, multiple-olympiad winner, instructor, and researcher. 45+ certifications and published research.',
  keywords: ['Mazba Uddin Saif', 'Computer Science', 'North South University', 'Software Developer', 'Research', 'Portfolio'],
  authors: [{ name: 'Mazba Uddin Saif' }],
  openGraph: {
    type: 'website',
    title: 'Mazba Uddin Saif — Software Developer & CS Researcher',
    description: 'Portfolio, publications, experience, and 45+ certifications.',
    siteName: 'Mazba Uddin Saif',
  },
  twitter: { card: 'summary_large_image' },
};

export default async function RootLayout({ children }) {
  const data = await getPortfolioData();
  const sidebar = data?.sidebar || {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: sidebar.name || 'Mazba Uddin Saif',
    jobTitle: sidebar.title || 'Software Developer',
    email: sidebar.email,
    address: sidebar.location,
    alumniOf: 'North South University',
    sameAs: (sidebar.socials || []).map((s) => s.url),
  };

  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>
        <ThemeProvider>
          <Header name={sidebar.name} />
          <main>{children}</main>
          <Footer sidebar={sidebar} />
        </ThemeProvider>
      </body>
    </html>
  );
}
