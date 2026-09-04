import Section from './ui/Section';
import Reveal from './ui/Reveal';
import RichText from './ui/RichText';
import SafeImage from './ui/SafeImage';
import ThemePortrait from './ui/ThemePortrait';

/* Theme-aware portrait: overwrite these two files to change the photos.
   portrait-light.jpg shows in light mode, portrait-dark.jpg in dark mode.
   These paths can also be set via the CMS (about.portraitLight / about.portraitDark). */
const PORTRAIT_LIGHT_DEFAULT = '/assets/images/My Avatar/portrait-light.png';
const PORTRAIT_DARK_DEFAULT = '/assets/images/My Avatar/portrait-dark.png';

const DEFAULT_ROLES = ['Instructor', 'Software Developer', 'Competitive Programmer', 'Blogger'];

export default function About({ about }) {
  if (!about) return null;

  const portraitLight = about.portraitLight || PORTRAIT_LIGHT_DEFAULT;
  const portraitDark = about.portraitDark || PORTRAIT_DARK_DEFAULT;
  const roles = about.roles?.length ? about.roles : DEFAULT_ROLES;
  const workedWith = about.workedWithList || [];

  return (
    <Section id="about" title="I believe in building things that are fast, accessible, and worth using." eyebrow="About">
      <div className="-mt-8 grid gap-8 md:-mt-12 md:grid-cols-[1fr_1.5fr] md:gap-0">
        <Reveal>
          <figure className="relative mx-auto w-full max-w-[300px] md:mx-0 md:ml-8 md:max-w-[360px]">
            <span
              aria-hidden="true"
              className="absolute -top-3 -left-3 size-8 border-t-2 border-l-2 border-accent"
            />
            <span
              aria-hidden="true"
              className="absolute -right-3 -bottom-3 size-8 border-r-2 border-b-2 border-accent"
            />
            <ThemePortrait
              light={portraitLight}
              dark={portraitDark}
              alt="Portrait"
              width={720}
              height={720}
              className="aspect-square w-full rounded border border-line bg-bg-2 object-cover"
            />
          </figure>
        </Reveal>

        <div>
          <Reveal delay={0.08}>
            <p className="text-sm font-medium text-ink">
              {roles.map((role, i) => (
                <span key={i}>
                  {role}
                  {i < roles.length - 1 && <span className="mx-2 text-ink-faint">|</span>}
                </span>
              ))}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted text-justify">
            {(about.paragraphs || []).map((p, i) => (
              <RichText key={i} text={p} className="mb-4" />
            ))}
          </Reveal>
        </div>
      </div>

      {workedWith.length > 0 && (
        <Reveal className="mt-20">
          <div className="mb-8 flex items-center gap-5">
            <span className="h-px flex-1 bg-line" />
            <p className="eyebrow shrink-0 text-sm tracking-[0.2em]">Worked with</p>
            <span className="h-px flex-1 bg-line" />
          </div>
          {/* Logos drift right-to-left. Roster is rendered twice for a seamless
              -50% loop — not padded to 8× copies (that re-fetched the same logo). */}
          <div className="marquee">
            <span aria-hidden="true" className="marquee-glow" />
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <ul key={copy} className="marquee-row" aria-hidden={copy === 1 || undefined}>
                  {workedWith.map((c, i) => {
                    const logo = (
                      <SafeImage
                        src={c.logo}
                        alt="organization logo"
                        loading="lazy"
                        width={150}
                        height={48}
                        className="max-h-12 max-w-[150px] object-contain transition duration-300 group-hover:scale-105"
                      />
                    );
                    const plated = (
                      <span className="grid place-items-center rounded-lg px-3 py-2 dark:bg-white/90">
                        {logo}
                      </span>
                    );
                    return (
                      <li key={`${copy}-${i}`} className="group flex h-20 w-40 shrink-0 items-center justify-center">
                        {c.url ? (
                          <a href={c.url} target="_blank" rel="noopener noreferrer" className="block">
                            {plated}
                          </a>
                        ) : (
                          plated
                        )}
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
