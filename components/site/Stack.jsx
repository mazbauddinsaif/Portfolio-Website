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

function iconFor(name) {
  const n = name.toLowerCase().trim();
  if (EXACT[n]) return EXACT[n];
  const hit = ICONS.find(([k]) => n.includes(k));
  return hit ? hit[1] : FiCode;
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
    <Section id="stack" title="Tech Stack" eyebrow="Technologies" printSection>
      {/* Centered icon-tile cloud, redoyanulhaque-style. */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {skills.map((skill, i) => {
          const Icon = iconFor(skill);
          return (
            <Reveal
              key={skill}
              delay={Math.min(i * 0.03, 0.45)}
              className="group flex size-[104px] flex-col items-center justify-center gap-2.5 rounded-lg border border-line bg-bg-1 transition-colors hover:border-accent-text sm:size-[118px]"
            >
              <Icon
                size={30}
                className="text-ink-muted transition-colors group-hover:text-accent-text"
                aria-hidden="true"
              />
              <span className="max-w-[100px] truncate px-1 text-center text-[0.6875rem] font-medium text-ink-muted">
                {skill}
              </span>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
