'use client';

export default function AboutSection({ data, active }) {
  if (!data) return null;

  return (
    <article className={`about${active ? ' active' : ''}`} data-page="about">
      <header>
        <h2 className="h2 article-title">About me</h2>
      </header>

      <section className="about-text">
        {(data.paragraphs || []).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>

      <section className="service">
        <h3 className="h3 service-title">What i&apos;m doing</h3>
        <ul className="service-list">
          {(data.services || []).map((s, i) => (
            <li key={i} className="service-item">
              <div className="service-icon-box">
                <img src={s.icon} alt={s.iconAlt || s.title} width="40" />
              </div>
              <div className="service-content-box">
                <h4 className="h4 service-item-title">{s.title}</h4>
                <p className="service-item-text">{s.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="worked-with">
        <h3 className="h3 worked-with-title">Worked With</h3>
        <ul className="worked-with-list has-scrollbar">
          {(data.workedWithList || []).map((c, i) => (
            <li key={i} className="worked-with-item">
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                <img src={c.logo} alt="organization logo" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
