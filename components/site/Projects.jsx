'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  FiGithub,
  FiExternalLink,
  FiStar,
  FiFolder,
  FiUsers,
  FiActivity,
  FiGitBranch,
  FiArrowUpRight,
} from 'react-icons/fi';
import Section from './ui/Section';
import Reveal from './ui/Reveal';
import Modal from './ui/Modal';
import SafeImage from './ui/SafeImage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/* GitHub's language colors for the repo-card dots. */
const LANG_COLORS = {
  javascript: '#f1e05a',
  typescript: '#3178c6',
  python: '#3572A5',
  c: '#555555',
  'c++': '#f34b7d',
  'c#': '#178600',
  java: '#b07219',
  html: '#e34c26',
  css: '#563d7c',
  php: '#4F5D95',
  go: '#00ADD8',
  rust: '#dea584',
  kotlin: '#A97BFF',
  swift: '#F05138',
  'jupyter notebook': '#DA5B0B',
  shell: '#89e051',
};

function langColor(lang) {
  return LANG_COLORS[(lang || '').toLowerCase()] || 'var(--c-accent)';
}

function formatRepoName(name) {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveCategory(lang) {
  const appLangs = ['c', 'c++', 'c#', 'java', 'rust', 'go', 'swift', 'kotlin', 'python'];
  return appLangs.includes((lang || '').toLowerCase()) ? 'applications' : 'web development';
}

function titleCase(s) {
  return s.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/* Compact stat card: icon + big number + label (ilhamriski-style row of four). */
function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="grid size-10 shrink-0 place-items-center rounded border border-line bg-bg-2 text-accent-text">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="display text-2xl sm:text-3xl">{value ?? '—'}</p>
        <p className="truncate text-[0.6875rem] tracking-wider text-ink-faint uppercase">{label}</p>
      </div>
    </div>
  );
}

/* GitHub-style contribution heatmap, restyled to the accent ramp. */
function ContribGraph({ username, onTotal }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!username) return;
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((r) => r.json())
      .then((json) => {
        const contribs = json.contributions;
        if (!Array.isArray(contribs)) return;
        const total = contribs.reduce((s, d) => s + d.count, 0);
        const cells = [];
        const firstDay = new Date(contribs[0].date + 'T00:00:00');
        for (let p = 0; p < firstDay.getDay(); p++) cells.push(null);
        contribs.forEach((c) => cells.push(c));
        while (cells.length % 7 !== 0) cells.push(null);

        const months = [];
        let lastMonth = -1;
        cells.forEach((c, i) => {
          if (!c) return;
          const d = new Date(c.date + 'T00:00:00');
          if (d.getMonth() !== lastMonth) {
            months.push({ week: Math.floor(i / 7), label: d.toLocaleString('default', { month: 'short' }) });
            lastMonth = d.getMonth();
          }
        });
        setData({ cells, months, total });
        onTotal?.(total);
      })
      .catch(() => {});
  }, [username, onTotal]);

  if (!data) return null;

  return (
    <div className="card overflow-hidden p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">
          {data.total.toLocaleString()} contributions in the last year
        </span>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-accent-text"
        >
          <FiGithub size={13} /> @{username}
        </a>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="relative mb-1 h-4" style={{ width: `${(data.cells.length / 7) * 13}px` }}>
          {data.months.map((m, i) => (
            <span key={i} className="absolute text-[0.625rem] text-ink-faint" style={{ left: `${m.week * 13}px` }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="contrib-grid">
          {data.cells.map((c, i) =>
            c ? (
              <div
                key={i}
                className={`contrib-cell contrib-level-${c.level}`}
                title={`${c.count} contribution${c.count === 1 ? '' : 's'} on ${c.date}`}
              />
            ) : (
              <div key={i} className="contrib-cell contrib-empty" />
            )
          )}
        </div>
        <div className="mt-2 flex items-center justify-end gap-1 text-[0.625rem] text-ink-faint">
          <span className="mr-1">Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} className={`contrib-cell contrib-level-${l}`} />
          ))}
          <span className="ml-1">More</span>
        </div>
      </div>
    </div>
  );
}

