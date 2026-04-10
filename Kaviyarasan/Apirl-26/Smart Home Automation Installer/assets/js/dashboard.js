/* ============================================
   DASHBOARD.JS — Charts, Skeleton, Sidebar
   ============================================ */

(function () {
  'use strict';

  // ---- Skeleton Loader ----
  const SkeletonLoader = {
    init() {
      setTimeout(() => {
        document.querySelectorAll('.skeleton-wrapper').forEach(wrapper => {
          wrapper.style.display = 'none';
          const target = wrapper.nextElementSibling;
          if (target) target.style.display = '';
        });
        this.initCharts();
      }, 1500);
    }
  };

  // ---- Sidebar Toggle ----
  const Sidebar = {
    init() {
      const toggle = document.getElementById('sidebar-toggle');
      const sidebar = document.querySelector('.dashboard__sidebar');
      const overlay = document.getElementById('sidebar-overlay');
      if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
          sidebar.classList.toggle('open');
          if (overlay) overlay.classList.toggle('open');
        });
      }
      if (overlay) {
        overlay.addEventListener('click', () => {
          sidebar.classList.remove('open');
          overlay.classList.remove('open');
        });
      }
    }
  };


  // ---- Charts ----
  const Charts = {
    init() {
      this.initInstallationsChart();
      this.initRevenueChart();
      this.initDevicesChart();
    },
    getColors() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      return {
        primary: '#2563EB',
        accent: '#38BDF8',
        success: '#10B981',
        warning: '#F59E0B',
        grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        text: isDark ? '#94A3B8' : '#64748B'
      };
    },
    initInstallationsChart() {
      const ctx = document.getElementById('installationsChart');
      if (!ctx || typeof Chart === 'undefined') return;
      const c = this.getColors();
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          datasets: [{
            label: 'Installations',
            data: [42, 58, 65, 47, 73, 82, 69, 91],
            backgroundColor: c.primary,
            borderRadius: 6,
            barThickness: 24
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: c.grid }, ticks: { color: c.text, font: { size: 11 } } },
            x: { grid: { display: false }, ticks: { color: c.text, font: { size: 11 } } }
          }
        }
      });
    },
    initRevenueChart() {
      const ctx = document.getElementById('revenueChart');
      if (!ctx || typeof Chart === 'undefined') return;
      const c = this.getColors();
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          datasets: [{
            label: 'Revenue ($)',
            data: [18500, 22400, 28100, 24300, 31200, 38700, 34500, 42100],
            borderColor: c.accent,
            backgroundColor: 'rgba(56,189,248,0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: c.accent
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: c.grid }, ticks: { color: c.text, font: { size: 11 }, callback: v => '$' + (v/1000) + 'k' } },
            x: { grid: { display: false }, ticks: { color: c.text, font: { size: 11 } } }
          }
        }
      });
    },
    initDevicesChart() {
      const ctx = document.getElementById('devicesChart');
      if (!ctx || typeof Chart === 'undefined') return;
      const c = this.getColors();
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Lighting', 'Security', 'Climate', 'Entertainment', 'Energy'],
          datasets: [{
            data: [28, 24, 20, 16, 12],
            backgroundColor: [c.primary, c.accent, c.success, c.warning, '#8B5CF6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 }, color: c.text } }
          }
        }
      });
    }
  };

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', () => {
    Sidebar.init();

    // Show skeletons, then load charts
    setTimeout(() => {
      document.querySelectorAll('.skeleton-wrapper').forEach(w => {
        w.style.display = 'none';
        const next = w.nextElementSibling;
        if (next) next.classList.remove('hidden');
      });
      Charts.init();
    }, 1200);
  });
})();
