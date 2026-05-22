'use client';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Sidebar from './Sidebar';
import 'highlight.js/styles/github-dark.css';

export default function BlogPostClient({ sidebarData, postData }) {
  
  // Track page view for this specific blog post
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        await fetch(`${apiUrl}/api/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'pageview',
            page: `blog_${postData.slug}`,
            referrer: document.referrer || ''
          })
        });
      } catch (err) {
        console.error('Failed to track blog page view:', err);
      }
    };

    trackPageView();
  }, [postData.slug]);

  if (!postData) {
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
        <h1>Article Not Found</h1>
        <p>The requested blog post could not be found.</p>
        <a href="/#blog" style={{
          color: 'var(--orange-yellow-crayola)',
          textDecoration: 'underline',
          fontSize: '14px'
        }}>
          Back to Blog
        </a>
      </div>
    );
  }

  return (
    <main>
      <Sidebar data={sidebarData} />
      
      <div className="main-content">
        {/* Navigation / Header */}
        <nav className="navbar" style={{ position: 'relative', width: 'auto', marginBottom: '20px' }}>
          <ul className="navbar-list" style={{ justifyContent: 'flex-start' }}>
            <li className="navbar-item">
              <a href="/#blog" className="navbar-link active" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ion-icon name="arrow-back-outline" style={{ fontSize: '16px' }}></ion-icon>
                Back to Blog
              </a>
            </li>
          </ul>
        </nav>

        {/* Blog Post Main Page */}
        <article className="blog active" data-page="blog-post">
          <header>
            <div className="blog-meta" style={{ marginBottom: '10px' }}>
              <p className="blog-category">
                {postData.tags?.length > 0 ? postData.tags.join(', ') : 'Tech'}
              </p>
              <span className="dot"></span>
              <time dateTime={postData.createdAt}>
                {new Date(postData.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>
            <h2 className="h2 article-title">{postData.title}</h2>
          </header>

          <section className="blog-post-detail">
            {postData.coverImage && (
              <figure className="blog-banner-box" style={{
                height: 'auto',
                maxHeight: '400px',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '25px',
                background: 'var(--onyx)'
              }}>
                <img 
                  src={postData.coverImage} 
                  alt={postData.title} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </figure>
            )}

            <div className="markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeHighlight]}
              >
                {postData.markdownContent}
              </ReactMarkdown>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
