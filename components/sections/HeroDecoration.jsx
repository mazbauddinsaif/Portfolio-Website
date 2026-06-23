/* Josh Comeau-style diagonal dash-streak.
   Deterministic (no random) so server and client markup match. */

function hexToRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}
function colorAt(t) {
  // pink -> violet -> sky
  const stops = ['#ff5e8a', '#8b5cf6', '#38bdf8'].map(hexToRgb);
  const seg = t >= 0.5 ? 1 : 0;
  const lt = seg === 0 ? t / 0.5 : (t - 0.5) / 0.5;
  const [r, g, b] = [0, 1, 2].map((i) => lerp(stops[seg][i], stops[seg + 1][i], lt));
  return `rgb(${r}, ${g}, ${b})`;
}

export default function HeroDecoration() {
  const ROWS = 11;
  const COLS = 16;
  const STEP = 26;
  const dashes = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * STEP + r * (STEP * 0.42);
      const y = r * STEP;
      const t = Math.min(1, Math.max(0, (c + (ROWS - r) * 0.5) / (COLS + ROWS * 0.5)));
      // fade toward the top-left so the streak emerges
      const fade = Math.min(1, (c / COLS) * 1.25) * Math.min(1, ((ROWS - r) / ROWS) * 1.4);
      const len = 10 + ((c + r) % 3) * 4;
      dashes.push(
        <rect
          key={`${r}-${c}`}
          x={x}
          y={y}
          width={4.5}
          height={len}
          rx={2.25}
          fill={colorAt(t)}
          opacity={(0.25 + fade * 0.65).toFixed(2)}
          transform={`rotate(-42 ${x + 2.25} ${y + len / 2})`}
        />
      );
    }
  }

  return (
    <div className="hero__deco" aria-hidden="true">
      <svg viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg" role="presentation">
        {dashes}
      </svg>
    </div>
  );
}
