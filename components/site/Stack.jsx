import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiRedux,
  SiTailwindcss,
  SiBootstrap,
  SiPython,
  SiC,
  SiCplusplus,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiMongoose,
  SiExpress,
  SiGit,
  SiGithub,
  SiCanva,
  SiNextdotjs,
  SiNodedotjs,
  SiPostman,
  SiFigma,
  SiDocker,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { DiPhotoshop } from 'react-icons/di';
import { TbApi, TbBrandOffice, TbSql } from 'react-icons/tb';
import { PiMicrosoftWordLogo, PiMicrosoftExcelLogo, PiMicrosoftPowerpointLogo } from 'react-icons/pi';
import { FiCode } from 'react-icons/fi';
import Section from './ui/Section';
import Reveal from './ui/Reveal';
import { decodeEntities } from './ui/text';

/* Exact name → icon (checked first, so "C" can't hijack "Canva"). */
const EXACT = {
  c: SiC,
  'c++': SiCplusplus,
  sql: TbSql,
};

/* Keyword → brand icon. First match wins; FiCode is the fallback tile. */
const ICONS = [
  ['html', SiHtml5],
  ['css', SiCss],
  ['typescript', SiTypescript],
  ['javascript', SiJavascript],
  ['react', SiReact],
  ['redux', SiRedux],
  ['next', SiNextdotjs],
  ['node', SiNodedotjs],
  ['express', SiExpress],
  ['tailwind', SiTailwindcss],
  ['bootstrap', SiBootstrap],
  ['python', SiPython],
  ['mongoose', SiMongoose],
  ['mongo', SiMongodb],
  ['postgre', SiPostgresql],
  ['mysql', SiMysql],
  ['rest', TbApi],
  ['api', TbApi],
  ['github', SiGithub],
  ['git', SiGit],
  ['vs code', VscVscode],
  ['word', PiMicrosoftWordLogo],
  ['excel', PiMicrosoftExcelLogo],
  ['powerpoint', PiMicrosoftPowerpointLogo],
  ['office', TbBrandOffice],
  ['photoshop', DiPhotoshop],
  ['canva', SiCanva],
  ['postman', SiPostman],
  ['figma', SiFigma],
  ['docker', SiDocker],
];

/* Brand colours, so the grid reads as a wall of logos rather than a wall of glyphs.
   Anything unmapped falls back to the theme's muted ink. */
const COLORS = [
  ['html', '#e34f26'],
  ['css', '#1572b6'],
  ['typescript', '#3178c6'],
  ['javascript', '#f7df1e'],
  ['react', '#61dafb'],
  ['redux', '#764abc'],
  // Next, Express and GitHub are monochrome brands — left unmapped so they take the
  // theme's ink colour and stay visible in light mode.
  ['node', '#5fa04e'],
  ['tailwind', '#38bdf8'],
  ['bootstrap', '#7952b3'],
  ['python', '#3776ab'],
  ['mongoose', '#880000'],
  ['mongo', '#47a248'],
  ['postgre', '#4169e1'],
  ['mysql', '#00758f'],
  ['github', null],
  ['git', '#f05032'],
  ['vs code', '#0078d4'],
  ['word', '#2b579a'],
  ['excel', '#217346'],
  ['powerpoint', '#d24726'],
  ['photoshop', '#31a8ff'],
  ['canva', '#00c4cc'],
  ['postman', '#ff6c37'],
  ['figma', '#f24e1e'],
  ['docker', '#2496ed'],
  ['c++', '#00599c'],
  ['c', '#a8b9cc'],
  ['sql', '#dd4b25'],
  ['api', '#8b5cf6'],
];

function iconFor(name) {
  const n = name.toLowerCase().trim();
  if (EXACT[n]) return EXACT[n];
  const hit = ICONS.find(([k]) => n.includes(k));
  return hit ? hit[1] : FiCode;
}

function colorFor(name) {
  const n = name.toLowerCase().trim();
  const exact = COLORS.find(([k]) => k === n);
  if (exact) return exact[1];
  const hit = COLORS.find(([k]) => n.includes(k));
  return hit ? hit[1] : null;
}

/* "HTML / CSS" and "Git & GitHub" style entries become individual tiles. */
function flattenSkills(skillsMatrix) {
  const seen = new Set();
  return (skillsMatrix || [])
    .flatMap((g) => g.skills || [])
    .flatMap((s) => decodeEntities(s).split(/\s*[/&]\s*/))
    .map((s) => s.trim())
    .filter((s) => {
      const key = s.toLowerCase();
      if (!s || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export default function Stack({ skillsMatrix }) {
  const skills = flattenSkills(skillsMatrix);
  if (!skills.length) return null;

  return (
    <Section id="stack" title="Tech Stack" eyebrow="Technologies" printSection center>
      {/* Centered logo wall over a soft accent wash. */}
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[420px] -translate-y-1/2 blur-3xl"
          style={{
            background:
              'radial-gradient(45% 55% at 50% 50%, color-mix(in srgb, var(--c-accent) 18%, transparent), transparent 70%)',
          }}
        />
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {skills.map((skill, i) => {
            const Icon = iconFor(skill);
            const color = colorFor(skill);
            return (
              <Reveal
                key={skill}
                delay={Math.min(i * 0.02, 0.4)}
                className="group flex size-[104px] flex-col items-center justify-center gap-2.5 rounded-xl border border-line bg-bg-1 transition-all duration-300 hover:-translate-y-1 hover:border-accent-text hover:shadow-[0_10px_30px_-12px_color-mix(in_srgb,var(--c-accent)_60%,transparent)] sm:size-[118px]"
              >
                <Icon
                  size={32}
                  aria-hidden="true"
                  className={`transition-transform duration-300 group-hover:scale-110 ${color ? '' : 'text-ink-muted'}`}
                  style={color ? { color } : undefined}
                />
                <span className="max-w-[100px] truncate px-1 text-center text-[0.6875rem] font-medium text-ink-muted transition-colors group-hover:text-ink">
                  {skill}
                </span>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
