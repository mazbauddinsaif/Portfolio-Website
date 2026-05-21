'use client';
import { useState, useEffect } from 'react';

function formatRepoName(name) {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function deriveCategory(repo) {
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  const lang = (repo.language || '').toLowerCase();
  const webTopics = ['web','website','html','css','javascript','typescript','frontend','react','vue','angular','nextjs','nodejs','express','django','flask','api','full-stack','fullstack'];
  const appTopics = ['cli','tool','automation','script','desktop','gui','electron','android','ios','mobile','game'];
  const webLangs = ['javascript','typescript','html','css','php'];
  const appLangs = ['c','c++','c#','java','rust','go','swift','kotlin','python'];
  if (topics.some(t => webTopics.includes(t))) return 'web development';
  if (topics.some(t => appTopics.includes(t))) return 'applications';
  if (webLangs.includes(lang)) return 'web development';
  if (appLangs.includes(lang)) return 'applications';
  return 'web development';
}

function deriveTechStack(repo) {
  const stack = [];
  if (repo.language) stack.push(repo.language);
  const topicMap = {
    'react':'React','nextjs':'Next.js','nodejs':'Node.js','express':'Express',
    'django':'Django','flask':'Flask','mongodb':'MongoDB','tailwindcss':'Tailwind CSS',
    'typescript':'TypeScript','docker':'Docker','postgresql':'PostgreSQL',
  };
  (repo.topics || []).forEach(t => {
    const display = topicMap[t.toLowerCase()];
    if (display && !stack.includes(display) && display !== repo.language) stack.push(display);
  });
  return stack.slice(0, 5);
}

export default function ProjectsSection({ data, active }) {
  const [projects, setProjects] = useState(data?.projects || []);
  const [filterCategories, setFilterCategories] = useState(data?.filterCategories || ['All']);
  const [activeFilter, setActiveFilter] = useState('all');
  const [contribHtml, setContribHtml] = useState('');
  const [ghStats, setGhStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data?.github?.username) { setLoading(false); return; }
    const cfg = data.github;

    // Fetch GitHub repos & stats from backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://personal-backend-2e63.onrender.com';
    fetch(`${apiUrl}/api/portfolio/github`)
      .then(r => r.json())
      .then(resData => {
        if (resData.enabled) {
          setGhStats(resData.profile);

          const overrides = cfg.overrides || {};
          const mappedProjects = resData.repositories.map(repo => {
            const ov = overrides[repo.name] || {};
            const mockRepo = {
              topics: [],
              language: repo.language
            };
            return {
              title: ov.title || formatRepoName(repo.name),
              category: ov.category || deriveCategory(mockRepo),
              image: ov.image || `https://opengraph.githubassets.com/1/${cfg.username}/${repo.name}`,
              description: ov.description || repo.description,
              techStack: ov.techStack || (repo.language ? [repo.language] : []),
              githubUrl: repo.url,
              demoUrl: ov.demoUrl !== undefined ? ov.demoUrl : repo.homepage,
              deepDiveUrl: ov.deepDiveUrl || '',
            };
          });

          const allProjects = [...mappedProjects, ...(data.projects || [])];
          const cats = ['All'];
          allProjects.forEach(p => {
            const cat = p.category.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            if (!cats.includes(cat)) cats.push(cat);
          });
          setProjects(allProjects);
          setFilterCategories(cats);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch GitHub contributions
    fetch(`https://github-contributions-api.jogruber.de/v4/${cfg.username}?y=last`)
      .then(r => r.json())
      .then(json => {
        const contribs = json.contributions;
        const totalCount = contribs.reduce((s, d) => s + d.count, 0);
        const firstDay = new Date(contribs[0].date + 'T00:00:00');
        const cells = [];
        for (let p = 0; p < firstDay.getDay(); p++) cells.push(null);
        contribs.forEach(c => cells.push(c));
        while (cells.length % 7 !== 0) cells.push(null);

        const monthLabels = [];
        let lastMonth = -1;
        cells.forEach((c, i) => {
          if (!c) return;
          const d = new Date(c.date + 'T00:00:00');
          const m = d.getMonth();
          if (m !== lastMonth) {
            monthLabels.push({ weekIdx: Math.floor(i / 7), label: d.toLocaleString('default', { month: 'short' }) });
            lastMonth = m;
          }
        });

        const cellsHtml = cells.map(c => {
          if (!c) return '<div class="contrib-cell contrib-empty"></div>';
          const tip = c.count === 0 ? `No contributions on ${c.date}` : `${c.count} contribution${c.count === 1 ? '' : 's'} on ${c.date}`;
          return `<div class="contrib-cell contrib-level-${c.level}" title="${tip}"></div>`;
        }).join('');

        const monthsHtml = monthLabels.map(ml =>
          `<span style="left:${ml.weekIdx * 13}px">${ml.label}</span>`
        ).join('');

        setContribHtml(`<div class="contrib-wrap"><div class="contrib-header"><span class="contrib-total">${totalCount.toLocaleString()} contributions in the last year</span><a class="contrib-gh-link" href="https://github.com/${cfg.username}" target="_blank" rel="noopener"><ion-icon name="logo-github"></ion-icon> @${cfg.username}</a></div><div class="contrib-body"><div class="contrib-days"><span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span></div><div class="contrib-main"><div class="contrib-months">${monthsHtml}</div><div class="contrib-grid">${cellsHtml}</div></div></div><div class="contrib-legend"><span>Less</span><div class="contrib-cell contrib-level-0"></div><div class="contrib-cell contrib-level-1"></div><div class="contrib-cell contrib-level-2"></div><div class="contrib-cell contrib-level-3"></div><div class="contrib-cell contrib-level-4"></div><span>More</span></div></div>`);
      })
      .catch(() => {});
  }, [data]);

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <article className={`portfolio${active ? ' active' : ''}`} data-page="projects">
      <header><h2 className="h2 article-title">Projects</h2></header>

      {contribHtml && (
        <section id="github-contributions-section">
          <div id="github-contributions" dangerouslySetInnerHTML={{ __html: contribHtml }} />
        </section>
      )}

      {/* GitHub Stats Dashboard */}
      {ghStats && (
        <section className="github-stats-section">
          <div className="github-stats-grid">
            <div className="github-stat-card">
              <div className="github-stat-icon">
                <ion-icon name="star-outline"></ion-icon>
              </div>
              <div className="github-stat-info">
                <span className="github-stat-value">{ghStats.totalStars}</span>
                <span className="github-stat-label">Total Stars</span>
              </div>
            </div>

            <div className="github-stat-card">
              <div className="github-stat-icon">
                <ion-icon name="git-branch-outline"></ion-icon>
              </div>
              <div className="github-stat-info">
                <span className="github-stat-value">{ghStats.totalForks}</span>
                <span className="github-stat-label">Repo Forks</span>
              </div>
            </div>

            <div className="github-stat-card">
              <div className="github-stat-icon">
                <ion-icon name="folder-open-outline"></ion-icon>
              </div>
              <div className="github-stat-info">
                <span className="github-stat-value">{ghStats.publicRepos}</span>
                <span className="github-stat-label">Public Repos</span>
              </div>
            </div>

            <div className="github-stat-card">
              <div className="github-stat-icon">
                <ion-icon name="people-outline"></ion-icon>
              </div>
              <div className="github-stat-info">
                <span className="github-stat-value">{ghStats.followers}</span>
                <span className="github-stat-label">Followers</span>
              </div>
            </div>
          </div>

          {ghStats.topLanguages && ghStats.topLanguages.length > 0 && (
            <div className="github-languages-card">
              <span className="github-languages-title">Primary Tech Languages:</span>
              <div className="github-languages-list">
                {ghStats.topLanguages.map((lang, index) => (
                  <span key={index} className="tech-badge">{lang}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="projects">
        <ul className="filter-list">
          {filterCategories.map((cat, i) => (
            <li key={i} className="filter-item">
              <button
                className={activeFilter === cat.toLowerCase() ? 'active' : ''}
                onClick={() => setActiveFilter(cat.toLowerCase())}
              >{cat}</button>
            </li>
          ))}
        </ul>

        {loading ? (
          <div className="projects-loading">
            <div className="loading-dots"><span></span><span></span><span></span></div>
          </div>
        ) : (
          <ul className="project-list">
            {filteredProjects.map((p, i) => (
              <li key={i} className="project-item active" data-category={p.category}>
                <figure className="project-img">
                  <img src={p.image} alt={p.title} loading="lazy" />
                </figure>
                <div className="project-content">
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.description}</p>
                  <div className="tech-badge-list">
                    {(p.techStack || []).map((t, ti) => (
                      <span key={ti} className="tech-badge">{t}</span>
                    ))}
                  </div>
                  <div className="project-actions">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="project-action-btn btn-code">
                        <ion-icon name="logo-github"></ion-icon> View Code
                      </a>
                    )}
                    {p.demoUrl && (
                      <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="project-action-btn btn-demo">
                        <ion-icon name="open-outline"></ion-icon> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
