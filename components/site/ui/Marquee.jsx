/* Infinite logo strip. The children are rendered twice and the track is
   translated by exactly -50%, so the seam is invisible. */
export default function Marquee({ children, duration = 32 }) {
  return (
    <div
      className="marquee-wrap relative overflow-hidden"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      <div className="marquee-track" style={{ '--marquee-duration': `${duration}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
