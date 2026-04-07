/**
 * dashboard.js
 * Role-based view switching, sidebar, tabs
 */

export function initDashboard() {
  const userRole = localStorage.getItem('user-role') || 'guest'; // 'guest', 'user', 'admin'
  
  const guestViews = document.querySelectorAll('.view-guest');
  const userViews = document.querySelectorAll('.view-user');
  const adminViews = document.querySelectorAll('.view-admin');

  // Helper to toggle visibility based on role
  function applyRoleViews(role) {
    if (role === 'guest') {
      guestViews.forEach(v => v.classList.remove('u-hidden'));
      userViews.forEach(v => v.classList.add('u-hidden'));
      adminViews.forEach(v => v.classList.add('u-hidden'));
    } else if (role === 'user') {
      guestViews.forEach(v => v.classList.add('u-hidden'));
      userViews.forEach(v => v.classList.remove('u-hidden'));
      adminViews.forEach(v => v.classList.add('u-hidden'));
    } else if (role === 'admin') {
      guestViews.forEach(v => v.classList.add('u-hidden'));
      userViews.forEach(v => v.classList.add('u-hidden'));
      adminViews.forEach(v => v.classList.remove('u-hidden'));
    }
  }

  applyRoleViews(userRole);

  // Tab Switching
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active', 'animate-fade-in'));

      // Add to current
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const content = document.getElementById(targetId);
      if (content) {
        content.classList.add('active', 'animate-fade-in');
      }
    });
  });

  // Sidebar Collapse (Desktop)
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const mainContent = document.querySelector('.dashboard-main');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      if (mainContent) {
        mainContent.classList.toggle('expanded');
      }
    });
  }

  // Development helper: Role switcher dropdown
  const devSwitcher = document.getElementById('devRoleSwitcher');
  if (devSwitcher) {
    devSwitcher.value = userRole;
    devSwitcher.addEventListener('change', (e) => {
      localStorage.setItem('user-role', e.target.value);
      window.location.reload();
    });
  }
}
