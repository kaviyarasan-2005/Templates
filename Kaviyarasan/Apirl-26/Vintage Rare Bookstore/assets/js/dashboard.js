/**
 * VINTAGE RARE BOOKSTORE — DASHBOARD.JS
 * Dashboard interactions: sidebar, tables, charts, role switcher
 */

'use strict';

/* ===== SIDEBAR ===== */
const Sidebar = {
  el: null,
  overlay: null,
  collapseBtn: null,
  KEY: 'vrb_sidebar',

  init() {
    this.el = document.querySelector('.sidebar');
    this.overlay = document.querySelector('.sidebar-overlay');
    this.collapseBtn = document.querySelector('.sidebar-collapse-btn');
    const mobileToggle = document.getElementById('sidebar-toggle');

    if (!this.el) return;

    // Restore state
    const collapsed = localStorage.getItem(this.KEY) === 'collapsed';
    if (collapsed && window.innerWidth > 1024) this.collapse(false);

    // Sidebar collapse button removed; re-routing mobileToggle to handle both
    mobileToggle?.addEventListener('click', () => {
      if (window.innerWidth > 1024) {
        this.toggleCollapse();
      } else {
        this.toggleMobile();
      }
    });
    this.overlay?.addEventListener('click', () => this.closeMobile());

    // Active link
    const path = window.location.pathname.split('/').pop() || 'index.html';
    this.el.querySelectorAll('.sidebar-nav-link').forEach(link => {
      const href = link.getAttribute('href')?.split('/').pop();
      if (href === path) link.classList.add('active');
    });
  },

  toggleCollapse() {
    if (this.el.classList.contains('collapsed')) {
      this.expand();
    } else {
      this.collapse();
    }
  },

  collapse(save = true) {
    this.el.classList.add('collapsed');
    if (save) localStorage.setItem(this.KEY, 'collapsed');
  },

  expand(save = true) {
    this.el.classList.remove('collapsed');
    if (save) localStorage.setItem(this.KEY, 'expanded');
  },

  toggleMobile() {
    const isOpen = this.el.classList.contains('mobile-open');
    if (isOpen) this.closeMobile(); else this.openMobile();
  },

  openMobile() {
    this.el.classList.add('mobile-open');
    this.overlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  },

  closeMobile() {
    this.el.classList.remove('mobile-open');
    this.overlay?.classList.remove('visible');
    document.body.style.overflow = '';
  }
};

/* ===== ROLE SWITCHER ===== */
const RoleSwitcher = {
  KEY: 'vrb_role',
  current: 'admin',

  init() {
    this.current = localStorage.getItem(this.KEY) || 'admin';
    this.apply(this.current, false);

    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        this.apply(role);
      });
    });
  },

  apply(role, save = true) {
    this.current = role;
    if (save) localStorage.setItem(this.KEY, role);

    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-role') === role);
    });

    // Show/hide admin vs user sections
    document.querySelectorAll('[data-role-section]').forEach(section => {
      const sectionRole = section.getAttribute('data-role-section');
      section.style.display = (sectionRole === role || sectionRole === 'both') ? '' : 'none';
    });

    // Update header role badge
    const badge = document.querySelector('.current-role-badge');
    if (badge) {
      badge.textContent = role === 'admin' ? 'Admin' : 'User';
      badge.className = `current-role-badge badge ${role === 'admin' ? 'badge-warning' : 'badge-info'}`;
    }
  }
};

/* ===== DATA TABLE SORT ===== */
function initTableSort() {
  document.querySelectorAll('table').forEach(table => {
    const headers = table.querySelectorAll('thead th[data-sort]');
    headers.forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-sort');
        const asc = !th.classList.contains('sorted-asc');

        headers.forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));
        th.classList.add(asc ? 'sorted-asc' : 'sorted-desc');

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const rows = Array.from(tbody.querySelectorAll('tr'));
        const colIdx = Array.from(th.parentElement.children).indexOf(th);

        rows.sort((a, b) => {
          const aText = a.cells[colIdx]?.textContent.trim() || '';
          const bText = b.cells[colIdx]?.textContent.trim() || '';
          // Numeric sort
          const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
          const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return asc ? aNum - bNum : bNum - aNum;
          }
          return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });

        rows.forEach(row => tbody.appendChild(row));
      });
    });
  });
}

/* ===== TABLE FILTER ===== */
function initTableFilter() {
  document.querySelectorAll('.table-filter-input[data-target]').forEach(input => {
    const tableId = input.getAttribute('data-target');
    const table = document.getElementById(tableId);
    if (!table) return;

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      table.querySelectorAll('tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
      updateTableCount(table);
    });
  });
}

function updateTableCount(table) {
  const visible = table.querySelectorAll('tbody tr:not([style*="display: none"])').length;
  const countEl = table.closest('.table-wrapper')?.querySelector('.table-count');
  if (countEl) countEl.textContent = `${visible} records`;
}

