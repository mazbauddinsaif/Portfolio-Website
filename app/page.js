import PortfolioClient from '@/components/portfolio/PortfolioClient';

export const dynamic = 'force-dynamic';

async function getPortfolioData() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${apiBaseUrl}/api/portfolio`, {
      cache: 'no-store' // or next: { revalidate: 3600 } for ISR caching
    });
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch portfolio data from backend:', error);
    return null;
  }
}

export default async function HomePage() {
  const data = await getPortfolioData();

  if (!data) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        background: 'hsl(240, 2%, 12%)',
        color: 'white',
        fontFamily: 'Poppins, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1>Portfolio Offline</h1>
        <p>Could not connect to the Backend API.</p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          Please verify that the backend server is running and configured correctly.
        </p>
      </div>
    );
  }

  return <PortfolioClient data={data} />;
}
