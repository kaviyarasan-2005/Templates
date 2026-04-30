/* ============================================================
   RTL.JS — Direction (LTR/RTL) Switching
   Toggle on globe icon, persist in localStorage
   ============================================================ */
'use strict';

(function () {

  const STORAGE_KEY = 'stylist-dir';
  const html = document.documentElement;

  /* ── Get saved / default direction ─────── */
  function getSavedDir() {
    return localStorage.getItem(STORAGE_KEY) || html.getAttribute('dir') || 'ltr';
  }

  /* ── Apply direction ────────────────────── */
  function applyDir(dir) {
    html.setAttribute('dir', dir);
    html.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem(STORAGE_KEY, dir);
    updateGlobeBtn(dir);
  }

  /* ── Update globe button visual ─────────── */
  function updateGlobeBtn(dir) {
    document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR (English)' : 'Switch to RTL (Arabic)');

      // Update text content
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  /* ── Toggle on button click ─────────────── */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-dir-toggle]');
    if (!btn) return;

    const current = html.getAttribute('dir') || 'ltr';
    applyDir(current === 'ltr' ? 'rtl' : 'ltr');
  });

  /* ── Initialize ─────────────────────────── */
  applyDir(getSavedDir());

})();
