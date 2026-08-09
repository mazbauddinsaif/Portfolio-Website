import { Anton, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
});

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Mazba Uddin Saif — Software Developer',
  description:
    'Personal portfolio of Mazba Uddin Saif — Junior Software Developer, Instructor, and Computer Science undergraduate at North South University.',
};

/* The admin-chosen light/dark default. theme-init.js reads it off <html>
   before paint, so it has to be server-rendered into the markup. Falls back
   to dark if the backend is unreachable. */
async function getDefaultMode() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${apiBaseUrl}/api/portfolio`, { cache: 'no-store' });
    if (!res.ok) return 'dark';
    const data = await res.json();
    return data?.defaultMode === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export default async function RootLayout({ children }) {
  const defaultMode = await getDefaultMode();

  return (
    <html lang="en" data-default-mode={defaultMode} suppressHydrationWarning>
      <body className={`${anton.variable} ${inter.variable} antialiased`}>
        {/* Sets .dark before paint so the visitor never sees the wrong theme. */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
