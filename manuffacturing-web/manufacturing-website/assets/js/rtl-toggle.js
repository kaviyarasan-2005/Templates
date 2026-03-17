/* ============================================================
   FORGECORE — rtl-toggle.js
   Handles LTR/RTL direction switching
   ============================================================ */

(function () {
  const STORAGE_KEY = 'forgecore_dir';
  const html = document.documentElement;
  const rtlBtn = document.getElementById('rtl-toggle-btn');

  /* Load saved preference */
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    html.setAttribute('dir', saved);
    updateBtn(saved);
  }

  function updateBtn(dir) {
    if (!rtlBtn) return;
    const icon = rtlBtn.querySelector('i');
    const tooltip = rtlBtn.querySelector('.rtl-tooltip');
    if (dir === 'rtl') {
      rtlBtn.title = 'Switch to LTR';
      rtlBtn.setAttribute('aria-label', 'Switch to left-to-right layout');
      if (tooltip) tooltip.textContent = 'Switch to LTR';
      rtlBtn.classList.add('active-rtl');
    } else {
      rtlBtn.title = 'Switch to RTL';
      rtlBtn.setAttribute('aria-label', 'Switch to right-to-left layout');
      if (tooltip) tooltip.textContent = 'Switch to RTL';
      rtlBtn.classList.remove('active-rtl');
    }
  }

  function toggle() {
    const current = html.getAttribute('dir') || 'ltr';
    const next = current === 'ltr' ? 'rtl' : 'ltr';
    html.setAttribute('dir', next);
    localStorage.setItem(STORAGE_KEY, next);
    updateBtn(next);

    /* Animate direction change */
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => { document.body.style.transition = ''; }, 300);
  }

  rtlBtn?.addEventListener('click', toggle);
  rtlBtn?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });

  /* Keyboard shortcut: Alt + R */
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'r') toggle();
  });
})();
