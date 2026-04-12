// dashboard.js — Role switching, sidebar collapse, animated counters

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

  // ---- Role Switcher ----
  window.switchRole = function(role) {
    const adminNav = document.getElementById('adminNav');
    const userNav = document.getElementById('userNav');
    const roleAdminBtn = document.getElementById('roleAdmin');
    const roleUserBtn = document.getElementById('roleUser');

    if (role === 'admin') {
      if (adminNav) adminNav.style.display = 'block';
      if (userNav) userNav.style.display = 'none';
      roleAdminBtn.classList.add('active');
      roleUserBtn.classList.remove('active');
      // Show admin overview
      document.querySelectorAll('.dash-section').forEach(s => s.style.display = 'none');
      const ov = document.getElementById('admin-overview');
      if (ov) ov.style.display = 'block';
      // Re-trigger counters
      initCounters();
    } else {
      if (adminNav) adminNav.style.display = 'none';
      if (userNav) userNav.style.display = 'block';
      roleUserBtn.classList.add('active');
      roleAdminBtn.classList.remove('active');
      // Show user overview
      document.querySelectorAll('.dash-section').forEach(s => s.style.display = 'none');
      const ov = document.getElementById('user-overview');
      if (ov) ov.style.display = 'block';
    }
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

  // ---- Auto-switch role from URL query param (?role=admin or ?role=user) ----
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  if (roleParam === 'admin' || roleParam === 'user') {
    // Slight delay to ensure DOM is fully ready
    setTimeout(() => switchRole(roleParam), 50);
  }
});
