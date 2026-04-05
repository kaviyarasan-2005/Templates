/* ============================================
   INK STUDIO - RTL / LTR Direct Toggle
   Globe icon = one-click RTL/LTR switch
   ============================================ */

'use strict';

const RTLToggle = (() => {
  const STORAGE_KEY = 'site-direction';

  function init() {
    const direction = getPreference();
    applyDirection(direction);
    bindToggle();
  }

  function getPreference() {
    return localStorage.getItem(STORAGE_KEY) || 'ltr';
  }

  function applyDirection(direction) {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', direction === 'rtl' ? 'ar' : 'en');
    localStorage.setItem(STORAGE_KEY, direction);
    updateUI(direction);
  }

  function updateUI(direction) {
    // Update aria-label and title on toggle buttons
    document.querySelectorAll('.globe-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${direction === 'rtl' ? 'LTR' : 'RTL'}`);
      btn.setAttribute('title', `Currently ${direction.toUpperCase()} — Click to switch`);
      btn.classList.toggle('rtl-active', direction === 'rtl');
    });
  }

  function bindToggle() {
    document.querySelectorAll('.globe-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        const next = current === 'ltr' ? 'rtl' : 'ltr';
        applyDirection(next);
      });
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', RTLToggle.init);
