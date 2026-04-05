/* ============================================
   INK STUDIO - Dashboard JavaScript
   ============================================ */

'use strict';

const Dashboard = (() => {
  function init() {
    initSidebar();
    initRoleToggle();
    initCharts();
    initDataTables();
    initMessageInteractions();
  }

  // ---- Sidebar ----
  function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle-btn');
    const mobileToggle = document.querySelector('.dashboard-mobile-toggle');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-collapsed');
        // Adjust main content
        const main = document.querySelector('.dashboard-main');
        if (main) {
          main.style.marginLeft = sidebar.classList.contains('sidebar-collapsed') ? '80px' : '280px';
        }
      });
    }

    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('mobile-open')) {
          if (!e.target.closest('.sidebar') && !e.target.closest('.dashboard-mobile-toggle')) {
            sidebar.classList.remove('mobile-open');
          }
        }
      });
    }

    // Active link highlight
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const linkPath = link.getAttribute('href')?.split('/').pop();
      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });
  }

  // ---- Role Toggle ----
  function initRoleToggle() {
    const toggleBtns = document.querySelectorAll('.role-toggle-btn');
    const adminContent = document.querySelectorAll('.admin-content');
    const userContent = document.querySelectorAll('.user-content');

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');

        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (role === 'admin') {
          adminContent.forEach(el => el.style.display = '');
          userContent.forEach(el => el.style.display = 'none');
        } else {
          adminContent.forEach(el => el.style.display = 'none');
          userContent.forEach(el => el.style.display = '');
        }
      });
    });
  }

  // ---- Simple Chart Drawing (Canvas) ----
  function initCharts() {
    // Line chart
    const lineCanvas = document.getElementById('lineChart');
    if (lineCanvas) drawLineChart(lineCanvas);

    // Bar chart
    const barCanvas = document.getElementById('barChart');
    if (barCanvas) drawBarChart(barCanvas);

    // Pie chart
    const pieCanvas = document.getElementById('pieChart');
    if (pieCanvas) drawPieChart(pieCanvas);
  }

  function drawLineChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth - 40;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const data = [20, 45, 35, 60, 80, 55, 90, 70, 95, 85, 110, 100];
    const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const maxVal = Math.max(...data) * 1.1;
    const padding = 40;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;

    // Grid lines
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';

    data.forEach((val, i) => {
      const x = padding + (chartW / (data.length - 1)) * i;
      const y = padding + chartH - (val / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(220, 38, 38, 0.15)');
    gradient.addColorStop(1, 'rgba(220, 38, 38, 0)');

    ctx.lineTo(padding + chartW, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Points
    data.forEach((val, i) => {
      const x = padding + (chartW / (data.length - 1)) * i;
      const y = padding + chartH - (val / maxVal) * chartH;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Labels
    ctx.fillStyle = '#737373';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    data.forEach((_, i) => {
      const x = padding + (chartW / (data.length - 1)) * i;
      ctx.fillText(labels[i], x, height - 8);
    });
  }

  function drawBarChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth - 40;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const data = [
      { label: 'Custom', value: 85, color: '#dc2626' },
      { label: 'Trad.', value: 60, color: '#f59e0b' },
      { label: 'Neo', value: 45, color: '#3b82f6' },
      { label: 'Japan.', value: 70, color: '#10b981' },
      { label: 'Piercing', value: 55, color: '#ec4899' },
      { label: 'Minimal', value: 40, color: '#8b5cf6' }
    ];

    const maxVal = Math.max(...data.map(d => d.value)) * 1.15;
    const padding = 40;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    const barWidth = chartW / data.length * 0.6;
    const gap = chartW / data.length * 0.4;

    // Grid
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Bars
    data.forEach((item, i) => {
      const x = padding + (chartW / data.length) * i + gap / 2;
      const barH = (item.value / maxVal) * chartH;
      const y = padding + chartH - barH;

      // Bar with rounded top
      ctx.beginPath();
      ctx.fillStyle = item.color;
      const radius = 4;
      ctx.moveTo(x, y + radius);
      ctx.arcTo(x, y, x + barWidth, y, radius);
      ctx.arcTo(x + barWidth, y, x + barWidth, y + barH, radius);
      ctx.lineTo(x + barWidth, padding + chartH);
      ctx.lineTo(x, padding + chartH);
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.fillStyle = '#737373';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barWidth / 2, height - 8);

      // Value
      ctx.fillStyle = '#525252';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText(item.value, x + barWidth / 2, y - 6);
    });
  }

  function drawPieChart(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 220;
    canvas.height = 220;

    const data = [
      { label: '18-25', value: 30, color: '#dc2626' },
      { label: '26-35', value: 40, color: '#f59e0b' },
      { label: '36-45', value: 18, color: '#3b82f6' },
      { label: '46+', value: 12, color: '#10b981' }
    ];

    const total = data.reduce((sum, d) => sum + d.value, 0);
    const cx = 110, cy = 100, radius = 80;
    let startAngle = -Math.PI / 2;

    data.forEach(item => {
      const sliceAngle = (item.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      // Label
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = cx + Math.cos(midAngle) * (radius * 0.65);
      const labelY = cy + Math.sin(midAngle) * (radius * 0.65);
      ctx.fillStyle = '#fff';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, labelX, labelY);

      startAngle += sliceAngle;
    });

    // Center circle (donut)
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Legend
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    data.forEach((item, i) => {
      const ly = 195 + i * 0; // Not enough room, use below-chart legend
    });
  }

  // ---- Data Tables ----
  function initDataTables() {
    // Search
    const searchInputs = document.querySelectorAll('.table-search');
    searchInputs.forEach(input => {
      input.addEventListener('input', debounce(() => {
        const query = input.value.toLowerCase();
        const tableId = input.getAttribute('data-table');
        const table = document.getElementById(tableId);
        if (!table) return;

        table.querySelectorAll('tbody tr').forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      }, 250));
    });

    // Sort
    document.querySelectorAll('.sortable').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const table = th.closest('table');
        const index = Array.from(th.parentElement.children).indexOf(th);
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAsc = th.classList.contains('sort-asc');

        rows.sort((a, b) => {
          const aVal = a.children[index]?.textContent.trim() || '';
          const bVal = b.children[index]?.textContent.trim() || '';
          return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        });

        // Reset all sort indicators
        th.parentElement.querySelectorAll('th').forEach(h => {
          h.classList.remove('sort-asc', 'sort-desc');
        });
        th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');

        rows.forEach(row => tbody.appendChild(row));
      });
    });
  }

  // ---- Messages ----
  function initMessageInteractions() {
    document.querySelectorAll('.message-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.remove('unread');
        document.querySelectorAll('.message-item').forEach(m => m.classList.remove('selected'));
        item.classList.add('selected');
      });
    });
  }

  // ---- Utility ----
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Dashboard.init);
