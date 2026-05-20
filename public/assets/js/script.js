'use strict';


// ─────────────────────────────────────────────────────────────────────────────
// RENDER FUNCTIONS — populate the DOM from window.portfolioData
// These must run before any querySelectorAll calls below.
// ─────────────────────────────────────────────────────────────────────────────

function renderSidebar(data) {
  var d = data.sidebar;

  var avatarEl = document.getElementById('sidebar-avatar');
  avatarEl.src = d.avatar;
  avatarEl.alt = d.name;

  var avatarBox = document.querySelector('.avatar-box');
  if (d.avatarShape) { avatarBox.classList.add(d.avatarShape); }

  var nameEl = document.getElementById('sidebar-name');
  nameEl.textContent = d.name;
  nameEl.title = d.name;

  document.getElementById('sidebar-title').textContent = d.title;

  var emailEl = document.getElementById('sidebar-email');
  emailEl.href = 'mailto:' + d.email;
  emailEl.textContent = d.email;

  var phoneEl = document.getElementById('sidebar-phone');
  phoneEl.href = 'tel:' + d.phone;
  phoneEl.textContent = d.phoneDisplay;

  document.getElementById('sidebar-location').textContent = d.location;

  document.getElementById('sidebar-socials').innerHTML = d.socials.map(function (s) {
    return '<li class="social-item"><a href="' + s.url + '" class="social-link" target="_blank"><ion-icon name="' + s.icon + '"></ion-icon></a></li>';
  }).join('');
}

function renderAbout(data) {
  var d = data.about;

  document.getElementById('about-paragraphs').innerHTML =
    d.paragraphs.map(function (p) { return '<p>' + p + '</p>'; }).join('');

  document.getElementById('about-services').innerHTML = d.services.map(function (s) {
    return '<li class="service-item">' +
      '<div class="service-icon-box"><img src="' + s.icon + '" alt="' + s.iconAlt + '" width="40"></div>' +
      '<div class="service-content-box"><h4 class="h4 service-item-title">' + s.title + '</h4>' +
      '<p class="service-item-text">' + s.description + '</p></div>' +
      '</li>';
  }).join('');

  // Testimonials — only render if data exists (can be commented out in portfolio-data.js)
  var testimonialsList = d.testimonials || [];
  var testimonialsEl = document.getElementById('about-testimonials');
  if (testimonialsEl) {
    testimonialsEl.innerHTML = testimonialsList.map(function (t) {
      return '<li class="testimonials-item">' +
        '<div class="content-card" data-testimonials-item>' +
        '<figure class="testimonials-avatar-box">' +
        '<img src="' + t.avatar + '" alt="' + t.name + '" width="60" data-testimonials-avatar>' +
        '</figure>' +
        '<h4 class="h4 testimonials-item-title" data-testimonials-title>' + t.name + '</h4>' +
        '<div class="testimonials-text" data-testimonials-text><p>' + t.text + '</p></div>' +
        '</div></li>';
    }).join('');
  }

  // Worked With
  var workedWithData = d.workedWithList || [];
  var workedWithEl = document.getElementById('about-worked-with');
  if (workedWithEl) workedWithEl.innerHTML = workedWithData.map(function (c) {
    return '<li class="worked-with-item"><a href="' + c.url + '" target="_blank" rel="noopener"><img src="' + c.logo + '" alt="organization logo"></a></li>';
  }).join('');
}

