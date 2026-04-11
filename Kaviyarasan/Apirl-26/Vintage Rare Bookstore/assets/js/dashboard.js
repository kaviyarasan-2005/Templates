/* ============================================
   dashboard.js
   Chart.js initialization for 4 chart types:
   Line, Doughnut, Bar, Area
   Countdown timer, sidebar interactions
   ============================================ */

(function() {
  'use strict';

  // Wait for Chart.js CDN to load
  function waitForChart(cb) {
    if (window.Chart) { cb(); return; }
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.Chart) { clearInterval(interval); cb(); }
      if (attempts > 40) clearInterval(interval);
    }, 150);
  }

  // ---- Shared chart colors ----
  function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      primary:   '#722F37',
      accent:    '#D4AF37',
      secondary: '#4A0404',
      green:     '#2F4538',
      grid:      isDark ? 'rgba(245,245,220,0.08)' : 'rgba(114,47,55,0.09)',
      text:      isDark ? '#C8B89A'                : '#5C4030',
      bg:        isDark ? '#261508'                : '#FFFDD0',
    };
  }

  // Default chart font
  function applyDefaultFont() {
    if (!window.Chart) return;
    Chart.defaults.font.family = "'Inter', 'Helvetica Neue', sans-serif";
    Chart.defaults.font.size   = 12;
    Chart.defaults.plugins.legend.labels.padding = 20;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 4;
    Chart.defaults.plugins.tooltip.caretSize = 6;
  }

  // ============================================
  // 1. LINE CHART — Monthly Revenue Trend
  // ============================================
  function initLineChart() {
    const canvas = document.getElementById('line-chart');
    if (!canvas) return;

    const c = getChartColors();
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(114,47,55,0.25)');
    gradient.addColorStop(1, 'rgba(114,47,55,0)');

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          label: 'Revenue (£)',
          data: [18400, 22100, 19800, 26500, 31200, 28900, 34800, 41200, 37600, 43900, 48200, 52700],
          borderColor: c.primary,
          backgroundColor: gradient,
          borderWidth: 2.5,
          pointBackgroundColor: c.primary,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` £${ctx.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: c.grid },
            ticks: { color: c.text }
          },
          y: {
            grid: { color: c.grid },
            ticks: {
              color: c.text,
              callback: v => '£' + (v/1000).toFixed(0) + 'k'
            },
            beginAtZero: false,
          }
        }
      }
    });
  }

  // ============================================
  // 2. DOUGHNUT CHART — Book Category Distribution
  // ============================================
  function initDoughnutChart() {
    const canvas = document.getElementById('doughnut-chart');
    if (!canvas) return;
    const c = getChartColors();

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Rare Manuscripts','First Editions','Antique Bindings','Scientific Treatises','Poetry & Literature'],
        datasets: [{
          data: [28, 35, 18, 12, 7],
          backgroundColor: [c.primary, c.accent, c.secondary, c.green, '#8B6914'],
          borderColor: c.bg,
          borderWidth: 3,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: c.text,
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 12,
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`
            }
          }
        }
      }
    });
  }

  // ============================================
  // 3. BAR CHART — Inventory Levels by Genre (Compact)
  // ============================================
  function initBarChart() {
    const canvas = document.getElementById('bar-chart');
    if (!canvas) return;
    const c = getChartColors();

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Fiction','History','Science','Philosophy','Religion','Maps','Children\'s'],
        datasets: [{
          label: 'Units in Stock',
          data: [142, 98, 67, 85, 53, 31, 44],
          backgroundColor: [
            'rgba(114,47,55,0.82)',
            'rgba(212,175,55,0.82)',
            'rgba(74,4,4,0.82)',
            'rgba(47,69,56,0.82)',
            'rgba(139,105,20,0.82)',
            'rgba(114,47,55,0.55)',
            'rgba(212,175,55,0.55)',
          ],
          borderRadius: 3,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: c.text, font: { size: 11 } }
          },
          y: {
            grid: { color: c.grid },
            ticks: { color: c.text },
            beginAtZero: true,
          }
        }
      }
    });
  }

  // ============================================
  // 4. AREA CHART — Customer Acquisition / Traffic
  // ============================================
  function initAreaChart() {
    const canvas = document.getElementById('area-chart');
    if (!canvas) return;
    const c = getChartColors();
    const ctx = canvas.getContext('2d');

    const g1 = ctx.createLinearGradient(0, 0, 0, 260);
    g1.addColorStop(0, 'rgba(212,175,55,0.30)');
    g1.addColorStop(1, 'rgba(212,175,55,0)');

    const g2 = ctx.createLinearGradient(0, 0, 0, 260);
    g2.addColorStop(0, 'rgba(114,47,55,0.20)');
    g2.addColorStop(1, 'rgba(114,47,55,0)');

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [
          {
            label: 'New Collectors',
            data: [34,48,42,61,55,72,68,89,94,103,118,134],
            borderColor: c.accent,
            backgroundColor: g1,
            borderWidth: 2,
            pointBackgroundColor: c.accent,
            pointBorderColor: '#fff',
            pointBorderWidth: 1.5,
            pointRadius: 3,
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Site Visitors (×100)',
            data: [120,155,138,190,172,214,208,261,278,295,332,368],
            borderColor: c.primary,
            backgroundColor: g2,
            borderWidth: 2,
            pointBackgroundColor: c.primary,
            pointBorderColor: '#fff',
            pointBorderWidth: 1.5,
            pointRadius: 3,
            tension: 0.4,
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: { color: c.text, padding: 16, usePointStyle: true }
          }
        },
        scales: {
          x: {
            grid: { color: c.grid },
            ticks: { color: c.text }
          },
          y: {
            grid: { color: c.grid },
            ticks: { color: c.text },
            beginAtZero: true,
          }
        }
      }
    });
  }

  // ============================================
  // COUNTDOWN TIMER (Coming Soon page)
  // ============================================
  function initCountdown() {
    const el = document.getElementById('countdown-target');
    if (!el) return;

    const targetDate = new Date(el.getAttribute('data-date') || '2026-09-01T00:00:00');

    const parts = {
      days:    document.getElementById('cd-days'),
      hours:   document.getElementById('cd-hours'),
      minutes: document.getElementById('cd-mins'),
      seconds: document.getElementById('cd-secs'),
    };

    function pad(n) { return String(n).padStart(2, '0'); }

    function update() {
      const now  = new Date();
      const diff = Math.max(0, targetDate - now);
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000)  / 60000);
      const s = Math.floor((diff % 60000)    / 1000);
      if (parts.days)    parts.days.textContent    = pad(d);
      if (parts.hours)   parts.hours.textContent   = pad(h);
      if (parts.minutes) parts.minutes.textContent = pad(m);
      if (parts.seconds) parts.seconds.textContent = pad(s);
    }

    update();
    setInterval(update, 1000);
  }

  // ============================================
  // THEME CHANGE — Refresh chart colors
  // ============================================
  function watchThemeForCharts(chartInstances) {
    const observer = new MutationObserver(() => {
      // Simple reload approach — re-initialize charts
      chartInstances.forEach(fn => {
        // Destroy existing chart if any and recreate
        const canvas = fn.canvas;
        if (canvas && Chart.getChart(canvas)) {
          Chart.getChart(canvas).destroy();
        }
        fn.init();
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  // ============================================
  // INIT
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    initCountdown();

    waitForChart(() => {
      applyDefaultFont();
      initLineChart();
      initDoughnutChart();
      initBarChart();
      initAreaChart();
    });
  });

})();
