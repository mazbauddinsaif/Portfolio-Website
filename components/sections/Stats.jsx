import Reveal from '../ui/Reveal';

export default function Stats({ stats = [] }) {
  if (!stats.length) return null;
  return (
    <section className="stat-band">
      <div className="container">
        <Reveal>
          <div className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat__num gradient-text">{s.num}</div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
