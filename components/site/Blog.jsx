'use client';
import { useEffect, useState } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import Section from './ui/Section';
import Reveal from './ui/Reveal';
import SafeImage from './ui/SafeImage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getExcerpt = (markdown) => {
  if (!markdown) return '';
  return markdown.replace(/[#*`_\[\]()]/g, '').slice(0, 140) + (markdown.length > 140 ? '…' : '');
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/blog`)
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Section always renders (nav links to it); body states vary.
  return (
    <Section
      id="blog"
      title="Writing"
      eyebrow="Blog"
      className="min-h-[calc(100svh-4rem)]"
    >
      {loading ? (
        <p className="py-10 text-center text-sm text-ink-faint">Loading articles…</p>
      ) : posts.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-faint">No posts published yet.</p>
      ) : (
        <ul className="flex flex-col">
          {posts.map((post, i) => (
            <Reveal as="li" key={post._id} delay={i * 0.04}>
              <a
                href={`/blog/${post.slug}`}
                className="group grid gap-5 border-b border-line py-8 first:pt-0 transition-colors sm:grid-cols-[200px_1fr_auto] sm:items-center"
                data-track-click={`read_blog_${post.slug}`}
              >
                <div className="aspect-[16/10] overflow-hidden rounded border border-line bg-bg-2 sm:aspect-[16/11]">
                  {post.coverImage ? (
                    <SafeImage
                      src={post.coverImage}
                      alt={post.title}
                      loading={i < 1 ? 'eager' : 'lazy'}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="size-full bg-bg-2" />
                  )}
                </div>
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {(post.tags?.length ? post.tags.slice(0, 3) : ['Tech']).map((tag, ti) => (
                      <span key={ti} className="tag">
                        {String(tag).trim()}
                      </span>
                    ))}
                    <time className="text-xs text-ink-faint" dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <h3 className="text-lg font-semibold transition-colors group-hover:text-accent-text">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-muted">
                    {getExcerpt(post.markdownContent)}
                  </p>
                </div>
                <FiArrowUpRight
                  size={22}
                  className="hidden text-ink-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text sm:block"
                />
              </a>
            </Reveal>
          ))}
        </ul>
      )}
    </Section>
  );
}
