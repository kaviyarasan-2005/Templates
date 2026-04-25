/**
 * theme-toggle.js
 * Manages Dark / Light mode with localStorage persistence
 * and prefers-color-scheme detection on first visit.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'lumiere-theme';
  const html = document.documentElement;

  // ── Read stored preference or system preference ───────────
  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // ── Apply theme to <html> ─────────────────────────────────
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcon(theme);
  }

  // ── Update sun/moon icon display ──────────────────────────
  function updateToggleIcon(theme) {
    const btns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle');
    btns.forEach(btn => {
      const sunEl  = btn.querySelector('.theme-icon-label-sun');
      const moonEl = btn.querySelector('.theme-icon-label-moon');
      if (sunEl)  sunEl.style.display = theme === 'dark' ? 'none' : 'inline';
      if (moonEl) moonEl.style.display = theme === 'dark' ? 'inline' : 'none';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  // ── Toggle handler ────────────────────────────────────────
  function handleToggle() {
    const current = html.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    // Apply before paint to prevent flash
    const theme = getPreferredTheme();
    applyTheme(theme);

    // Bind buttons
    function bindButtons() {
      const btns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle');
      btns.forEach(btn => {
        btn.removeEventListener('click', handleToggle);
        btn.addEventListener('click', handleToggle);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindButtons);
    } else {
      bindButtons();
    }
    
    // Also re-bind if content changes (e.g. dynamic tabs)
    const observer = new MutationObserver(bindButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    // Listen to system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  init();
})();
