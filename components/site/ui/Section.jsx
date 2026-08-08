import Reveal from './Reveal';

/* One consistent section frame: anchor id, generous vertical rhythm,
   oversized display heading with a hairline rule running off to the right. */
export default function Section({
  id,
  title,
  eyebrow,
  aside,
  children,
  className = '',
  printSection = false,
}) {
  return (
    <section
      id={id}
      className={`${printSection ? 'print-section' : 'print-hide'} border-t border-line py-24 md:py-36 ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <Reveal className="mb-14 md:mb-20">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display text-4xl sm:text-5xl md:text-6xl">{title}</h2>
            {aside}
          </div>
          <div className="mt-6 h-px w-full bg-line" />
        </Reveal>
        {children}
      </div>
    </section>
  );
}
