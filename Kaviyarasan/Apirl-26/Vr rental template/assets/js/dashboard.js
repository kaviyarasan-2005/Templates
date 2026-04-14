/* ============================================================
   RV ADVEN RENTALS - Dashboard JavaScript
   Version: 1.0.0
   ============================================================ */

'use strict';

// ============================================================
// 1. DASHBOARD STATE
// ============================================================
const DashboardState = {
  role: 'admin', // Default to admin for non-user pages

  init() {
    // Detect role from document attribute or path
    const path = window.location.pathname;
    if (path.includes('user-dashboard.html')) {
      this.role = 'user';
    } else {
      this.role = 'admin';
    }
    
    this.applyRole();
  },

  applyRole() {
    document.documentElement.setAttribute('data-role', this.role);
    // Role-specific badge logic
    const badge = document.querySelector('[data-role-badge]');
    if (badge) {
      badge.textContent = this.role === 'admin' ? 'Admin' : 'User';
      badge.className = `role-badge badge ${this.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`;
    }
  }
};

// ============================================================
// 2. SIDEBAR NAVIGATION
// ============================================================
const Sidebar = {
  el: null,
  overlay: null,
  isOpen: false,

  init() {
    this.el = document.getElementById('dash-sidebar');
    this.overlay = document.getElementById('dash-overlay');
    const toggleBtn = document.getElementById('dash-sidebar-toggle');
    const closeBtn = document.querySelector('[data-sidebar-close]');

    if (toggleBtn) toggleBtn.addEventListener('click', () => this.toggle());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (this.overlay) this.overlay.addEventListener('click', () => this.close());

    // Active link highlighting
    this.highlightActive();

    // Auto-close overlay on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && this.isOpen) {
        this.close();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    this.isOpen = true;
    this.el?.classList.add('open');
    this.overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.isOpen = false;
    this.el?.classList.remove('open');
    this.overlay?.classList.remove('open');
    document.body.style.overflow = '';
  },

  highlightActive() {
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.dash-nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
};

// ============================================================
// 3. CHARTS (Chart.js required)
// ============================================================
const Charts = {
  instances: {},

  init() {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-text-secondary').trim() || '#5D6D7E';

    this.destroyAll();
    
    if (DashboardState.role === 'user') {
      this.userMilesGauge();
      this.userSpendingChart();
      this.userTerrainChart();
      this.userPointsChart();
    } else {
      this.bookingTrendChart();
      this.vehicleTypeChart();
      this.revenueChart();
      this.availabilityChart();
    }
  },

  destroyAll() {
    Object.values(this.instances).forEach(chart => chart?.destroy());
    this.instances = {};
  },

  getThemeColors() {
    return {
      primary: '#2E5C47',
      primaryLight: 'rgba(46,92,71,0.12)',
      secondary: '#E67E22',
      secondaryLight: 'rgba(230,126,34,0.12)',
      accent: '#F1C40F',
      info: '#3498DB',
      success: '#27AE60',
      grid: 'rgba(0,0,0,0.06)'
    };
  },

  bookingTrendChart() {
    const ctx = document.getElementById('bookingTrendChart');
    if (!ctx) return;
    const c = this.getThemeColors();
    const isAdmin = DashboardState.role === 'admin';

    this.instances.bookingTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: isAdmin ? 'Total Bookings' : 'My Trips',
          data: isAdmin
            ? [42, 58, 71, 85, 102, 138, 165, 172, 121, 88, 64, 51]
            : [1, 0, 2, 1, 3, 2, 4, 3, 1, 2, 1, 0],
          borderColor: c.primary,
          backgroundColor: 'rgba(46,92,71,0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: c.primary,
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A1A2E',
            padding: 12,
            cornerRadius: 8,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: c.grid, drawBorder: false },
            ticks: { padding: 8 }
          },
          x: {
            grid: { display: false },
            ticks: { padding: 4 }
          }
        }
      }
    });
  },

  vehicleTypeChart() {
    const ctx = document.getElementById('vehicleTypeChart');
    if (!ctx) return;
    const c = this.getThemeColors();

    this.instances.vehicleType = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Class A Motorhome', 'Class B Campervan', 'Travel Trailer', 'Pop-up Camper', 'Truck Camper'],
        datasets: [{
          data: [28, 35, 22, 8, 7],
          backgroundColor: [c.primary, c.secondary, c.accent, c.info, c.success],
          borderWidth: 0,
          spacing: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: { padding: 16, usePointStyle: true, pointStyleWidth: 8 }
          },
          tooltip: {
            backgroundColor: '#1A1A2E',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.raw}%`
            }
          }
        }
      }
    });
  },

  revenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    const c = this.getThemeColors();

    this.instances.revenue = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Revenue',
            data: [18400, 24200, 31500, 38800, 47200, 61400, 73800, 76500, 54200, 39100, 28600, 22800],
            backgroundColor: 'rgba(46,92,71,0.75)',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Expenses',
            data: [8200, 9100, 11200, 12800, 14500, 18200, 21400, 22100, 16800, 13200, 10400, 9800],
            backgroundColor: 'rgba(230,126,34,0.65)',
            borderRadius: 6,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: { usePointStyle: true, pointStyleWidth: 8, padding: 16 }
          },
          tooltip: {
            backgroundColor: '#1A1A2E',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: c.grid, drawBorder: false },
            ticks: {
              padding: 8,
              callback: v => '$' + (v / 1000) + 'k'
            }
          },
          x: { grid: { display: false } }
        }
      }
    });
  },

  availabilityChart() {
    const ctx = document.getElementById('availabilityChart');
    if (!ctx) return;
    const c = this.getThemeColors();

    this.instances.availability = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Class A', 'Class B', 'Trailer', 'Pop-up', 'Truck'],
        datasets: [
          {
            label: 'Available',
            data: [5, 8, 4, 6, 3],
            backgroundColor: 'rgba(39,174,96,0.75)',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Booked',
            data: [3, 5, 6, 2, 4],
            backgroundColor: 'rgba(231,76,60,0.65)',
            borderRadius: 6,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: { usePointStyle: true, pointStyleWidth: 8, padding: 16 }
          },
          tooltip: {
            backgroundColor: '#1A1A2E', padding: 12, cornerRadius: 8,
          }
        },
        scales: {
          x: {
            stacked: false,
            grid: { color: c.grid, drawBorder: false },
            ticks: { stepSize: 1 }
          },
          y: { grid: { display: false } }
        }
      }
    });
  },

  // ============================================================
  // USER DASHBOARD CHARTS
  // ============================================================
  userMilesGauge() {
    const ctx = document.getElementById('userMilesGauge');
    if (!ctx) return;
    const c = this.getThemeColors();

    this.instances.userMiles = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [4820, 180], // 4820 covered, 180 remaining to goal (5000)
          backgroundColor: [c.primary, c.grid],
          borderWidth: 0,
          circumference: 270,
          rotation: 225,
          cutout: '85%',
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: { enabled: false }, legend: { display: false } }
      }
    });
  },

  userSpendingChart() {
    const ctx = document.getElementById('userSpendingChart');
    if (!ctx) return;
    const c = this.getThemeColors();

    this.instances.userSpending = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [{
          label: 'Spending ($)',
          data: [420, 310, 850, 240, 520, 150],
          backgroundColor: c.secondary,
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: c.grid, drawBorder: false }, ticks: { font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
  },

  userTerrainChart() {
    const ctx = document.getElementById('userTerrainChart');
    if (!ctx) return;
    const c = this.getThemeColors();

    this.instances.userTerrain = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Mountain', 'Desert', 'Forest', 'Beach'],
        datasets: [{
          data: [40, 15, 30, 15],
          backgroundColor: [c.primary, c.accent, c.success, c.info],
          borderWidth: 2,
          borderColor: 'transparent'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
        }
      }
    });
  },

  userPointsChart() {
    const ctx = document.getElementById('userPointsChart');
    if (!ctx) return;
    const c = this.getThemeColors();

    this.instances.userPoints = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'],
        datasets: [{
          label: 'Points Accumulation',
          data: [1200, 1450, 1900, 2400, 2950, 3450],
          borderColor: c.primary,
          backgroundColor: 'rgba(46,92,71,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: c.grid, drawBorder: false }, ticks: { font: { size: 9 } } },
          x: { grid: { display: false }, ticks: { font: { size: 9 } } }
        }
      }
    });
  }
};

// ============================================================
// 4. DASHBOARD STATS COUNTER (same as main but scoped)
// ============================================================
const DashStats = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1500;
        const start = performance.now();
        const update = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
  }
};

// ============================================================
// 5. DATA TABLE MANAGEMENT
// ============================================================
const DataTable = {
  init() {
    this.initSorting();
    this.initSearch();
    this.initPagination();
  },

  initSorting() {
    document.querySelectorAll('[data-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const table = th.closest('table');
        const col = [...th.parentElement.children].indexOf(th);
        const tbody = table.querySelector('tbody');
        const rows = [...tbody.querySelectorAll('tr')];
        const asc = th.getAttribute('data-order') !== 'asc';

        rows.sort((a, b) => {
          const aVal = a.children[col]?.textContent.trim() || '';
          const bVal = b.children[col]?.textContent.trim() || '';
          const numA = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
          const numB = parseFloat(bVal.replace(/[^0-9.-]/g, ''));
          if (!isNaN(numA) && !isNaN(numB)) return asc ? numA - numB : numB - numA;
          return asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });

        table.querySelectorAll('[data-sort]').forEach(h => h.removeAttribute('data-order'));
        th.setAttribute('data-order', asc ? 'asc' : 'desc');
        rows.forEach(row => tbody.appendChild(row));
      });
    });
  },

  initSearch() {
    const input = document.querySelector('[data-table-search]');
    if (!input) return;
    const target = document.querySelector(input.getAttribute('data-table-search'));
    if (!target) return;

    input.addEventListener('input', () => {
      const q = input.value.toLowerCase();
      target.querySelectorAll('tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  },

  initPagination() {
    const tables = document.querySelectorAll('[data-paginate]');
    tables.forEach(table => {
      const perPage = parseInt(table.getAttribute('data-paginate'), 10) || 10;
      const rows = [...table.querySelectorAll('tbody tr')];
      const totalPages = Math.ceil(rows.length / perPage);
      let current = 1;

      const container = document.querySelector('[data-pagination-for="' + table.id + '"]');
      if (!container) return;

      const render = () => {
        rows.forEach((row, i) => {
          row.style.display = (i >= (current - 1) * perPage && i < current * perPage) ? '' : 'none';
        });
        container.innerHTML = '';
        for (let p = 1; p <= totalPages; p++) {
          const btn = document.createElement('button');
          btn.textContent = p;
          btn.className = `pagination-btn ${p === current ? 'active' : ''}`;
          btn.addEventListener('click', () => { current = p; render(); });
          container.appendChild(btn);
        }
      };

      render();
    });
  }
};

// ============================================================
// 6. BOOKING MODAL
// ============================================================
const BookingModal = {
  init() {
    document.querySelectorAll('[data-booking-details]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-booking-details');
        this.open(id);
      });
    });

    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });
  },

  open(bookingId) {
    const modal = document.getElementById('bookingModal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Populate with booking data (would come from API in production)
      const idEl = modal.querySelector('[data-booking-id]');
      if (idEl) idEl.textContent = '#' + bookingId;
    }
  },

  close() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
};

// ============================================================
// 7. NOTIFICATION SYSTEM
// ============================================================
const Notifications = {
  count: 3,

  init() {
    const badge = document.querySelector('[data-notif-count]');
    if (badge) badge.textContent = this.count;

    document.querySelector('[data-notif-toggle]')?.addEventListener('click', () => {
      const panel = document.querySelector('.notif-panel');
      panel?.classList.toggle('open');
    });

    document.addEventListener('click', e => {
      const panel = document.querySelector('.notif-panel');
      if (panel?.classList.contains('open') &&
          !e.target.closest('.notif-panel') &&
          !e.target.closest('[data-notif-toggle]')) {
        panel.classList.remove('open');
      }
    });

    document.querySelectorAll('[data-mark-read]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.notif-item');
        item?.classList.add('read');
        this.count = Math.max(0, this.count - 1);
        const badge = document.querySelector('[data-notif-count]');
        if (badge) badge.textContent = this.count || '';
      });
    });
  }
};

// ============================================================
// 8. FLEET STATUS UPDATE
// ============================================================
const FleetManager = {
  init() {
    document.querySelectorAll('[data-status-change]').forEach(select => {
      select.addEventListener('change', () => {
        const row = select.closest('tr');
        const statusCell = row?.querySelector('[data-status-cell]');
        if (!statusCell) return;

        const status = select.value;
        const classes = {
          available: 'badge-success',
          booked: 'badge-error',
          maintenance: 'badge-warning',
          pending: 'badge-info'
        };

        statusCell.className = `badge ${classes[status] || 'badge-info'}`;
        statusCell.textContent = status.charAt(0).toUpperCase() + status.slice(1);

        if (window.RVApp?.Toast) {
          window.RVApp.Toast.show('Vehicle status updated successfully.', 'success');
        }
      });
    });
  }
};

// ============================================================
// 9. INITIALIZE  
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  DashboardState.init();
  Sidebar.init();
  DataTable.init();
  BookingModal.init();
  Notifications.init();
  FleetManager.init();
  DashStats.init();

  // Initialize charts after a brief delay for layout stability
  setTimeout(() => Charts.init(), 100);

  // Inject pagination button styles
  const style = document.createElement('style');
  style.textContent = `
    .pagination-btn {
      width: 36px; height: 36px; border: 1.5px solid var(--color-border);
      background: white; border-radius: 8px; cursor: pointer; font-size: 0.875rem;
      font-weight: 500; color: var(--color-text-secondary);
      transition: all 0.2s ease;
    }
    .pagination-btn.active, .pagination-btn:hover {
      background: var(--color-primary); color: white; border-color: var(--color-primary);
    }
    .notif-panel {
      position: absolute; top: calc(100% + 8px); right: 0;
      width: 320px; background: var(--color-bg-card);
      border-radius: var(--radius-xl); box-shadow: var(--shadow-xl);
      border: 1px solid var(--color-border); display: none;
    }
    .notif-panel.open { display: block; }
    .notif-item { padding: 14px 16px; border-bottom: 1px solid var(--color-border-light); }
    .notif-item.read { opacity: 0.5; }
    .notif-item:last-child { border-bottom: none; }
    .sidebar-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 998;
      backdrop-filter: blur(4px);
    }
    .sidebar-overlay.open { display: block; }
    [data-role="admin"] .dashboard-title::after { content: ' (Admin)'; font-size: 0.7em; opacity: 0.6; }
    [data-role="user"] .dashboard-title::after { content: ' (User)'; font-size: 0.7em; opacity: 0.6; }
  `;
  document.head.appendChild(style);
});