function renderResume(data) {
  var d = data.resume;

  document.getElementById('resume-education').innerHTML = d.education.map(function (e) {
    var logoHtml = e.logo
      ? '<img src="' + e.logo + '" alt="' + e.institution + ' logo" class="exp-org-logo">'
      : '<div class="exp-org-logo-placeholder"></div>';
    var headerInner = logoHtml +
      '<div class="exp-org-info">' +
      '<h4 class="h4 timeline-item-title">' + e.institution + '</h4>' +
      '<span>' + e.period + '</span>' +
      '</div>';
    var headerContent = e.url
      ? '<a href="' + e.url + '" class="exp-org-link" target="_blank" rel="noopener">' + headerInner + '</a>'
      : headerInner;
    return '<li class="timeline-item">' +
      '<div class="exp-org-header">' + headerContent + '</div>' +
      '<p class="timeline-text">' + e.description + '</p>' +
      '</li>';
  }).join('');

  document.getElementById('resume-experience').innerHTML = d.experience.map(function (org) {
    var metaParts = [];
    if (org.type) metaParts.push(org.type);
    metaParts.push(org.period);
    var logoHtml = org.logo
      ? '<img src="' + org.logo + '" alt="' + org.organization + ' logo" class="exp-org-logo">'
      : '<div class="exp-org-logo-placeholder"></div>';
    var rolesHtml = org.roles.map(function (r) {
      var locHtml = r.location ? '<p class="exp-sub-role-location">' + r.location + '</p>' : '';
      var descHtml = r.description ? '<p class="timeline-text">' + r.description + '</p>' : '';
      return '<li class="exp-sub-role">' +
        '<h5 class="exp-sub-role-title">' + r.role + '</h5>' +
        '<span class="exp-sub-role-period">' + r.period + '</span>' +
        locHtml + descHtml +
        '</li>';
    }).join('');
    var headerInner = logoHtml +
      '<div class="exp-org-info">' +
      '<h4 class="h4 timeline-item-title">' + org.organization + '</h4>' +
      '<p class="exp-org-meta">' + metaParts.join(' · ') + '</p>' +
      '</div>';
    var headerContent = org.url
      ? '<a href="' + org.url + '" class="exp-org-link" target="_blank" rel="noopener">' + headerInner + '</a>'
      : headerInner;
    return '<li class="timeline-item">' +
      '<div class="exp-org-header">' + headerContent + '</div>' +
      '<ul class="exp-sub-roles">' + rolesHtml + '</ul>' +
      '</li>';
  }).join('');

  document.getElementById('resume-skills').innerHTML = d.skills.map(function (s) {
    return '<li class="skills-item">' +
      '<div class="title-wrapper">' +
      '<h5 class="h5">' + s.name + '</h5>' +
      '<data value="' + s.percentage + '">' + s.percentage + '%</data>' +
      '</div>' +
      '<div class="skill-progress-bg">' +
      '<div class="skill-progress-fill" style="width: ' + s.percentage + '%;"></div>' +
      '</div></li>';
  }).join('');

  // Skills Matrix
  var matrixEl = document.getElementById('resume-skills-matrix');
  if (matrixEl && d.skillsMatrix) {
    var matrixCardsHtml = d.skillsMatrix.map(function (group) {
      var tagsHtml = group.skills.map(function (s) {
        return '<span class="skill-tag">' + s + '</span>';
      }).join('');
      return '<div class="skills-matrix-card">' +
        '<div class="skills-matrix-header">' +
        '<div class="icon-box"><ion-icon name="' + group.icon + '"></ion-icon></div>' +
        '<h4 class="h4">' + group.category + '</h4>' +
        '</div>' +
        '<div class="skills-tag-list">' + tagsHtml + '</div>' +
        '</div>';
    }).join('');
    matrixEl.innerHTML = '<section class="skill skills-matrix-section">' +
      '<h3 class="h3 skills-title">Skills Matrix</h3>' +
      '<div class="skills-matrix-grid">' + matrixCardsHtml + '</div>' +
      '</section>';
  }
}

