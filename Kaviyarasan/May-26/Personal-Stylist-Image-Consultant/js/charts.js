/**
 * charts.js
 * All dashboard charts built using HTML5 Canvas API.
 * No external libraries. Pure Canvas drawing.
 */

(function() {
  'use strict';

  // ── THEME UTILS ───────────────────────────────────────────
  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
  const PINK   = '#E8CFC5';
  const PINK_D = '#B08880';
  const CHARCOAL = '#2F2F2F';
  const BEIGE  = '#F4EDE4';
  const getTextColor  = () => isDark() ? '#D0C9C1' : CHARCOAL;
  const getMutedColor = () => isDark() ? '#6B6460' : '#9E9890';
  const getGridColor  = () => isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(47,47,47,0.07)';

  function getCanvasDPR(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = Math.round(rect.width  * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, w: rect.width, h: rect.height };
  }

  // ── 1. LINE CHART (Visitor Traffic) ──────────────────────
  function drawLineChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const {ctx, w, h} = getCanvasDPR(canvas);
    const p = {t: 30, r: 20, b: 50, l: 55};
    const cw = w - p.l - p.r;
    const ch = h - p.t - p.b;

    const max = Math.max(...data.values) * 1.15;
    const xStep = cw / (data.labels.length - 1);

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const y = p.t + (ch / gridCount) * i;
      ctx.beginPath();
      ctx.strokeStyle = getGridColor();
      ctx.lineWidth = 1;
      ctx.moveTo(p.l, y); ctx.lineTo(p.l + cw, y);
      ctx.stroke();
      // Y labels
      const val = Math.round(max - (max / gridCount) * i);
      ctx.fillStyle = getMutedColor();
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val >= 1000 ? (val/1000).toFixed(1) + 'k' : val, p.l - 8, y + 4);
    }

    // X labels
    data.labels.forEach((label, i) => {
      const x = p.l + xStep * i;
      ctx.fillStyle = getMutedColor();
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, h - p.b + 16);
    });

    // Points array
    const points = data.values.map((v, i) => ({
      x: p.l + xStep * i,
      y: p.t + ch - (v / max) * ch
    }));

    // Gradient fill
    const grad = ctx.createLinearGradient(0, p.t, 0, p.t + ch);
    grad.addColorStop(0, 'rgba(232,207,197,0.4)');
    grad.addColorStop(1, 'rgba(232,207,197,0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const mx = (points[i-1].x + points[i].x) / 2;
      ctx.bezierCurveTo(mx, points[i-1].y, mx, points[i].y, points[i].x, points[i].y);
    }
    ctx.lineTo(points[points.length-1].x, p.t + ch);
    ctx.lineTo(points[0].x, p.t + ch);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const mx = (points[i-1].x + points[i].x) / 2;
      ctx.bezierCurveTo(mx, points[i-1].y, mx, points[i].y, points[i].x, points[i].y);
    }
    ctx.strokeStyle = PINK_D;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Data points
    points.forEach((p_, i) => {
      ctx.beginPath();
      ctx.arc(p_.x, p_.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = isDark() ? CHARCOAL : BEIGE;
      ctx.fill();
      ctx.strokeStyle = PINK_D;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  // ── 2. BAR CHART (Monthly Revenue) ───────────────────────
  function drawBarChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const {ctx, w, h} = getCanvasDPR(canvas);
    const p = {t: 30, r: 20, b: 60, l: 65};
    const cw = w - p.l - p.r;
    const ch = h - p.t - p.b;

    const max = Math.max(...data.values) * 1.2;
    const barW = (cw / data.labels.length) * 0.55;
    const barGap = cw / data.labels.length;

    ctx.clearRect(0, 0, w, h);

    // Grid
    for (let i = 0; i <= 5; i++) {
      const y = p.t + (ch / 5) * i;
      ctx.beginPath();
      ctx.strokeStyle = getGridColor();
      ctx.lineWidth = 1;
      ctx.moveTo(p.l, y); ctx.lineTo(p.l + cw, y);
      ctx.stroke();
      const val = Math.round(max - (max / 5) * i);
      ctx.fillStyle = getMutedColor();
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('$' + (val >= 1000 ? (val/1000).toFixed(0) + 'k' : val), p.l - 8, y + 4);
    }

    data.values.forEach((v, i) => {
      const x = p.l + barGap * i + (barGap - barW) / 2;
      const bh = (v / max) * ch;
      const y = p.t + ch - bh;

      // Gradient fill
      const grad = ctx.createLinearGradient(0, y, 0, y + bh);
      grad.addColorStop(0, PINK_D);
      grad.addColorStop(1, 'rgba(176,136,128,0.4)');

      ctx.beginPath();
      const r = Math.min(barW / 2, 6);
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, y + bh);
      ctx.lineTo(x, y + bh);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // X label
      ctx.fillStyle = getMutedColor();
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.labels[i], x + barW / 2, h - p.b + 16);

      // Value on top
      if (bh > 20) {
        ctx.fillStyle = getTextColor();
        ctx.font = '10px system-ui, sans-serif';
        ctx.fillText('$' + (v >= 1000 ? (v/1000).toFixed(0) + 'k' : v), x + barW / 2, y - 6);
      }
    });
  }

  // ── 3. DONUT CHART (Exhibition Types) ─────────────────────
  function drawDonutChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const {ctx, w, h} = getCanvasDPR(canvas);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.48;
    const outer = Math.min(w, h) * 0.42;
    const inner = outer * 0.62;
    const total = data.values.reduce((s, v) => s + v, 0);

    const colors = [PINK_D, '#C8A090', '#D4B8A8', '#A87868', '#E0CCC4', '#906050'];
    let startAngle = -Math.PI / 2;

    data.values.forEach((v, i) => {
      const slice = (v / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outer, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      // Gap
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outer, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.strokeStyle = isDark() ? '#1A1A1A' : BEIGE;
      ctx.lineWidth = 3;
      ctx.stroke();

      startAngle += slice;
    });

    // Inner white/dark circle for donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = isDark() ? '#1A1A1A' : BEIGE;
    ctx.fill();

    // Center text
    ctx.fillStyle = getTextColor();
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(total, cx, cy + 5);
    ctx.fillStyle = getMutedColor();
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('Total', cx, cy + 20);

    // Legend
    const legendY = h * 0.88;
    const legendStartX = w / 2 - (data.labels.length * 70) / 2;
    data.labels.slice(0, 5).forEach((label, i) => {
      const lx = 20 + (i % Math.ceil(data.labels.length / 2)) * (w / Math.ceil(data.labels.length/2));
      const ly = legendY + Math.floor(i / Math.ceil(data.labels.length / 2)) * 20 - (data.labels.length > 4 ? 20 : 10);
      ctx.beginPath();
      ctx.roundRect(lx, ly - 8, 10, 10, 3);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.fillStyle = getMutedColor();
      ctx.font = '10px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label + ' ' + Math.round(data.values[i]/total*100) + '%', lx + 14, ly + 1);
    });
  }

  // ── 4. AREA CHART (User Activity) ──────────────────────────
  function drawAreaChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const {ctx, w, h} = getCanvasDPR(canvas);
    const p = {t: 30, r: 20, b: 55, l: 55};
    const cw = w - p.l - p.r;
    const ch = h - p.t - p.b;

    ctx.clearRect(0, 0, w, h);

    // Multiple datasets
    data.datasets.forEach((ds, di) => {
      const max = Math.max(...data.datasets.flatMap(d => d.values)) * 1.1;
      const xStep = cw / (data.labels.length - 1);
      const colors = [PINK_D, '#7C9E8A', '#8FB8C8'];

      const points = ds.values.map((v, i) => ({
        x: p.l + xStep * i,
        y: p.t + ch - (v / max) * ch
      }));

      if (di === 0) {
        // Draw grid once
        for (let i = 0; i <= 4; i++) {
          const y = p.t + (ch / 4) * i;
          ctx.beginPath();
          ctx.strokeStyle = getGridColor();
          ctx.lineWidth = 1;
          ctx.moveTo(p.l, y); ctx.lineTo(p.l + cw, y);
          ctx.stroke();
          const val = Math.round(max - (max/4)*i);
          ctx.fillStyle = getMutedColor();
          ctx.font = '11px system-ui,sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(val >= 1000 ? (val/1000).toFixed(1)+'k' : val, p.l-8, y+4);
        }
        data.labels.forEach((label, i) => {
          const x = p.l + xStep * i;
          ctx.fillStyle = getMutedColor();
          ctx.font = '11px system-ui,sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(label, x, h - p.b + 16);
        });
      }

      const grad = ctx.createLinearGradient(0, p.t, 0, p.t + ch);
      grad.addColorStop(0, colors[di] + '44');
      grad.addColorStop(1, colors[di] + '00');

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const mx = (points[i-1].x + points[i].x) / 2;
        ctx.bezierCurveTo(mx, points[i-1].y, mx, points[i].y, points[i].x, points[i].y);
      }
      ctx.lineTo(points[points.length-1].x, p.t + ch);
      ctx.lineTo(points[0].x, p.t + ch);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const mx = (points[i-1].x + points[i].x) / 2;
        ctx.bezierCurveTo(mx, points[i-1].y, mx, points[i].y, points[i].x, points[i].y);
      }
      ctx.strokeStyle = colors[di];
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Legend
    const lx = p.l;
    const ly = h - 10;
    const colors2 = [PINK_D, '#7C9E8A', '#8FB8C8'];
    data.datasets.forEach((ds, i) => {
      const x = lx + i * (cw / data.datasets.length);
      ctx.fillStyle = colors2[i];
      ctx.fillRect(x, ly - 8, 20, 8);
      ctx.fillStyle = getMutedColor();
      ctx.font = '10px system-ui,sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(ds.label, x + 25, ly);
    });
  }

  // ── 5. HORIZONTAL BAR CHART (Top Artworks) ────────────────
  function drawHBarChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const {ctx, w, h} = getCanvasDPR(canvas);
    ctx.clearRect(0, 0, w, h);

    const p = {t: 10, r: 60, b: 10, l: 130};
    const cw = w - p.l - p.r;
    const ch = h - p.t - p.b;
    const barH = ch / data.labels.length * 0.6;
    const barGap = ch / data.labels.length;
    const max = Math.max(...data.values);

    data.labels.forEach((label, i) => {
      const y = p.t + barGap * i + (barGap - barH) / 2;
      const bw = (data.values[i] / max) * cw;

      // Background track
      ctx.beginPath();
      ctx.roundRect(p.l, y, cw, barH, barH/2);
      ctx.fillStyle = getGridColor();
      ctx.fill();

      // Bar
      const grad = ctx.createLinearGradient(p.l, 0, p.l + bw, 0);
      grad.addColorStop(0, PINK_D);
      grad.addColorStop(1, 'rgba(176,136,128,0.5)');
      ctx.beginPath();
      ctx.roundRect(p.l, y, bw, barH, barH/2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Label
      ctx.fillStyle = getTextColor();
      ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(label, p.l - 10, y + barH / 2 + 4);

      // Value
      ctx.fillStyle = getMutedColor();
      ctx.textAlign = 'left';
      ctx.fillText(data.values[i], p.l + bw + 8, y + barH / 2 + 4);
    });
  }

  // ── INIT — wait for DOM ────────────────────────────────────
  function initCharts() {
    // Admin Dashboard Charts
    drawLineChart('visitors-chart', {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      values: [4200, 5100, 4800, 6200, 7800, 8100, 7400, 9200, 8800, 10400, 11200, 12800]
    });

    drawBarChart('revenue-chart', {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      values: [28000, 35000, 31000, 48000, 62000, 71000, 58000, 74000, 69000, 82000, 91000, 108000]
    });

    drawDonutChart('exhibition-types-chart', {
      labels: ['Solo','Group','Digital','Touring','Site-Specific'],
      values: [38, 25, 20, 10, 7]
    });

    drawHBarChart('top-artworks-chart', {
      labels: ['Echoes of Autumn','Stillness','The Ascendant','First Light','Golden Cross'],
      values: [847, 723, 612, 589, 504]
    });

    // User Dashboard
    drawAreaChart('user-activity-chart', {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      datasets: [
        { label: 'Views', values: [120, 180, 150, 240, 190, 310] },
        { label: 'Saves', values: [40, 65, 50, 80, 70, 120] },
        { label: 'Events', values: [5, 8, 6, 12, 9, 15] }
      ]
    });

    drawBarChart('booking-history-chart', {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      values: [2, 1, 3, 4, 2, 5]
    });

    drawDonutChart('user-genre-chart', {
      labels: ['Contemporary','Renaissance','Digital Art','Impressionism','Abstract'],
      values: [45, 20, 15, 10, 10]
    });

    drawHBarChart('user-artist-chart', {
      labels: ['Marcus Chen','Sofía Delacroix','Lara Vasquez','Amara Osei','Elena Rossi'],
      values: [124, 98, 85, 72, 45]
    });
  }

  // Observe section visibility so charts render on scroll
  function observeCharts() {
    const chartSections = document.querySelectorAll('.chart-container');
    if (!chartSections.length) {
      initCharts();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { initCharts(); observer.disconnect(); }
      });
    }, { threshold: 0.1 });
    chartSections.forEach(s => observer.observe(s));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observeCharts();
      // Re-render on theme change
      const themeObserver = new MutationObserver(observeCharts);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    });
  } else {
    observeCharts();
    const themeObserver = new MutationObserver(observeCharts);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

})();
