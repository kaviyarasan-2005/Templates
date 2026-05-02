// theme-toggle.js — Dark/Light mode + RTL toggle with localStorage persistence

(function () {
  const THEME_KEY = 'aura-theme';
  const DIR_KEY = 'aura-dir';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const moonIcon = document.querySelector('.moon-icon');
    const sunIcon = document.querySelector('.sun-icon');
    if (moonIcon) moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
    if (sunIcon) sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    }
  }

  // Load saved preferences immediately (no flash)
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
  applyTheme(savedTheme);
  applyDir(savedDir);

  document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
      });
    }

    // Language/Dir toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        const next = current === 'rtl' ? 'ltr' : 'rtl';
        applyDir(next);
        localStorage.setItem(DIR_KEY, next);
      });
    }
  });
})();
