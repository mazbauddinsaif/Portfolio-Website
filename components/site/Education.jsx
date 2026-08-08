import Section from './ui/Section';
import Reveal from './ui/Reveal';
import SafeImage from './ui/SafeImage';
import { decodeEntities } from './ui/text';

export default function Education({ education }) {
  if (!education?.length) return null;

  return (
    <Section id="education" title="Education" eyebrow="Academics" printSection>
      <ol className="flex flex-col">
        {education.map((e, i) => (
          <Reveal
            key={i}
            as="li"
            delay={i * 0.05}
            className="print-avoid-break border-b border-line py-8 first:pt-0 last:border-b-0"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_2fr] md:gap-10">
              <div className="flex items-start gap-4">
                {e.logo ? (
                  <SafeImage
                    src={e.logo}
                    alt={`${e.institution} logo`}
                    width={44}
                    height={44}
                    className="size-11 shrink-0 rounded border border-line object-contain"
                  />
                ) : (
                  <div className="size-11 shrink-0 rounded border border-line bg-bg-2" />
                )}
                <div>
                  {e.url ? (
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold transition-colors hover:text-accent-text"
                    >
                      {decodeEntities(e.institution)}
                    </a>
                  ) : (
                    <h3 className="text-lg font-semibold">{decodeEntities(e.institution)}</h3>
                  )}
                  <p className="mt-1 text-xs tracking-wide text-ink-faint uppercase">{e.period}</p>
                </div>
              </div>
              {e.description && (
                <div
                  className="text-[0.8125rem] leading-relaxed text-ink-muted [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: e.description }}
                />
              )}
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
