import SiteShell from '@/components/site/SiteShell';

export const dynamic = 'force-dynamic';

async function getPortfolioData() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${apiBaseUrl}/api/portfolio`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch portfolio data from backend:', error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export default async function HomePage() {
  const data = await getPortfolioData();

  if (!data) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="display text-5xl">Portfolio Offline</h1>
        <p className="text-sm text-ink-muted">Could not connect to the Backend API.</p>
        <p className="text-xs text-ink-faint">
          Please verify that the backend server is running and configured correctly.
        </p>
      </div>
    );
  }

  return <SiteShell data={data} />;
}