function renderAchievements(data) {
  var total = data.achievements.reduce(function (sum, cat) { return sum + cat.certs.length; }, 0);
  var countEl = document.getElementById('achievements-total-count');
  if (countEl) countEl.textContent = total;

  // Shared cert card HTML builder
  function certCardHtml(cert) {
    return '<li class="cert-item">' +
      '<button class="cert-card"' +
      ' data-cert-img="' + cert.img + '"' +
      ' data-cert-title="' + cert.title + '"' +
      ' data-cert-issuer="' + cert.issuer + '"' +
      ' data-cert-verify="' + (cert.verifyUrl || '') + '">' +
      '<figure class="cert-img-box">' +
      '<img src="' + cert.img + '" alt="' + cert.cardTitle + '" loading="lazy">' +
      '<div class="cert-hover-overlay"><ion-icon name="expand-outline"></ion-icon></div>' +
      '</figure>' +
      '<div class="cert-info">' +
      '<h4 class="cert-title">' + cert.cardTitle + '</h4>' +
      '<p class="cert-issuer">' + cert.cardIssuer + '</p>' +
      '<div class="cert-meta">' +
      '<span class="cert-year">' + cert.year + '</span>' +
      '<span class="cert-badge ' + cert.badge + '">' + cert.badge.charAt(0).toUpperCase() + cert.badge.slice(1) + '</span>' +
      '</div></div></button></li>';
  }

  // ── CATEGORY VIEW ────────────────────────────────────────────────────
  var groupDefs = [
    { name: "Scholarships &amp; Leadership",  icon: "trophy-outline" },
    { name: "Academic Honors",              icon: "school-outline" },
    { name: "Cultural &amp; Extracurricular", icon: "musical-notes-outline" }
  ];
  var groupMap = {};
  groupDefs.forEach(function (g) { groupMap[g.name] = []; });
  data.achievements.forEach(function (cat) {
    var grp = cat.group || groupDefs[0].name;
    if (!groupMap[grp]) groupMap[grp] = [];
    groupMap[grp].push(cat);
  });

  var categoryHtml = '<div id="achieve-cat-view">' +
    groupDefs.map(function (g) {
      var cats = groupMap[g.name] || [];
      var groupTotal = cats.reduce(function (sum, cat) { return sum + cat.certs.length; }, 0);
      var catsHtml = cats.map(function (cat) {
        return '<section class="cert-section" id="' + cat.id + '">' +
          '<div class="cert-section-header">' +
          '<div class="icon-box"><ion-icon name="' + cat.icon + '"></ion-icon></div>' +
          '<h3 class="h3">' + cat.title + '</h3>' +
          '</div>' +
          '<ul class="cert-grid">' + cat.certs.map(certCardHtml).join('') + '</ul>' +
          '</section>';
      }).join('');
      return '<div class="achieve-group">' +
        '<div class="achieve-group-header">' +
        '<div class="icon-box"><ion-icon name="' + g.icon + '"></ion-icon></div>' +
        '<span class="achieve-group-title">' + g.name + '</span>' +
        '<span class="achieve-group-count">' + groupTotal + ' certificates</span>' +
        '<ion-icon name="chevron-down-outline" class="achieve-group-chevron"></ion-icon>' +
        '</div>' +
        '<div class="achieve-group-body">' + catsHtml + '</div>' +
        '</div>';
    }).join('') +
  '</div>';

  // ── TIMELINE VIEW ────────────────────────────────────────────────────
  // Flatten all certs, sort newest first
  var allCerts = [];
  data.achievements.forEach(function (cat) {
    cat.certs.forEach(function (cert) { allCerts.push(cert); });
  });
  function parseYear(y) {
    var m = String(y).match(/\d{4}/g);
    return m ? parseInt(m[m.length - 1]) : 0;
  }
  allCerts.sort(function (a, b) { return parseYear(b.year) - parseYear(a.year); });

  // Group by year string, preserving sorted order
  var yearMap = {}, yearOrder = [];
  allCerts.forEach(function (cert) {
    if (!yearMap[cert.year]) { yearMap[cert.year] = []; yearOrder.push(cert.year); }
    yearMap[cert.year].push(cert);
  });

  var timelineHtml = '<div id="achieve-timeline-view" style="display:none">' +
    '<div class="achieve-timeline">' +
    yearOrder.map(function (year) {
      return '<div class="achieve-timeline-year">' +
        '<div class="achieve-timeline-node">' +
          '<span class="achieve-year-label">' + year + '</span>' +
          '<span class="achieve-year-dot"></span>' +
        '</div>' +
        '<div class="achieve-timeline-scroll-wrap">' +
          '<ul class="achieve-timeline-row">' + yearMap[year].map(certCardHtml).join('') + '</ul>' +
        '</div>' +
      '</div>';
    }).join('') +
    '</div>' +
  '</div>';

  document.getElementById('achievements-categories').innerHTML = categoryHtml + timelineHtml;
}

