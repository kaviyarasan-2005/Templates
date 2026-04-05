/* ============================================
   DASHBOARD.JS — Admin & User Panel
   ============================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.dashboard')) return;
    initSidebar();
    initRoleSwitcher();
    initDashboardCharts();
    initOrderFilters();
    initProfileForm();
    initMessagePanel();
  });

  /* ================================================
     SIDEBAR NAVIGATION
     ================================================ */
  function initSidebar() {
    const links = document.querySelectorAll('.sidebar__link');
    const panels = document.querySelectorAll('.dashboard__panel');

    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.dataset.panel;

        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        panels.forEach(p => {
          p.classList.remove('active');
          if (p.id === target) p.classList.add('active');
        });
      });
    });

    // Mobile sidebar toggle
    const sidebarToggle = document.querySelector('.dashboard__sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  }

  /* ================================================
     ROLE SWITCHER (Admin ↔ User)
     ================================================ */
  function initRoleSwitcher() {
    const switcher = document.getElementById('role-switcher');

    // Check query param first
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    
    const saved = roleParam || localStorage.getItem('dashboardRole') || 'admin';
    applyRole(saved);
    if (switcher) switcher.value = saved;
    
    // Save it if it came from param
    if (roleParam) localStorage.setItem('dashboardRole', roleParam);

    if (switcher) {
      switcher.addEventListener('change', () => {
        const role = switcher.value;
        applyRole(role);
        localStorage.setItem('dashboardRole', role);
        // Clean up URL if we manually switch
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      });
    }
  }

  function applyRole(role) {
    document.querySelectorAll('[data-role]').forEach(el => {
      const roles = el.dataset.role.split(',').map(r => r.trim());
      el.style.display = roles.includes(role) || roles.includes('both') ? '' : 'none';
    });

    // Update sidebar visibility
    document.querySelectorAll('.sidebar__link[data-role]').forEach(link => {
      const roles = link.dataset.role.split(',').map(r => r.trim());
      link.style.display = roles.includes(role) || roles.includes('both') ? '' : 'none';
    });

    // Show first visible panel
    const firstLink = document.querySelector(`.sidebar__link[data-role*="${role}"]:not([style*="none"]), .sidebar__link[data-role="both"]`);
    if (firstLink) firstLink.click();
  }

  /* ================================================
     DASHBOARD CHARTS (Simple Canvas)
     ================================================ */
  function initDashboardCharts() {
    drawRevenueChart();
    drawOrdersChart();
  }

  function drawRevenueChart() {
    const canvas = document.getElementById('revenue-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.offsetWidth;
    const h = canvas.height = 220;

    const data = [1200, 1900, 1500, 2800, 2200, 3100, 2700, 3400, 2900, 3800, 3200, 4100];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const max = Math.max(...data) * 1.15;
    const barW = (w - 80) / data.length;
    const offsetX = 50;
    const offsetY = 20;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#E0D5C180';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = offsetY + ((h - 50) / 4) * i;
      ctx.beginPath();
      ctx.moveTo(offsetX, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();
    }

    // Bars
    data.forEach((val, i) => {
      const barH = ((h - 50) * val) / max;
      const x = offsetX + i * barW + barW * 0.15;
      const y = h - 30 - barH;
      const bw = barW * 0.7;

      // Gradient bar
      const grad = ctx.createLinearGradient(x, y, x, h - 30);
      grad.addColorStop(0, '#6F4E37');
      grad.addColorStop(1, '#D4A574');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, bw, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Label
      ctx.fillStyle = '#7A7A7A';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + bw / 2, h - 12);
    });

    // Y-axis labels
    ctx.fillStyle = '#7A7A7A';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = Math.round((max / 4) * (4 - i));
      const y = offsetY + ((h - 50) / 4) * i + 4;
      ctx.fillText('$' + val.toLocaleString(), offsetX - 6, y);
    }
  }

  function drawOrdersChart() {
    const canvas = document.getElementById('orders-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.offsetWidth;
    const h = canvas.height = 220;

    const data = [45, 62, 58, 78, 71, 90, 85, 95, 88, 102, 96, 110];
    const max = Math.max(...data) * 1.15;
    const step = (w - 80) / (data.length - 1);
    const offsetX = 50;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#E0D5C180';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = 20 + ((h - 50) / 4) * i;
      ctx.beginPath();
      ctx.moveTo(offsetX, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();
    }

    // Line + fill
    ctx.beginPath();
    const points = data.map((val, i) => ({
      x: offsetX + i * step,
      y: h - 30 - ((h - 50) * val) / max
    }));

    // Fill area
    ctx.beginPath();
    ctx.moveTo(points[0].x, h - 30);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, h - 30);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, 0, 0, h);
    fillGrad.addColorStop(0, 'rgba(111,78,55,.2)');
    fillGrad.addColorStop(1, 'rgba(111,78,55,.02)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Line
    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#6F4E37';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Dots
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#6F4E37';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#FDFBF7';
      ctx.fill();
    });
  }

  /* ================================================
     ORDER STATUS FILTERS
     ================================================ */
  function initOrderFilters() {
    const btns = document.querySelectorAll('.order-filter__btn');
    const rows = document.querySelectorAll('.order-row');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        rows.forEach(row => {
          if (filter === 'all' || row.dataset.status === filter) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }

  /* ================================================
     PROFILE FORM
     ================================================ */
  function initProfileForm() {
    const form = document.getElementById('profile-form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Profile updated successfully! ✓', 'success');
    });

    // Avatar upload preview
    const avatarInput = document.getElementById('avatar-upload');
    const avatarPreview = document.querySelector('.profile__avatar img');
    if (avatarInput && avatarPreview) {
      avatarInput.addEventListener('change', () => {
        const file = avatarInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = e => { avatarPreview.src = e.target.result; };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  /* ================================================
     MESSAGES PANEL
     ================================================ */
  function initMessagePanel() {
    const msgItems = document.querySelectorAll('.message-item');
    const msgContent = document.querySelector('.message-content');
    if (!msgItems.length || !msgContent) return;

    msgItems.forEach(item => {
      item.addEventListener('click', () => {
        msgItems.forEach(m => m.classList.remove('active'));
        item.classList.add('active');
        item.classList.remove('unread');

        msgContent.innerHTML = `
          <div class="message-content__header">
            <h4>${item.dataset.from}</h4>
            <span class="text-muted">${item.dataset.date}</span>
          </div>
          <div class="message-content__body">
            <p>${item.dataset.message}</p>
          </div>
          <div class="message-content__reply" style="margin-top:24px">
            <textarea class="form-input" placeholder="Type your reply..." rows="3"></textarea>
            <button class="btn btn--primary" style="margin-top:12px" onclick="showToast('Reply sent! ✉️','success')">Send Reply</button>
          </div>
        `;
      });
    });
  }

})();