/* Plain repo card: name, description, language dot + stars + forks. */
function RepoCard({ repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card group flex flex-col p-5 transition-colors hover:border-line-strong"
      data-track-click={`open_repo_${repo.name}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="min-w-0 truncate text-sm font-semibold transition-colors group-hover:text-accent-text">
          {repo.name}
        </h4>
        <FiArrowUpRight size={15} className="shrink-0 text-ink-faint transition-colors group-hover:text-accent-text" />
      </div>
      <p className="mt-2 line-clamp-2 flex-1 text-[0.8125rem] leading-relaxed text-ink-muted">
        {repo.description || 'No description.'}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-ink-faint">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: langColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <FiStar size={12} /> {repo.stars ?? 0}
        </span>
        <span className="inline-flex items-center gap-1">
          <FiGitBranch size={12} /> {repo.forks ?? 0}
        </span>
      </div>
    </a>
  );
}

export default function Projects({ portfolio }) {
  const [projects, setProjects] = useState(portfolio?.projects || []);
  const [repos, setRepos] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [filter, setFilter] = useState('all');
  const [ghStats, setGhStats] = useState(null);
  const [contribTotal, setContribTotal] = useState(null);
  const [loading, setLoading] = useState(Boolean(portfolio?.github?.username));
  const [selected, setSelected] = useState(null);

  const close = useCallback(() => setSelected(null), []);
  const onTotal = useCallback((t) => setContribTotal(t), []);
  const username = portfolio?.github?.username;

  useEffect(() => {
    if (!username) return;
    fetch(`${API_URL}/api/portfolio/github`)
      .then((r) => r.json())
      .then((res) => {
        if (res.enabled) {
          setGhStats(res.profile);
          const overrides = res.repoOverrides || {};
          const active = res.repositories.filter((repo) => {
            const ov = overrides[repo.name];
            return !ov || ov.active !== false;
          });
          setRepos(active);
          const mapped = active.map((repo) => {
            const ov = overrides[repo.name] || {};
            return {
              title: ov.title || formatRepoName(repo.name),
              category: ov.category || deriveCategory(repo.language),
              image: ov.thumbnail || `https://opengraph.githubassets.com/1/${username}/${repo.name}`,
              description: ov.description || repo.description || '',
              techStack: repo.language ? [repo.language] : [],
              githubUrl: repo.url,
              demoUrl: ov.demoUrl !== undefined ? ov.demoUrl : repo.homepage || '',
            };
          });
          const all = [...mapped, ...(portfolio?.projects || [])];
          const cats = ['All'];
          all.forEach((p) => {
            const c = titleCase(p.category || 'web development');
            if (!cats.includes(c)) cats.push(c);
          });
          setProjects(all);
          setCategories(cats);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username, portfolio]);

  const visible = filter === 'all' ? projects : projects.filter((p) => (p.category || '').toLowerCase() === filter);
  const topRepos = repos.slice(0, 6);

  return (
    <Section id="projects" title="My Works" eyebrow="GitHub + Projects">
      {/* ── GitHub block first: stats row, heatmap, selected repositories ── */}
      {username && (
        <div className="mb-20">
          <Reveal className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={FiFolder} value={ghStats?.publicRepos} label="Public Repos" />
            <StatCard icon={FiStar} value={ghStats?.totalStars} label="Total Stars" />
            <StatCard icon={FiUsers} value={ghStats?.followers} label="Followers" />
            <StatCard
              icon={FiActivity}
              value={contribTotal == null ? undefined : contribTotal.toLocaleString()}
              label="Contributions / yr"
            />
          </Reveal>

          <Reveal delay={0.08} className="mt-4">
            <ContribGraph username={username} onTotal={onTotal} />
          </Reveal>

          {topRepos.length > 0 && (
            <>
              <Reveal className="mt-10 mb-5 flex items-end justify-between gap-4">
                <p className="eyebrow">Selected repositories</p>
                <a
                  href={`https://github.com/${username}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-accent-text"
                >
                  All repositories <FiArrowUpRight size={13} />
                </a>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topRepos.map((r, i) => (
                  <Reveal key={r.name} delay={(i % 3) * 0.06}>
                    <RepoCard repo={r} />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Works underneath: numbered project cards ── */}
      <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <p className="eyebrow">Selected works</p>
        <ul className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => setFilter(c.toLowerCase())}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  filter === c.toLowerCase()
                    ? 'border-accent bg-accent text-accent-ink'
                    : 'border-line text-ink-muted hover:border-line-strong hover:text-ink'
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      {loading ? (
        <div className="flex justify-center gap-1.5 py-16">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2 animate-bounce rounded-full bg-accent"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      ) : (
        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {visible.map((p, i) => (
            <Reveal as="li" key={`${p.title}-${i}`} delay={(i % 2) * 0.08}>
              <button
                type="button"
                onClick={() => setSelected(p)}
                className="group block w-full text-left"
                data-track-click={`open_project_${p.title}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded border border-line bg-bg-2">
                  <SafeImage
                    src={p.image}
                    alt={p.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-3 right-3 grid size-9 translate-y-1 place-items-center rounded-full bg-accent text-accent-ink opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    <FiArrowUpRight size={15} />
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="display text-lg text-accent-text">
                    _{String(i + 1).padStart(2, '0')}.
                  </span>
                  <h3 className="text-lg font-semibold transition-colors group-hover:text-accent-text">
                    {p.title}
                  </h3>
                </div>
                {p.description && (
                  <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-muted">
                    {p.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(p.techStack || []).map((t, ti) => (
                    <span key={ti} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            </Reveal>
          ))}
        </ul>
      )}

      <Modal open={Boolean(selected)} onClose={close} label={selected?.title}>
        {selected && (
          <>
            <div className="aspect-[16/9] w-full overflow-hidden border-b border-line bg-bg-2">
              <SafeImage src={selected.image} alt={selected.title} loading="eager" className="size-full object-cover" />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-1.5">
                {(selected.techStack || []).map((t, i) => (
                  <span key={i} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="display mt-4 text-3xl">{selected.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {selected.description || 'No description available.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {selected.githubUrl && (
                  <a
                    href={selected.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    data-track-click={`view_code_${selected.title}`}
                  >
                    <FiGithub size={14} /> View Code
                  </a>
                )}
                {selected.demoUrl && (
                  <a
                    href={selected.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent"
                    data-track-click={`view_demo_${selected.title}`}
                  >
                    <FiExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </Modal>
    </Section>
  );
}