function renderPortfolio(data) {
  var d = data.portfolio;

  // Desktop filter buttons — first one gets "active" class
  document.getElementById('portfolio-filter-btns').innerHTML = d.filterCategories.map(function (cat, i) {
    return '<li class="filter-item"><button' + (i === 0 ? ' class="active"' : '') + ' data-filter-btn>' + cat + '</button></li>';
  }).join('');

  // Mobile dropdown items
  document.getElementById('portfolio-select-items').innerHTML = d.filterCategories.map(function (cat) {
    return '<li class="select-item"><button data-select-item>' + cat + '</button></li>';
  }).join('');

  // Project cards — new layout with description, tech badges, and action buttons
  document.getElementById('portfolio-projects').innerHTML = d.projects.map(function (p) {
    var techHtml = (p.techStack || []).map(function (t) {
      return '<span class="tech-badge">' + t + '</span>';
    }).join('');

    var actionsHtml = '';
    if (p.githubUrl) {
      actionsHtml += '<a href="' + p.githubUrl + '" target="_blank" rel="noopener" class="project-action-btn btn-code">' +
        '<ion-icon name="logo-github"></ion-icon> View Code</a>';
    }
    if (p.demoUrl) {
      actionsHtml += '<a href="' + p.demoUrl + '" target="_blank" rel="noopener" class="project-action-btn btn-demo">' +
        '<ion-icon name="open-outline"></ion-icon> Live Demo</a>';
    }
    if (p.deepDiveUrl) {
      actionsHtml += '<a href="' + p.deepDiveUrl + '" target="_blank" rel="noopener" class="project-action-btn btn-dive">' +
        '<ion-icon name="document-text-outline"></ion-icon> Deep Dive</a>';
    }

    return '<li class="project-item active" data-filter-item data-category="' + p.category + '">' +
      '<figure class="project-img">' +
      '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy">' +
      '</figure>' +
      '<div class="project-content">' +
      '<h3 class="project-title">' + p.title + '</h3>' +
      '<p class="project-desc">' + (p.description || '') + '</p>' +
      '<div class="tech-badge-list">' + techHtml + '</div>' +
      '<div class="project-actions">' + actionsHtml + '</div>' +
      '</div></li>';
  }).join('');
}

// ── GitHub project helpers ────────────────────────────────────────────────────

function formatRepoName(name) {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
}

function deriveCategory(repo) {
  var topics = (repo.topics || []).map(function(t) { return t.toLowerCase(); });
  var lang = (repo.language || '').toLowerCase();
  var designTopics  = ['design','figma','ui','ux','ui-ux','design-system'];
  var webTopics     = ['web','website','html','css','javascript','typescript','frontend','react','vue','angular','nextjs','next-js','svelte','nodejs','node-js','express','django','flask','fastapi','api','full-stack','fullstack'];
  var appTopics     = ['cli','tool','automation','script','desktop','gui','electron','tkinter','android','ios','mobile','game'];
  var webLangs      = ['javascript','typescript','html','css','php'];
  var appLangs      = ['c','c++','c#','java','rust','go','swift','kotlin','python'];
  if (topics.some(function(t){ return designTopics.indexOf(t) >= 0; })) return 'web design';
  if (topics.some(function(t){ return webTopics.indexOf(t)   >= 0; })) return 'web development';
  if (topics.some(function(t){ return appTopics.indexOf(t)   >= 0; })) return 'applications';
  if (webLangs.indexOf(lang) >= 0) return 'web development';
  if (appLangs.indexOf(lang) >= 0) return 'applications';
  return 'web development';
}

function deriveTechStack(repo) {
  var stack = [];
  if (repo.language) stack.push(repo.language);
  var topicMap = {
    'react':'React','reactjs':'React','vue':'Vue.js','vuejs':'Vue.js','vue3':'Vue 3',
    'angular':'Angular','nextjs':'Next.js','next-js':'Next.js','next':'Next.js',
    'svelte':'Svelte','nodejs':'Node.js','node-js':'Node.js','node':'Node.js',
    'express':'Express','expressjs':'Express','django':'Django','flask':'Flask','fastapi':'FastAPI',
    'tailwind':'Tailwind','tailwindcss':'Tailwind CSS','bootstrap':'Bootstrap',
    'mongodb':'MongoDB','mongo':'MongoDB','postgresql':'PostgreSQL','postgres':'PostgreSQL',
    'mysql':'MySQL','redis':'Redis','docker':'Docker','kubernetes':'Kubernetes','aws':'AWS',
    'tensorflow':'TensorFlow','pytorch':'PyTorch','machine-learning':'ML','deep-learning':'Deep Learning',
    'typescript':'TypeScript','javascript':'JavaScript'
  };
  (repo.topics || []).forEach(function(t) {
    var display = topicMap[t.toLowerCase()];
    if (display && stack.indexOf(display) === -1 && display !== repo.language) stack.push(display);
  });
  return stack.slice(0, 5);
}

