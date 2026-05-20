'use client';

const pages = ['About', 'Resume', 'Achievements', 'Projects', 'Blog', 'Contact'];

export default function Navbar({ activePage, setActivePage }) {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {pages.map((page) => (
          <li key={page} className="navbar-item">
            <button
              className={`navbar-link${activePage === page.toLowerCase() ? ' active' : ''}`}
              onClick={() => {
                setActivePage(page.toLowerCase());
                window.scrollTo(0, 0);
              }}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
