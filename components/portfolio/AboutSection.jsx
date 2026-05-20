'use client';

export default function AboutSection({ data, active }) {
  if (!data) return null;

  // Modern, secure custom text parser to render safe formatting without dangerouslySetInnerHTML
  const parseFormattedText = (text) => {
    if (!text) return '';
    const regex = /(<strong>[\s\S]*?<\/strong>|<em>[\s\S]*?<\/em>|<u>[\s\S]*?<\/u>|<p>[\s\S]*?<\/p>|<br\s*\/?>)/g;
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
        const content = part.substring(8, part.length - 9);
        return <strong key={index}>{parseFormattedText(content)}</strong>;
      }
      if (part.startsWith('<em>') && part.endsWith('</em>')) {
        const content = part.substring(4, part.length - 5);
        return <em key={index}>{parseFormattedText(content)}</em>;
      }
      if (part.startsWith('<u>') && part.endsWith('</u>')) {
        const content = part.substring(3, part.length - 4);
        return <u key={index}>{parseFormattedText(content)}</u>;
      }
      if (part.startsWith('<p>') && part.endsWith('</p>')) {
        const content = part.substring(3, part.length - 4);
        return <p key={index} className="mb-4">{parseFormattedText(content)}</p>;
      }
      if (part.match(/^<br\s*\/?>$/)) {
        return <br key={index} />;
      }
      return part;
    });
  };

  return (
    <article className={`about${active ? ' active' : ''}`} data-page="about">
      <header>
        <h2 className="h2 article-title">About me</h2>
      </header>

      <section className="about-text" style={{ whiteSpace: 'pre-wrap' }}>
        {(data.paragraphs || []).map((p, i) => (
          <div key={i}>{parseFormattedText(p)}</div>
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