async function fetchAndRenderPortfolio(data) {
  var cfg = data.portfolio.github;
  if (!cfg || !cfg.username) return;

  try {
    var url = 'https://api.github.com/users/' + cfg.username + '/repos?sort=updated&per_page=100&type=public';
    var res = await fetch(url);
    if (!res.ok) throw new Error('GitHub API ' + res.status);
    var repos = await res.json();

    if (cfg.excludeForks) repos = repos.filter(function(r) { return !r.fork; });
    var excluded = cfg.excludeRepos || [];
    repos = repos.filter(function(r) { return excluded.indexOf(r.name) === -1; });

    repos.sort(function(a, b) {
      if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count;
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    var overrides = cfg.overrides || {};
    var ghProjects = repos.map(function(repo) {
      var ov = overrides[repo.name] || {};
      return {
        title:       ov.title       || formatRepoName(repo.name),
        category:    ov.category    || deriveCategory(repo),
        image:       ov.image       || ('https://opengraph.githubassets.com/1/' + cfg.username + '/' + repo.name),
        url:         repo.html_url,
        description: ov.description || (repo.description || ''),
        techStack:   ov.techStack   || deriveTechStack(repo),
        githubUrl:   ov.githubUrl   !== undefined ? ov.githubUrl  : repo.html_url,
        demoUrl:     ov.demoUrl     !== undefined ? ov.demoUrl    : (repo.homepage || ''),
        deepDiveUrl: ov.deepDiveUrl || ''
      };
    });

    var allProjects = ghProjects.concat(data.portfolio.projects || []);

    // Build filter categories from what is actually present
    var cats = ['All'];
    allProjects.forEach(function(p) {
      var cat = p.category.split(' ').map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
      if (cats.indexOf(cat) === -1) cats.push(cat);
    });
    (data.portfolio.filterCategories || []).forEach(function(c) {
      if (cats.indexOf(c) === -1) cats.push(c);
    });

    var enriched = Object.assign({}, data, {
      portfolio: Object.assign({}, data.portfolio, { projects: allProjects, filterCategories: cats })
    });
    renderPortfolio(enriched);

  } catch(e) {
    console.warn('GitHub project fetch failed, falling back to manual projects.', e);
    renderPortfolio(data);
  }
}

// ── GitHub contribution chart ─────────────────────────────────────────────────

async function renderGithubContributions(username) {
  var container = document.getElementById('github-contributions');
  if (!container) return;

  try {
    var res = await fetch('https://github-contributions-api.jogruber.de/v4/' + username + '?y=last');
    if (!res.ok) throw new Error('API ' + res.status);
    var json = await res.json();
    var contribs = json.contributions;
    var totalCount = contribs.reduce(function(s, d) { return s + d.count; }, 0);

    // Pad start to Sunday boundary
    var firstDay = new Date(contribs[0].date + 'T00:00:00');
    var cells = [];
    for (var p = 0; p < firstDay.getDay(); p++) cells.push(null);
    contribs.forEach(function(c) { cells.push(c); });
    while (cells.length % 7 !== 0) cells.push(null);

    // Month labels: one per month, placed at first week of that month
    var monthLabels = [];
    var lastMonth = -1;
    for (var i = 0; i < cells.length; i++) {
      if (!cells[i]) continue;
      var d = new Date(cells[i].date + 'T00:00:00');
      var m = d.getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ weekIdx: Math.floor(i / 7), label: d.toLocaleString('default', { month: 'short' }) });
        lastMonth = m;
      }
    }

    // Cells HTML
    var cellsHtml = cells.map(function(c) {
      if (!c) return '<div class="contrib-cell contrib-empty"></div>';
      var tip = c.count === 0 ? 'No contributions on ' + c.date
                              : c.count + ' contribution' + (c.count === 1 ? '' : 's') + ' on ' + c.date;
      return '<div class="contrib-cell contrib-level-' + c.level + '" title="' + tip + '"></div>';
    }).join('');

    // 13px per column (10px cell + 3px gap)
    var monthsHtml = monthLabels.map(function(ml) {
      return '<span style="left:' + (ml.weekIdx * 13) + 'px">' + ml.label + '</span>';
    }).join('');

    container.innerHTML =
      '<div class="contrib-wrap">' +
        '<div class="contrib-header">' +
          '<span class="contrib-total">' + totalCount.toLocaleString() + ' contributions in the last year</span>' +
          '<a class="contrib-gh-link" href="https://github.com/' + username + '" target="_blank" rel="noopener">' +
            '<ion-icon name="logo-github"></ion-icon> @' + username +
          '</a>' +
        '</div>' +
        '<div class="contrib-body">' +
          '<div class="contrib-days">' +
            '<span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span>' +
          '</div>' +
          '<div class="contrib-main">' +
            '<div class="contrib-months">' + monthsHtml + '</div>' +
            '<div class="contrib-grid">' + cellsHtml + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="contrib-legend">' +
          '<span>Less</span>' +
          '<div class="contrib-cell contrib-level-0"></div>' +
          '<div class="contrib-cell contrib-level-1"></div>' +
          '<div class="contrib-cell contrib-level-2"></div>' +
          '<div class="contrib-cell contrib-level-3"></div>' +
          '<div class="contrib-cell contrib-level-4"></div>' +
          '<span>More</span>' +
        '</div>' +
      '</div>';

  } catch(e) {
    console.warn('GitHub contributions chart failed:', e);
    var c2 = document.getElementById('github-contributions');
    if (c2) c2.innerHTML = '';
  }
}

