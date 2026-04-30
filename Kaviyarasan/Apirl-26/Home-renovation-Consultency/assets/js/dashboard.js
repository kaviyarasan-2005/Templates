/**
 * Renovo - Dashboard JavaScript
 * dashboard.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sidebar toggle
  const sidebar = document.querySelector('.dashboard-sidebar');
  const main = document.querySelector('.dashboard-main');
  const toggleBtn = document.querySelector('#sidebar-toggle');
  const mobileToggle = document.querySelector('#mobile-sidebar-toggle');
  const overlay = document.querySelector('.dashboard-overlay');
  
  if(toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar?.classList.toggle('collapsed');
      main?.classList.toggle('expanded');
    });
  }

  function openMobileSidebar() {
    sidebar?.classList.add('open');
    overlay?.classList.add('open');
  }

  function closeMobileSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('open');
  }

  mobileToggle?.addEventListener('click', openMobileSidebar);
  overlay?.addEventListener('click', closeMobileSidebar);

  // Animated bar charts
  const bars = document.querySelectorAll('.chart-bar-fill');
  if(bars.length) {
    setTimeout(() => {
      bars.forEach(bar => {
        bar.style.height = bar.getAttribute('data-height');
      });
    }, 300);
  }

  // User Dropdown toggle
  const userBtn = document.querySelector('.user-dropdown-btn');
  const userMenu = document.querySelector('.user-dropdown-menu');
  
  userBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenu?.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    userMenu?.classList.remove('show');
  });

  // Basic Tabs
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      const siblings = tab.parentElement.children;
      for(let s of siblings) s.classList.remove('active');
      tab.classList.add('active');
      
      const panes = document.querySelectorAll('.tab-pane');
      panes.forEach(p => p.classList.remove('active'));
      document.getElementById(target)?.classList.add('active');
    });
  });
});
