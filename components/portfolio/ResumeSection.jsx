'use client';
import SafeImage from './SafeImage';

export default function ResumeSection({ data, sidebarData, active }) {
  if (!data) return null;

  return (
    <article className={`resume${active ? ' active' : ''}`} data-page="resume">
      {/* Dynamic print-only header for professional A4 resume generation */}
      {sidebarData && (
        <div className="print-header">
          <h1 className="print-name">{sidebarData.name}</h1>
          <p className="print-title">{sidebarData.title}</p>
          <div className="print-contact">
            <span>{sidebarData.email}</span>
            <span className="print-dot">·</span>
            <span>{sidebarData.phoneDisplay}</span>
            <span className="print-dot">·</span>
            <span>{sidebarData.location}</span>
          </div>
        </div>
      )}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '30px' }}>
        <h2 className="h2 article-title" style={{ margin: 0 }}>Resume</h2>
        {data.showDownloadPDF !== false && (
          <button 
            onClick={() => window.print()}
            className="download-resume-btn"
            data-track-click="download_resume_pdf"
          >
            <ion-icon name="download-outline"></ion-icon>
            <span>Download PDF</span>
          </button>
        )}
      </header>

      {/* Education */}
      <section className="timeline">
        <div className="title-wrapper">
          <div className="icon-box"><ion-icon name="book-outline"></ion-icon></div>
          <h3 className="h3">Education</h3>
        </div>
        <ol className="timeline-list">
          {(data.education || []).map((e, i) => {
            const logoHtml = e.logo
              ? <SafeImage src={e.logo} alt={`${e.institution} logo`} className="exp-org-logo" />
              : <div className="exp-org-logo-placeholder"></div>;

            const headerInner = (
              <>
                {logoHtml}
                <div className="exp-org-info">
                  <h4 className="h4 timeline-item-title">{e.institution}</h4>
                  <span>{e.period}</span>
                </div>
              </>
            );

            return (
              <li key={i} className="timeline-item">
                <div className="exp-org-header">
                  {e.url ? (
                    <a href={e.url} className="exp-org-link" target="_blank" rel="noopener noreferrer">
                      {headerInner}
                    </a>
                  ) : headerInner}
                </div>
                <p className="timeline-text" dangerouslySetInnerHTML={{ __html: e.description }} />
              </li>
            );
          })}
        </ol>
      </section>

      {/* Experience */}
      <section className="timeline">
        <div className="title-wrapper">
          <div className="icon-box"><ion-icon name="book-outline"></ion-icon></div>
          <h3 className="h3">Experience</h3>
        </div>
        <ol className="timeline-list">
          {(data.experience || []).map((org, i) => {
            const metaParts = [];
            if (org.type) metaParts.push(org.type);
            metaParts.push(org.period);

            const logoHtml = org.logo
              ? <SafeImage src={org.logo} alt={`${org.organization} logo`} className="exp-org-logo" />
              : <div className="exp-org-logo-placeholder"></div>;

            const headerInner = (
              <>
                {logoHtml}
                <div className="exp-org-info">
                  <h4 className="h4 timeline-item-title">{org.organization}</h4>
                  <p className="exp-org-meta">{metaParts.join(' · ')}</p>
                </div>
              </>
            );

            return (
              <li key={i} className="timeline-item">
                <div className="exp-org-header">
                  {org.url ? (
                    <a href={org.url} className="exp-org-link" target="_blank" rel="noopener noreferrer">
                      {headerInner}
                    </a>
                  ) : headerInner}
                </div>
                <ul className="exp-sub-roles">
                  {(org.roles || []).map((r, ri) => (
                    <li key={ri} className="exp-sub-role">
                      <h5 className="exp-sub-role-title">{r.role}</h5>
                      <span className="exp-sub-role-period">{r.period}</span>
                      {r.location && <p className="exp-sub-role-location">{r.location}</p>}
                      {r.description && <p className="timeline-text" dangerouslySetInnerHTML={{ __html: r.description }} />}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Skills */}
      <section className="skill">
        <h3 className="h3 skills-title">My skills</h3>

        <ul className="skills-list content-card">
          {(data.skills || []).map((s, i) => (
            <li key={i} className="skills-item">
              <div className="title-wrapper">
                <h5 className="h5">{s.name}</h5>
                <data value={s.percentage}>{s.percentage}%</data>
              </div>
              <div className="skill-progress-bg">
                <div className="skill-progress-fill" style={{ width: `${s.percentage}%` }}></div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills Matrix */}
      {data.skillsMatrix && data.skillsMatrix.length > 0 && (
        <section className="skill skills-matrix-section">
          <h3 className="h3 skills-title">Skills Matrix</h3>
          <div className="skills-matrix-grid">
            {data.skillsMatrix.map((group, i) => (
              <div key={i} className="skills-matrix-card">
                <div className="skills-matrix-header">
                  <div className="icon-box"><ion-icon name={group.icon}></ion-icon></div>
                  <h4 className="h4">{group.category}</h4>
                </div>
                <div className="skills-tag-list">
                  {(group.skills || []).map((s, si) => (
                    <span key={si} className="skill-tag">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
