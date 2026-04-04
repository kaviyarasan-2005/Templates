/* ============================================
   ART GALLERY — DASHBOARD
   Chart.js, Tables, Role Toggle, Stats
   ============================================ */
import { $, $$, animateCount } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  initRoleToggle();
  initCharts();
  initStatCounters();
  initTableSearch();
  initTableSort();
  initTablePagination();
  initDashboardTabs();
});

/* ---------- ROLE SWITCHER (HASH-BASED) ---------- */
function initRoleToggle() {
  const visitorView = $('#visitor-view');
  const adminView = $('#admin-view');
  if (!visitorView && !adminView) return;

  function switchView() {
    const hash = window.location.hash || '#user';
    const isAdmin = hash === '#admin';
    
    if (visitorView) visitorView.style.display = isAdmin ? 'none' : 'block';
    if (adminView) adminView.style.display = isAdmin ? 'block' : 'none';

    // Optional: Update page title or breadcrumbs if they exist
    const pageTitle = $('.dashboard-title');
    if (pageTitle) pageTitle.textContent = isAdmin ? 'Admin Dashboard' : 'User Dashboard';
  }

  // Initial check
  switchView();

  // Listen for hash changes
  window.addEventListener('hashchange', switchView);
}

/* ---------- CHARTS ---------- */
function initCharts() {
  if (typeof Chart === 'undefined') return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#e5e5e5' : '#1a1a1a';
  const gridColor = isDark ? '#2a2a2a' : '#e5e5e5';
  const gold = '#D4AF37';
  const burgundy = '#722F37';
  const copper = '#B87333';

  Chart.defaults.color = textColor;
  Chart.defaults.borderColor = gridColor;
  Chart.defaults.font.family = "'Inter', sans-serif";

  // Visitors Chart (Line)
  const visitorsCtx = $('#visitorsChart');
  if (visitorsCtx) {
    new Chart(visitorsCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Visitors',
          data: [1200, 1900, 1500, 2400, 2100, 2800, 3200],
          borderColor: gold,
          backgroundColor: `${gold}20`,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: gold
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: gridColor } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Revenue Chart (Bar)
  const revenueCtx = $('#revenueChart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Revenue ($)',
          data: [4500, 6200, 5800, 7900, 7100, 8500, 9200],
          backgroundColor: [gold, burgundy, copper, gold, burgundy, copper, gold],
          borderRadius: 6,
          barThickness: 24
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: gridColor } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Category Chart (Doughnut)
  const categoryCtx = $('#categoryChart');
  if (categoryCtx) {
    new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: ['Paintings', 'Sculptures', 'Digital Art', 'Photography'],
        datasets: [{
          data: [45, 25, 20, 10],
          backgroundColor: [gold, burgundy, copper, '#4a5568'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true } }
        },
        cutout: '65%'
      }
    });
  }

  // Listen for theme changes to update charts
  const observer = new MutationObserver(() => {
    const nowDark = document.documentElement.getAttribute('data-theme') === 'dark';
    Chart.defaults.color = nowDark ? '#e5e5e5' : '#1a1a1a';
    Chart.defaults.borderColor = nowDark ? '#2a2a2a' : '#e5e5e5';
    Chart.instances.forEach(chart => chart.update());
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

/* ---------- STAT COUNTERS ---------- */
function initStatCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        animateCount(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ---------- TABLE SEARCH ---------- */
function initTableSearch() {
  $$('[data-table-search]').forEach(input => {
    const tableId = input.dataset.tableSearch;
    const table = $(`#${tableId}`);
    if (!table) return;

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase();
      const rows = $$('tbody tr', table);
      let matchCount = 0;

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = text.includes(query);
        row.style.display = match ? '' : 'none';
        if (match) matchCount++;
      });

      const countEl = $(`[data-search-count="${tableId}"]`);
      if (countEl) countEl.textContent = `${matchCount} result${matchCount !== 1 ? 's' : ''}`;
    });
  });
}

/* ---------- TABLE SORT ---------- */
function initTableSort() {
  $$('.data-table th[data-sort]').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const table = th.closest('.data-table');
      const index = Array.from(th.parentElement.children).indexOf(th);
      const rows = $$('tbody tr', table);
      const isAsc = th.classList.contains('sort-asc');

      // Reset all sort indicators
      $$('th[data-sort]', table).forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
      th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');

      const sorted = rows.sort((a, b) => {
        const aVal = a.children[index]?.textContent.trim() || '';
        const bVal = b.children[index]?.textContent.trim() || '';
        const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ''));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return isAsc ? bNum - aNum : aNum - bNum;
        }
        return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      });

      const tbody = $('tbody', table);
      sorted.forEach(row => tbody.appendChild(row));
    });
  });
}

/* ---------- PAGINATION ---------- */
function initTablePagination() {
  $$('[data-paginate]').forEach(container => {
    const tableId = container.dataset.paginate;
    const table = $(`#${tableId}`);
    if (!table) return;

    const perPage = parseInt(container.dataset.perPage) || 5;
    const rows = $$('tbody tr', table);
    const totalPages = Math.ceil(rows.length / perPage);
    let currentPage = 1;

    function showPage(page) {
      currentPage = page;
      rows.forEach((row, i) => {
        row.style.display = (i >= (page - 1) * perPage && i < page * perPage) ? '' : 'none';
      });
      renderPagination();
    }

    function renderPagination() {
      container.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `pagination__btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => showPage(i));
        container.appendChild(btn);
      }
    }

    if (rows.length > perPage) showPage(1);
  });
}

/* ---------- DASHBOARD TABS ---------- */
function initDashboardTabs() {
  $$('.tabs').forEach(tabContainer => {
    const buttons = $$('.tab-btn', tabContainer);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const parent = tabContainer.parentElement;
        $$('.tab-pane', parent).forEach(pane => {
          pane.style.display = pane.id === target ? 'block' : 'none';
        });
      });
    });
  });
}