/* ===== STATUS FILTER (ORDERS) ===== */
function initStatusFilter() {
  const filters = document.querySelectorAll('[data-status-filter]');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const status = btn.getAttribute('data-status-filter');
      document.querySelectorAll('[data-status]').forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        row.style.display = (status === 'all' || rowStatus === status) ? '' : 'none';
      });
    });
  });
}

/* ===== DELETE CONFIRMATION ===== */
function initDeleteConfirm() {
  document.querySelectorAll('.action-btn--delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const row = btn.closest('tr');
      const name = row?.cells[1]?.textContent || 'this item';
      if (confirm(`Delete ${name}? This action cannot be undone.`)) {
        row.style.transition = 'opacity 0.3s, transform 0.3s';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        setTimeout(() => row.remove(), 300);
      }
    });
  });
}

/* ===== ORDER DETAIL MODAL ===== */
function initOrderModal() {
  document.querySelectorAll('[data-order-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-order-view');
      const row = btn.closest('tr');
      const modal = document.getElementById('order-modal');
      if (!modal || !row) return;

      // Populate modal with row data
      const cells = row.querySelectorAll('td');
      modal.querySelector('#modal-order-id').textContent = cells[0]?.textContent || '';
      modal.querySelector('#modal-customer').textContent = cells[1]?.textContent || '';
      modal.querySelector('#modal-date').textContent = cells[2]?.textContent || '';
      modal.querySelector('#modal-amount').textContent = cells[3]?.textContent || '';
      modal.querySelector('#modal-status').innerHTML = cells[4]?.innerHTML || '';

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
}

/* ===== CSS BAR CHART ANIMATION ===== */
function initChartBars() {
  const bars = document.querySelectorAll('.chart-bar[data-height]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const height = entry.target.getAttribute('data-height');
        entry.target.style.height = height + 'px';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ===== NOTIFICATION DROPDOWN ===== */
function initNotifications() {
  const btn = document.querySelector('.notif-btn');
  const panel = document.querySelector('.notif-panel');
  if (!btn || !panel) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('open');
    // Clear badge when opened
    const badge = btn.querySelector('.notif-badge');
    if (badge) badge.style.display = 'none';
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
}

/* ===== PROFILE DROPDOWN ===== */
function initProfileDropdown() {
  const btn = document.querySelector('.profile-btn');
  const panel = document.querySelector('.profile-panel');
  if (!btn || !panel) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
}

/* ===== INBOX ===== */
function initInbox() {
  const items = document.querySelectorAll('.inbox-item');
  const preview = document.querySelector('.inbox-preview');
  if (!items.length || !preview) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      item.classList.remove('unread');
      item.querySelector('.inbox-unread-dot')?.remove();

      const from = item.querySelector('.inbox-item-from')?.textContent || '';
      const subject = item.querySelector('.inbox-item-subject')?.textContent || '';
      const body = item.getAttribute('data-body') || 'Please select a message to read.';

      preview.querySelector('#preview-from').textContent = from;
      preview.querySelector('#preview-subject').textContent = subject;
      preview.querySelector('#preview-body').innerHTML = body;
    });
  });
}

/* ===== AVATAR UPLOAD PLACEHOLDER ===== */
function initAvatarUpload() {
  const btn = document.getElementById('avatar-upload-btn');
  const input = document.getElementById('avatar-input');
  const img = document.getElementById('avatar-preview');
  if (!btn || !input) return;

  btn.addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file && img) {
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      reader.readAsDataURL(file);
    }
  });
}

/* ===== SPARKLINE SVG ===== */
function drawSparkline(canvasId, data, color = '#D4AF37') {
  const container = document.getElementById(canvasId);
  if (!container) return;

  const W = container.offsetWidth || 200;
  const H = 60;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 10) - 5;
    return `${x},${y}`;
  });

  const svg = `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width:100%;height:${H}px">
      <defs>
        <linearGradient id="sg-${canvasId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <polygon points="${points.join(' ')} ${W},${H} 0,${H}" fill="url(#sg-${canvasId})"/>
      <polyline points="${points.join(' ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  container.innerHTML = svg;
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  Sidebar.init();
  RoleSwitcher.init();
  initTableSort();
  initTableFilter();
  initStatusFilter();
  initDeleteConfirm();
  initOrderModal();
  initChartBars();
  initNotifications();
  initProfileDropdown();
  initInbox();
  initAvatarUpload();

  // Draw example sparklines
  drawSparkline('sparkline-revenue', [40, 55, 48, 62, 71, 58, 80, 76, 90, 85, 95, 100]);
  drawSparkline('sparkline-orders',  [20, 30, 25, 40, 35, 50, 45, 60, 55, 65, 70, 75], '#8B4513');
});