function renderBlog(data) {
  document.getElementById('blog-posts').innerHTML = data.blog.posts.map(function (post) {
    return '<li class="blog-post-item">' +
      '<a href="' + post.url + '">' +
      '<figure class="blog-banner-box">' +
      '<img src="' + post.image + '" alt="' + post.title + '" loading="lazy">' +
      '</figure>' +
      '<div class="blog-content">' +
      '<div class="blog-meta">' +
      '<p class="blog-category">' + post.category + '</p>' +
      '<span class="dot"></span>' +
      '<time datetime="' + post.date.datetime + '">' + post.date.display + '</time>' +
      '</div>' +
      '<h3 class="h3 blog-item-title">' + post.title + '</h3>' +
      '<p class="blog-text">' + post.excerpt + '</p>' +
      '</div></a></li>';
  }).join('');
}

function renderContact(data) {
  document.getElementById('contact-map').src = data.contact.mapSrc;

  var badgeEl = document.getElementById('contact-status-badge');
  if (badgeEl && data.contact.currentStatus) {
    var s = data.contact.currentStatus;
    badgeEl.innerHTML = '<div class="current-status-badge ' + (s.available ? 'status-available' : 'status-busy') + '">' +
      '<span class="status-dot"></span>' + s.label +
      '</div>';
  }
}

// Run all renderers — must happen before the querySelectorAll calls below
renderSidebar(portfolioData);
renderAbout(portfolioData);
renderResume(portfolioData);
renderAchievements(portfolioData);

// Achievements view toggle (category ↔ timeline)
const achieveToggleBtns = document.querySelectorAll('[data-achieve-view]');
const achieveCatView    = document.getElementById('achieve-cat-view');
const achieveTimelineView = document.getElementById('achieve-timeline-view');
for (let i = 0; i < achieveToggleBtns.length; i++) {
  achieveToggleBtns[i].addEventListener('click', function () {
    for (let j = 0; j < achieveToggleBtns.length; j++) achieveToggleBtns[j].classList.remove('active');
    this.classList.add('active');
    if (this.dataset.achieveView === 'timeline') {
      achieveCatView.style.display = 'none';
      achieveTimelineView.style.display = 'block';
    } else {
      achieveCatView.style.display = 'block';
      achieveTimelineView.style.display = 'none';
    }
  });
}

renderPortfolio(portfolioData);  // sync: renders filter buttons + empty list
document.getElementById('portfolio-projects').innerHTML =
  '<li class="projects-loading"><div class="loading-dots"><span></span><span></span><span></span></div></li>';
fetchAndRenderPortfolio(portfolioData);
renderGithubContributions(portfolioData.portfolio.github.username);
renderBlog(portfolioData);
renderContact(portfolioData);

// Update page title from data
document.title = portfolioData.sidebar.name + ' - Personal Portfolio';


