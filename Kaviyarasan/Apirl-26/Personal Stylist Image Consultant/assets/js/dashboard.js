/* ============================================================
   DASHBOARD.JS — Admin & User Dashboard Logic
   Charts (CSS/SVG), Tables, Sidebar, Calendar
   ============================================================ */
'use strict';

(function () {

  /* ── Sidebar Toggle ─────────────────────── */
  function initSidebar() {
    const toggleBtns = document.querySelectorAll('[data-sidebar-toggle]');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const layout = document.querySelector('.dashboard-layout');

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sidebar?.classList.toggle('collapsed');
        layout?.classList.toggle('sidebar-collapsed');
        // Persist state
        const collapsed = sidebar?.classList.contains('collapsed');
        localStorage.setItem('sidebar-collapsed', collapsed);
      });
    });

    // Restore state
    if (localStorage.getItem('sidebar-collapsed') === 'true') {
      sidebar?.classList.add('collapsed');
      layout?.classList.add('sidebar-collapsed');
    }
  }

  /* ── Active Sidebar Link ────────────────── */
  function initActiveSidebarLink() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-nav-link').forEach(link => {
      const href = link.getAttribute('href')?.split('/').pop();
      if (href && href === currentPage) {
        link.classList.add('active');
      }
    });
  }

  /* ── SVG Bar Chart ──────────────────────── */
  function renderBarChart(canvasId, data) {
    const container = document.getElementById(canvasId);
    if (!container) return;

    const max = Math.max(...data.values, 1);
    const barWidth = 30;
    const gap = 16;
    const height = 180;
    const totalWidth = data.values.length * (barWidth + gap);

    const bars = data.values.map((val, i) => {
      const barHeight = (val / max) * height;
      const x = i * (barWidth + gap);
      const y = height - barHeight;
      return `
        <g class="chart-bar-group">
          <rect
            x="${x}" y="${y}" width="${barWidth}" height="${barHeight}"
            rx="4"
            fill="url(#barGradient)"
            class="chart-bar"
          />
          <text x="${x + barWidth / 2}" y="${height + 18}" text-anchor="middle"
            font-size="10" fill="var(--text-muted)">${data.labels[i]}</text>
          <text x="${x + barWidth / 2}" y="${y - 6}" text-anchor="middle"
            font-size="10" font-weight="600" fill="var(--text-secondary)">${val}</text>
        </g>
      `;
    }).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${totalWidth + 20} ${height + 40}"
           xmlns="http://www.w3.org/2000/svg"
           style="width:100%;overflow:visible">
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6D4C41"/>
            <stop offset="100%" stop-color="#D9B8A6"/>
          </linearGradient>
        </defs>
        <g transform="translate(10, 10)">
          ${bars}
        </g>
      </svg>
    `;
  }

  /* ── SVG Donut Chart ────────────────────── */
  function renderDonutChart(canvasId, data) {
    const container = document.getElementById(canvasId);
    if (!container) return;

    const total = data.values.reduce((a, b) => a + b, 0);
    const colors = ['#6D4C41', '#D9B8A6', '#E8CFC5', '#8D6E63', '#4E342E'];
    const size = 160;
    const cx = size / 2;
    const cy = size / 2;
    const R = 60;
    const r = 38;

    let startAngle = -90;
    const segments = data.values.map((val, i) => {
      const angle = (val / total) * 360;
      const endAngle = startAngle + angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = cx + R * Math.cos(startRad);
      const y1 = cy + R * Math.sin(startRad);
      const x2 = cx + R * Math.cos(endRad);
      const y2 = cy + R * Math.sin(endRad);

      const ix1 = cx + r * Math.cos(startRad);
      const iy1 = cy + r * Math.sin(startRad);
      const ix2 = cx + r * Math.cos(endRad);
      const iy2 = cy + r * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;
      const path = `M${x1},${y1} A${R},${R} 0 ${largeArc},1 ${x2},${y2}
                   L${ix2},${iy2} A${r},${r} 0 ${largeArc},0 ${ix1},${iy1} Z`;

      startAngle = endAngle;
      return `<path d="${path}" fill="${colors[i % colors.length]}" opacity="0.9"/>`;
    }).join('');

    const legendItems = data.labels.map((label, i) => `
      <div class="chart-legend-item">
        <span class="legend-dot" style="background:${colors[i % colors.length]}"></span>
        <span class="legend-label">${label}</span>
        <span class="legend-value">${Math.round((data.values[i] / total) * 100)}%</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="donut-chart-wrap">
        <svg viewBox="0 0 ${size} ${size}" style="width:160px;height:160px">
          ${segments}
          <text x="${cx}" y="${cy + 5}" text-anchor="middle"
            font-size="18" font-weight="700" fill="var(--text-primary)">${total}</text>
          <text x="${cx}" y="${cy + 22}" text-anchor="middle"
            font-size="10" fill="var(--text-muted)">Total</text>
        </svg>
        <div class="chart-legend">${legendItems}</div>
      </div>
    `;
  }

  /* ── Table Sort ─────────────────────────── */
  function initTableSort() {
    document.querySelectorAll('.data-table th[data-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const table = th.closest('table');
        const tbody = table?.querySelector('tbody');
        if (!tbody) return;

        const col = th.cellIndex;
        const isAsc = th.dataset.sortDir !== 'asc';
        th.dataset.sortDir = isAsc ? 'asc' : 'desc';

        // Reset others
        table.querySelectorAll('th[data-sort]').forEach(h => {
          if (h !== th) delete h.dataset.sortDir;
          h.querySelector('.sort-icon')?.remove();
        });

        // Add sort icon
        th.querySelector('.sort-icon')?.remove();
        const icon = document.createElement('span');
        icon.className = 'sort-icon';
        icon.textContent = isAsc ? ' ↑' : ' ↓';
        th.appendChild(icon);

        const rows = [...tbody.querySelectorAll('tr')];
        rows.sort((a, b) => {
          const aVal = a.cells[col]?.textContent.trim() || '';
          const bVal = b.cells[col]?.textContent.trim() || '';
          const num = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
          if (!isNaN(num)) {
            return isAsc ? num - parseFloat(bVal.replace(/[^0-9.-]/g, '')) : parseFloat(bVal.replace(/[^0-9.-]/g, '')) - num;
          }
          return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });

        rows.forEach(row => tbody.appendChild(row));
      });
    });
  }

  /* ── Table Search ───────────────────────── */
  function initTableSearch() {
    document.querySelectorAll('[data-table-search]').forEach(input => {
      const tableId = input.dataset.tableSearch;
      const table = document.getElementById(tableId);
      if (!table) return;

      input.addEventListener('input', () => {
        const query = input.value.toLowerCase();
        table.querySelectorAll('tbody tr').forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      });
    });
  }

  /* ── Mini Calendar ──────────────────────── */
  function initCalendar() {
    const calendar = document.getElementById('dashboard-calendar');
    if (!calendar) return;

    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();

    // Dummy appointments
    const appointments = [3, 7, 12, 15, 22, 28];

    function render() {
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

      let html = `
        <div class="cal-header">
          <button class="cal-prev" id="calPrev" aria-label="Previous month">&#8249;</button>
          <span class="cal-title">${monthName} ${year}</span>
          <button class="cal-next" id="calNext" aria-label="Next month">&#8250;</button>
        </div>
        <div class="cal-grid">
          <div class="cal-day-name">Su</div>
          <div class="cal-day-name">Mo</div>
          <div class="cal-day-name">Tu</div>
          <div class="cal-day-name">We</div>
          <div class="cal-day-name">Th</div>
          <div class="cal-day-name">Fr</div>
          <div class="cal-day-name">Sa</div>
      `;

      for (let i = 0; i < firstDay; i++) {
        html += '<div class="cal-day empty"></div>';
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
        const hasAppt = appointments.includes(d);
        html += `<div class="cal-day ${isToday ? 'today' : ''} ${hasAppt ? 'has-event' : ''}">${d}</div>`;
      }

      html += '</div>';
      calendar.innerHTML = html;

      document.getElementById('calPrev')?.addEventListener('click', () => {
        month--;
        if (month < 0) { month = 11; year--; }
        render();
      });
      document.getElementById('calNext')?.addEventListener('click', () => {
        month++;
        if (month > 11) { month = 0; year++; }
        render();
      });
    }

    render();
  }

  /* ── Stat Card Sparklines ───────────────── */
  function initSparklines() {
    document.querySelectorAll('[data-sparkline]').forEach(el => {
      const values = el.dataset.sparkline.split(',').map(Number);
      const max = Math.max(...values);
      const min = Math.min(...values);
      const w = 80;
      const h = 32;
      const pts = values.map((v, i) => {
        const x = (i / (values.length - 1)) * w;
        const y = h - ((v - min) / (max - min || 1)) * h;
        return `${x},${y}`;
      }).join(' ');

      el.innerHTML = `
        <svg viewBox="0 0 ${w} ${h}" style="width:${w}px;height:${h}px">
          <polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    });
  }

  /* ── Init ───────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initActiveSidebarLink();
    initTableSort();
    initTableSearch();
    initCalendar();
    initSparklines();

    // Render charts if containers exist
    renderBarChart('weekly-bookings-chart', {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [4, 7, 5, 9, 6, 12, 3]
    });

    renderDonutChart('service-breakdown-chart', {
      labels: ['Personal Shopping', 'Wardrobe Audit', 'Color Analysis', 'Styling', 'Other'],
      values: [35, 25, 20, 15, 5]
    });
  });

})();
