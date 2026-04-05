/* ============================================
   INK STUDIO - Theme Toggle
   ============================================ */

'use strict';

const ThemeToggle = (() => {
  const STORAGE_KEY = 'theme-preference';

  function init() {
    const theme = getPreference();
    applyTheme(theme);
    bindToggle();
  }

  function getPreference() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;

    // System preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateIcons(theme);
  }

  function updateIcons(theme) {
    const sunIcons = document.querySelectorAll('.theme-icon-sun');
    const moonIcons = document.querySelectorAll('.theme-icon-moon');

    sunIcons.forEach(icon => {
      icon.style.display = theme === 'dark' ? 'block' : 'none';
    });
    moonIcons.forEach(icon => {
      icon.style.display = theme === 'dark' ? 'none' : 'block';
    });
  }

  function bindToggle() {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = current === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);

        // Animate
        btn.classList.add('theme-toggle-animate');
        setTimeout(() => btn.classList.remove('theme-toggle-animate'), 400);
      });
    });

    // Listen for system changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', ThemeToggle.init);
