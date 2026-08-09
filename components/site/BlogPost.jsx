'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { FiArrowLeft } from 'react-icons/fi';
import Nav from './Nav';
import Footer from './Footer';
import ThemeScope from './ThemeScope';
import SafeImage from './ui/SafeImage';
import 'highlight.js/styles/github-dark.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function BlogPost({ sidebarData, postData, enableAnalytics, siteTheme }) {
  useEffect(() => {
    if (enableAnalytics === false || !postData?.slug) return;
    fetch(`${API_URL}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'pageview',
        page: `blog_${postData.slug}`,
        referrer: document.referrer || '',
      }),
    }).catch(() => {});
  }, [postData?.slug, enableAnalytics]);

  if (!postData) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="display text-5xl">Not Found</h1>
        <p className="text-sm text-ink-muted">The requested blog post could not be found.</p>
        <Link href="/#blog" className="btn-ghost mt-2">
          <FiArrowLeft size={13} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <ThemeScope theme={siteTheme}>
      <Nav name={sidebarData?.name} />
      <main className="mx-auto w-full max-w-3xl px-5 pt-28 pb-20 md:px-8">
        <Link
          href="/#blog"
          className="mb-10 inline-flex items-center gap-2 text-xs font-medium tracking-wider text-ink-muted uppercase transition-colors hover:text-accent-text"
        >
          <FiArrowLeft size={13} /> Back to Blog
        </Link>

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {(postData.tags?.length ? postData.tags : ['Tech']).map((tag, i) => (
              <span key={i} className="tag">
                {String(tag).trim()}
              </span>
            ))}
            <time className="text-xs text-ink-faint" dateTime={postData.createdAt}>
              {new Date(postData.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
          <h1 className="display text-4xl sm:text-5xl">{postData.title}</h1>
        </header>

        {postData.coverImage && (
          <div className="mb-10 max-h-[420px] overflow-hidden rounded border border-line">
            <SafeImage src={postData.coverImage} alt={postData.title} loading="eager" className="w-full object-cover" />
          </div>
        )}

        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {postData.markdownContent}
          </ReactMarkdown>
        </div>
      </main>
      <Footer sidebar={sidebarData} />
    </ThemeScope>
  );
}