// ─────────────────────────────────────────────────────────────────────────────
// END RENDER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectValue = document.querySelector("[data-selecct-value]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// Live filter — always queries current DOM so it works after async re-render
const filterFunc = function (selectedValue) {
  document.querySelectorAll('[data-filter-item]').forEach(function (item) {
    if (selectedValue === "all" || selectedValue === item.dataset.category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};

// Mobile select — event delegation on parent list
document.getElementById('portfolio-select-items').addEventListener('click', function (e) {
  var item = e.target.closest('[data-select-item]');
  if (!item) return;
  selectValue.innerText = item.innerText;
  elementToggleFunc(select);
  filterFunc(item.innerText.toLowerCase());
});

// Desktop filter buttons — event delegation on parent list
document.getElementById('portfolio-filter-btns').addEventListener('click', function (e) {
  var btn = e.target.closest('[data-filter-btn]');
  if (!btn) return;
  selectValue.innerText = btn.innerText;
  filterFunc(btn.innerText.toLowerCase());
  document.querySelectorAll('[data-filter-btn]').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
});



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// certificate lightbox
const certCards = document.querySelectorAll("[data-cert-img]");
const certModal = document.querySelector("[data-cert-modal]");
const certModalOverlay = document.querySelector("[data-cert-modal-overlay]");
const certModalCloseBtn = document.querySelector("[data-cert-modal-close]");
const certModalImg = document.querySelector("[data-cert-modal-img]");
const certModalTitle = document.querySelector("[data-cert-modal-title]");
const certModalIssuer = document.querySelector("[data-cert-modal-issuer]");
const certVerifyBtn = document.querySelector("[data-cert-verify-btn]");

const certModalFunc = function () { certModal.classList.toggle("active"); }

for (let i = 0; i < certCards.length; i++) {
  certCards[i].addEventListener("click", function () {
    certModalImg.src = this.dataset.certImg;
    certModalImg.alt = this.dataset.certTitle;
    certModalTitle.innerHTML = this.dataset.certTitle;
    certModalIssuer.innerHTML = this.dataset.certIssuer;

    // Show or hide the Verify Credential button based on verifyUrl
    if (certVerifyBtn) {
      var verifyUrl = this.dataset.certVerify || '';
      if (verifyUrl) {
        certVerifyBtn.href = verifyUrl;
        certVerifyBtn.style.display = 'inline-block';
      } else {
        certVerifyBtn.style.display = 'none';
      }
    }

    certModalFunc();
  });
}

if (certModalOverlay) certModalOverlay.addEventListener("click", certModalFunc);
if (certModalCloseBtn) certModalCloseBtn.addEventListener("click", certModalFunc);



// achievement group collapse/expand — full header click (icon-box or chevron)
const achieveGroupHeaders = document.querySelectorAll('.achieve-group-header');

for (let i = 0; i < achieveGroupHeaders.length; i++) {
  achieveGroupHeaders[i].addEventListener('click', function () {
    const body    = this.nextElementSibling;   // .achieve-group-body
    const chevron = this.querySelector('.achieve-group-chevron');
    if (body)    body.classList.toggle('section-collapsed');
    if (chevron) chevron.classList.toggle('section-collapsed');
  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// timeline section collapse/expand (icon-box click toggles the list)
const timelineSections = document.querySelectorAll('article[data-page="resume"] .timeline');

for (let i = 0; i < timelineSections.length; i++) {
  const section   = timelineSections[i];
  const iconBox   = section.querySelector('.icon-box');
  const titleWrap = section.querySelector('.title-wrapper');
  const list      = section.querySelector('.timeline-list');

  // Wrap the list in a collapse container so overflow:hidden lives on the
  // wrapper — .timeline-list stays overflow:visible so the absolutely-
  // positioned dots and line are never clipped while expanded
  const collapseWrap = document.createElement('div');
  collapseWrap.classList.add('timeline-collapse-wrap');
  list.parentNode.insertBefore(collapseWrap, list);
  collapseWrap.appendChild(list);

  // inject a chevron indicator at the end of the title-wrapper
  const chevron = document.createElement('ion-icon');
  chevron.setAttribute('name', 'chevron-down-outline');
  chevron.classList.add('timeline-chevron');
  titleWrap.appendChild(chevron);

  iconBox.addEventListener('click', function () {
    collapseWrap.classList.toggle('section-collapsed');
    chevron.classList.toggle('section-collapsed');
  });
}

// Enable collapse/expand transitions only after the first paint so all
// expandable sections (achievement groups, timeline sections) are fully
// visible on initial load — no "flash from collapsed" animation.
requestAnimationFrame(function () {
  document.body.classList.add('transitions-enabled');
});


// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}