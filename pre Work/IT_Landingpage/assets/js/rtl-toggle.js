// ===== RTL-TOGGLE.JS =====
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.rtl-toggle');
  if (!toggleBtn) return;

  // Load saved direction
  const saved = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', saved);
  updateIcon(saved);
  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', next);
    localStorage.setItem('dir', next);
    updateIcon(next);
  });
  function updateIcon(dir) {
    const icon = toggleBtn.querySelector('i');
    if (icon){
      icon.className = dir === 'rtl' ? 'fas fa-globe-americas' : 'fas fa-globe-asia';
    }
  }
});