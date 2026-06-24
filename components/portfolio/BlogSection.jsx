'use client';
import { useState, useEffect } from 'react';
import SafeImage from './SafeImage';

const getExcerpt = (markdown) => {
  if (!markdown) return '';
  return markdown
    .replace(/[#*`_\[\]()]/g, '') // remove simple markdown characters
    .slice(0, 120) + (markdown.length > 120 ? '...' : '');
};

export default function BlogSection({ data, active }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiBaseUrl}/api/blog`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <article className={`blog${active ? ' active' : ''}`} data-page="blog">
      <header><h2 className="h2 article-title">Blog</h2></header>
      
      <section className="blog-posts">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '14px' }}>
            Loading articles...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '14px' }}>
            No blog posts published yet.
          </div>
        ) : (
          <ul className="blog-posts-list">
            {posts.map((post) => (
              <li key={post._id} className="blog-post-item" data-track-click={`read_blog_${post.slug}`}>
                <a href={`/blog/${post.slug}`}>
                  <figure className="blog-banner-box">
                    {post.coverImage ? (
                      <SafeImage src={post.coverImage} alt={post.title} loading="lazy" />
                    ) : (
                      <div className="blog-banner-placeholder" style={{
                        height: '100%',
                        width: '100%',
                        background: 'linear-gradient(135deg, hsl(240, 2%, 20%), hsl(240, 2%, 15%))'
                      }} />
                    )}
                  </figure>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <div className="blog-tags">
                        {post.tags?.length > 0 ? (
                          post.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="blog-tag-pill">{tag.trim()}</span>
                          ))
                        ) : (
                          <span className="blog-tag-pill">Tech</span>
                        )}
                      </div>
                      <time className="blog-time" dateTime={post.createdAt}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                    <h3 className="h3 blog-item-title">{post.title}</h3>
                    <p className="blog-text">{getExcerpt(post.markdownContent)}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
