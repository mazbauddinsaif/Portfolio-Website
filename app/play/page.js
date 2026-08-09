import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import PlayChess from '@/components/site/PlayChess';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import ThemeScope from '@/components/site/ThemeScope';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Play Chess — Mazba Uddin Saif',
  description: 'Play a game of chess against Mazba Uddin Saif’s browser chess engine.',
};

async function getPortfolioData() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${apiBaseUrl}/api/portfolio`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function PlayPage() {
  const data = await getPortfolioData();

  return (
    <ThemeScope theme={data?.siteTheme}>
      <Nav name={data?.sidebar?.name} />
      <main className="mx-auto w-full max-w-7xl px-5 pt-28 pb-20 md:px-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs font-medium tracking-wider text-ink-muted uppercase transition-colors hover:text-accent-text"
        >
          <FiArrowLeft size={13} /> Back to Portfolio
        </Link>

        <header className="mb-12">
          <p className="eyebrow mb-3">Play With Me</p>
          <h1 className="display text-4xl sm:text-6xl">Care for a game?</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
            You are white, I am black. The engine runs entirely in your browser — negamax with
            alpha-beta pruning, no server round trips. Pick a difficulty and drag a piece to begin.
          </p>
        </header>

        <PlayChess />
      </main>
      <Footer sidebar={data?.sidebar} />
    </ThemeScope>
  );
}
