import Section from './ui/Section';
import Reveal from './ui/Reveal';
import RichText from './ui/RichText';
import SafeImage from './ui/SafeImage';
import Marquee from './ui/Marquee';

/* Theme-aware portrait: overwrite these two files to change the photos.
   portrait-light.jpg shows in light mode, portrait-dark.jpg in dark mode. */
const PORTRAIT_LIGHT = '/assets/images/My Avatar/portrait-light.png';
const PORTRAIT_DARK = '/assets/images/My Avatar/portrait-dark.png';

export default function About({ about }) {
  if (!about) return null;

  return (
    <Section id="about" title="This is me." eyebrow="About">
      <div className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-16">
        {/* Portrait: bordered square with lime corner brackets, echoing the stack cards. */}
        <Reveal>
          <figure className="relative mx-auto w-full max-w-[300px] md:sticky md:top-28 md:mx-0 md:max-w-[360px]">
            <span
              aria-hidden="true"
              className="absolute -top-3 -left-3 size-8 border-t-2 border-l-2 border-accent"
            />
            <span
              aria-hidden="true"
              className="absolute -right-3 -bottom-3 size-8 border-r-2 border-b-2 border-accent"
            />
            {/* CSS swap — no JS, flips instantly with the theme toggle. */}
            <SafeImage
              src={PORTRAIT_LIGHT}
              alt="Portrait"
              className="block aspect-square w-full rounded border border-line bg-bg-2 object-cover dark:hidden"
            />
            <SafeImage
              src={PORTRAIT_DARK}
              alt="Portrait"
              className="hidden aspect-square w-full rounded border border-line bg-bg-2 object-cover dark:block"
            />
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <p className="display text-2xl leading-tight sm:text-3xl">
              I believe in building things that are fast, accessible, and worth using.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 text-[0.9375rem] leading-relaxed text-ink-muted">
            {(about.paragraphs || []).map((p, i) => (
              <RichText key={i} text={p} className="mb-4" />
            ))}
          </Reveal>
        </div>
      </div>

      {(about.workedWithList || []).length > 0 && (
        <Reveal className="mt-16">
          <p className="eyebrow mb-6">Worked with</p>
          <Marquee>
            {about.workedWithList.map((c, i) => (
              <a
                key={i}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-8 inline-flex h-12 w-28 items-center justify-center opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
              >
                <SafeImage src={c.logo} alt="organization logo" className="max-h-12 max-w-28 object-contain" />
              </a>
            ))}
          </Marquee>
        </Reveal>
      )}
    </Section>
  );
}
