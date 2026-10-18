// theme.js - load in <head> (no defer) so the right theme is applied before the page shows
(function () {
  var root = document.documentElement;
  var theme = 'dark';

  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (e) {}

  root.setAttribute('data-theme', theme);

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    function updateLabel() {
      var isLight = root.getAttribute('data-theme') === 'light';
      btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }
    updateLabel();

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.classList.add('theme-transition');
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      updateLabel();
      setTimeout(function () { root.classList.remove('theme-transition'); }, 400);
    });
  });
})();
