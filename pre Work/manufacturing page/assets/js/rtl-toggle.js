// RTL Toggle Script
document.addEventListener('DOMContentLoaded', function() {
  const rtlBtn = document.querySelector('.rtl-toggle');
  if (!rtlBtn) return;

  // Check saved preference
  const saved = localStorage.getItem('forxa-dir');
  if (saved) {
    document.documentElement.setAttribute('dir', saved);
  }

  rtlBtn.addEventListener('click', function() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', next);
    localStorage.setItem('forxa-dir', next);
  });
});
