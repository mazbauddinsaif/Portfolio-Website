import ResearchGallery from '@/components/site/ResearchGallery';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Research — Mazba Uddin Saif',
  description: 'Research projects and ongoing investigations.',
};

async function getPortfolioData() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${apiBaseUrl}/api/portfolio`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`API returned status ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch portfolio data from backend:', error);
    return null;
  }
}

export default async function ResearchPage() {
  const data = await getPortfolioData();

  if (!data) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="display text-5xl">Portfolio Offline</h1>
        <p className="text-sm text-ink-muted">Could not connect to the Backend API.</p>
      </div>
    );
  }

  return <ResearchGallery data={data} kind="research" />;
}
