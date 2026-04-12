// dashboard.js — Sidebar collapse, animated counters, section switching
document.addEventListener('DOMContentLoaded', () => {

  // ---- Sidebar Toggle ----
  const sidebar = document.getElementById('sidebar');
  const dashMain = document.getElementById('dashMain');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const overlay = document.getElementById('sidebarOverlay');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      } else {
        sidebar.classList.toggle('collapsed');
        dashMain.classList.toggle('collapsed');
      }
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  }

  // ---- Section Switching ----
  window.switchSection = function(sectionId, linkEl) {
    // Hide all sections
    document.querySelectorAll('.dash-section').forEach(s => s.style.display = 'none');
    // Show target section
    const target = document.getElementById(sectionId);
    if (target) { target.style.display = 'block'; }

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (linkEl) linkEl.classList.add('active');

    return false;
  };

  // ---- Animated Counter ----
  function countUp(el, target, prefix) {
    const duration = 1500;
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = (prefix || '') + current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  function initCounters() {
    document.querySelectorAll('.stat-value[data-target]').forEach(el => {
      el.textContent = (el.dataset.prefix || '') + '0';
      const target = parseInt(el.dataset.target);
      const prefix = el.dataset.prefix || '';
      // Only animate when visible
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            countUp(el, target, prefix);
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.3 });
      obs.observe(el);
    });
  }

  initCounters();

  // ---- Auto-switch section from URL query param ----
  const urlParams = new URLSearchParams(window.location.search);
  const sectionParam = urlParams.get('section');
  if (sectionParam) {
    setTimeout(() => switchSection(sectionParam, null), 50);
  }
});
