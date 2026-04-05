/* ============================================
   THEME SWITCHER — Dark/Light/System + RTL
   ============================================ */
const ThemeSwitcher = (() => {
  const STORAGE_KEY = 'vinyl-theme';
  const DIR_KEY = 'vinyl-dir';
  const THEMES = ['light', 'dark'];

  function getPreferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.includes(saved)) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateIcon(theme);
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || getPreferred();
    const next = current === 'light' ? 'dark' : 'light';
    apply(next);
  }

  function updateIcon(theme) {
    const btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
        moonIcon.style.display = theme === 'light' ? 'block' : 'none';
      } else {
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    });
  }

  /* RTL */
  function getDir() {
    return localStorage.getItem(DIR_KEY) || 'ltr';
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
  }

  function toggleDir() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    applyDir(current === 'ltr' ? 'rtl' : 'ltr');
  }

  /* Init */
  function init() {
    apply(getPreferred());
    applyDir(getDir());

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
    document.querySelectorAll('.dir-toggle').forEach(btn => {
      btn.addEventListener('click', toggleDir);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        apply(e.matches ? 'dark' : 'light');
      }
    });
  }

  return { init, toggle, toggleDir, apply, applyDir };
})();

document.addEventListener('DOMContentLoaded', ThemeSwitcher.init);
