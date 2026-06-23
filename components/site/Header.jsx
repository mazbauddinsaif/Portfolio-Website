import Link from 'next/link';
import ThemeToggle from '../ui/ThemeToggle';

const LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#publications', label: 'Publications' },
  { href: '/#certifications', label: 'Certifications' },
  { href: '/#projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
];

export default function Header({ name = 'Mazba Uddin Saif' }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label={`${name} — home`}>
          <span className="brand__dot" aria-hidden="true" />
          {initials}.
        </Link>
        <nav className="nav" aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <Link href="/#contact" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            Contact
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
