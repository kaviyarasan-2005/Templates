/* ============================================================
   THEME.JS — Dark / Light Mode Toggle
   Persists in localStorage, respects system preference
   ============================================================ */
'use strict';

(function () {

  const STORAGE_KEY = 'stylist-theme';
  const html = document.documentElement;

  /* ── Detect preferred theme ─────────────── */
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /* ── Apply theme ────────────────────────── */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcons(theme);
  }

  /* ── Update all toggle icon states ─────── */
  function updateToggleIcons(theme) {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon) sunIcon.style.display = theme === 'dark' ? 'none' : 'block';
      if (moonIcon) moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  /* ── Toggle on button click ─────────────── */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;

    const current = html.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ── Listen for system preference changes ─ */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't set a preference
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ── Initialize ─────────────────────────── */
  applyTheme(getPreferredTheme());

})();
