import BlogPostClient from '@/components/portfolio/BlogPostClient';

export const dynamic = 'force-dynamic';

async function getBlogPost(slug) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${apiBaseUrl}/api/blog/${slug}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch blog post ${slug}:`, error);
    return null;
  }
}

async function getPortfolioData() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${apiBaseUrl}/api/portfolio`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch portfolio data for blog:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) {
    return {
      title: 'Article Not Found - Mazba Uddin Saif',
      description: 'The requested blog post was not found on this site.',
    };
  }

  // Create clean text description from markdown
  const description = post.markdownContent
    ? post.markdownContent.replace(/[#*`_\[\]()]/g, '').slice(0, 150) + '...'
    : 'Technical blog post from Mazba Uddin Saif';

  return {
    title: `${post.title} - Mazba Uddin Saif`,
    description,
    openGraph: {
      title: post.title,
      description,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    }
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const postData = await getBlogPost(slug);
  const data = await getPortfolioData();

  return (
    <BlogPostClient 
      sidebarData={data?.sidebar} 
      postData={postData} 
      enableAnalytics={data?.enableAnalytics}
    />
  );
}
