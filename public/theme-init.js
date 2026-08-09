/* Runs before paint so the visitor never sees a flash of the wrong theme.
   Precedence: the visitor's own toggle choice > the admin's default mode
   (server-rendered onto <html data-default-mode>) > dark. */
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var fallback = document.documentElement.getAttribute('data-default-mode') || 'dark';
    var dark = saved ? saved === 'dark' : fallback !== 'light';
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
