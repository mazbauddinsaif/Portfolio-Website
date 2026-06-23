import { seedData } from './seed-data';

/* Placeholder publications so the section renders before you fill in real
   papers (and before the backend/admin gets a publications field).
   Replace these with your actual papers. */
const DEFAULT_PUBLICATIONS = [
  {
    title: 'Replace with your paper title',
    authors: 'M. U. Saif, Co-author A., Co-author B.',
    venue: 'Conference or journal name',
    year: '2025',
    type: 'Conference',
    abstract:
      'One- or two-sentence abstract / summary of the contribution. Edit this in lib/seed-data.js (publications array) or wire it to the backend later.',
    links: [
      { label: 'PDF', url: '#' },
      { label: 'DOI', url: '#' },
    ],
  },
];

/**
 * Server-side portfolio data loader.
 * Tries the backend API; on any failure falls back to the local seed data
 * so the site always renders (good for previews and for a reliable CV link).
 */
export async function getPortfolioData() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  let data = null;

  try {
    const res = await fetch(`${apiBaseUrl}/api/portfolio`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) data = await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using seed data:', err?.message);
  }

  if (!data) data = seedData;
  if (!data.publications || data.publications.length === 0) {
    data.publications = seedData.publications || DEFAULT_PUBLICATIONS;
  }
  return data;
}

/** Flatten grouped achievements into a single cert list with their group. */
export function flattenCerts(achievements = []) {
  return achievements.flatMap((group) =>
    (group.certs || []).map((c) => ({ ...c, group: group.group, groupTitle: group.title }))
  );
}
