'use client';
import { useState } from 'react';

const groupDefs = [
  { name: "Scholarships &amp; Leadership", icon: "trophy-outline" },
  { name: "Academic Honors", icon: "school-outline" },
  { name: "Cultural &amp; Extracurricular", icon: "musical-notes-outline" },
];

function CertCard({ cert, onClick }) {
  return (
    <li className="cert-item">
      <button className="cert-card" onClick={() => onClick(cert)}>
        <figure className="cert-img-box">
          <img src={cert.img} alt={cert.cardTitle} loading="lazy" />
          <div className="cert-hover-overlay"><ion-icon name="expand-outline"></ion-icon></div>
        </figure>
        <div className="cert-info">
          <h4 className="cert-title">{cert.cardTitle}</h4>
          <p className="cert-issuer">{cert.cardIssuer}</p>
          <div className="cert-meta">
            <span className="cert-year">{cert.year}</span>
            <span className={`cert-badge ${cert.badge}`}>
              {cert.badge ? cert.badge.charAt(0).toUpperCase() + cert.badge.slice(1) : ''}
            </span>
          </div>
        </div>
      </button>
    </li>
  );
}

export default function AchievementsSection({ data, active }) {
  const [viewMode, setViewMode] = useState('category');
  const [modalCert, setModalCert] = useState(null);

  if (!data) return null;

  const total = data.reduce((sum, cat) => sum + (cat.certs?.length || 0), 0);

  // Group by groupDefs
  const groupMap = {};
  groupDefs.forEach(g => { groupMap[g.name] = []; });
  data.forEach(cat => {
    const grp = cat.group || groupDefs[0].name;
    if (!groupMap[grp]) groupMap[grp] = [];
    groupMap[grp].push(cat);
  });

  // Timeline: flatten and sort by year
  const allCerts = [];
  data.forEach(cat => (cat.certs || []).forEach(cert => allCerts.push(cert)));
  const parseYear = (y) => { const m = String(y).match(/\d{4}/g); return m ? parseInt(m[m.length - 1]) : 0; };
  allCerts.sort((a, b) => parseYear(b.year) - parseYear(a.year));
  const yearMap = {}; const yearOrder = [];
  allCerts.forEach(cert => {
    if (!yearMap[cert.year]) { yearMap[cert.year] = []; yearOrder.push(cert.year); }
    yearMap[cert.year].push(cert);
  });

  return (
    <article className={`achievements${active ? ' active' : ''}`} data-page="achievements">
      <header className="achievements-header">
        <h2 className="h2 article-title">Achievements &amp; Certifications</h2>
        <div className="achievements-header-actions">
          <div className="achieve-view-toggle">
            <button className={`achieve-toggle-btn${viewMode === 'category' ? ' active' : ''}`}
              onClick={() => setViewMode('category')} title="Category view">
              <ion-icon name="grid-outline"></ion-icon>
            </button>
            <button className={`achieve-toggle-btn${viewMode === 'timeline' ? ' active' : ''}`}
              onClick={() => setViewMode('timeline')} title="Timeline view">
              <ion-icon name="time-outline"></ion-icon>
            </button>
          </div>
          <div className="achievements-count-badge">
            <span className="count-number">{total}</span>
            <span className="count-label">Total</span>
          </div>
        </div>
      </header>

      {/* Category View */}
      {viewMode === 'category' && (
        <div>
          {groupDefs.map((g, gi) => {
            const cats = groupMap[g.name] || [];
            const groupTotal = cats.reduce((s, c) => s + (c.certs?.length || 0), 0);
            return (
              <div key={gi} className="achieve-group">
                <div className="achieve-group-header">
                  <div className="icon-box"><ion-icon name={g.icon}></ion-icon></div>
                  <span className="achieve-group-title">{g.name}</span>
                  <span className="achieve-group-count">{groupTotal} certificates</span>
                  <ion-icon name="chevron-down-outline" className="achieve-group-chevron"></ion-icon>
                </div>
                <div className="achieve-group-body">
                  {cats.map((cat, ci) => (
                    <section key={ci} className="cert-section" id={cat.id}>
                      <div className="cert-section-header">
                        <div className="icon-box"><ion-icon name={cat.icon}></ion-icon></div>
                        <h3 className="h3">{cat.title}</h3>
                      </div>
                      <ul className="cert-grid">
                        {(cat.certs || []).map((cert, ki) => (
                          <CertCard key={ki} cert={cert} onClick={setModalCert} />
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="achieve-timeline">
          {yearOrder.map((year, yi) => (
            <div key={yi} className="achieve-timeline-year">
              <div className="achieve-timeline-node">
                <span className="achieve-year-label">{year}</span>
                <span className="achieve-year-dot"></span>
              </div>
              <div className="achieve-timeline-scroll-wrap">
                <ul className="achieve-timeline-row">
                  {yearMap[year].map((cert, ci) => (
                    <CertCard key={ci} cert={cert} onClick={setModalCert} />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      <div className={`cert-modal-container${modalCert ? ' active' : ''}`}>
        <div className="cert-modal-overlay" onClick={() => setModalCert(null)}></div>
        <div className="cert-modal-box">
          <button className="cert-modal-close-btn" onClick={() => setModalCert(null)}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
          {modalCert && (
            <>
              <img src={modalCert.img} alt={modalCert.title} className="cert-modal-img" />
              <div className="cert-modal-info">
                <h3 className="h3">{modalCert.title}</h3>
                <p>{modalCert.issuer}</p>
                {modalCert.verifyUrl && (
                  <a href={modalCert.verifyUrl} target="_blank" rel="noopener noreferrer"
                    className="cert-verify-btn">Verify Credential</a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
