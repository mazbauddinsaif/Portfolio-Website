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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${anton.variable} ${inter.variable} antialiased`}>
        {/* Sets .dark before paint so a dark-mode visitor never sees a white flash. */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
