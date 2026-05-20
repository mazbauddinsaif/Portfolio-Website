'use client';

export default function BlogSection({ data, active }) {
  if (!data) return null;

  return (
    <article className={`blog${active ? ' active' : ''}`} data-page="blog">
      <header><h2 className="h2 article-title">Blog</h2></header>
      <section className="blog-posts">
        <ul className="blog-posts-list">
          {(data.posts || []).filter(p => p.title).map((post, i) => (
            <li key={i} className="blog-post-item">
              <a href={post.url || '#'}>
                <figure className="blog-banner-box">
                  {post.image && <img src={post.image} alt={post.title} loading="lazy" />}
                </figure>
                <div className="blog-content">
                  <div className="blog-meta">
                    <p className="blog-category">{post.category}</p>
                    <span className="dot"></span>
                    <time dateTime={post.date?.datetime}>{post.date?.display}</time>
                  </div>
                  <h3 className="h3 blog-item-title">{post.title}</h3>
                  <p className="blog-text">{post.excerpt}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
