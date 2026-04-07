/* ========================================
   DANCE STUDIO — Dashboard Controller
   Charts, role toggle, table sorting, chat
   ======================================== */

const Dashboard = (() => {
  let currentRole = 'admin';

  function init() {
    initSidebar();
    initRoleToggle();
    initSortableTable();
    initProgressRings();
    initLineChart();
    initChat();
    initMobileNav();
  }

  /* === Sidebar Collapse === */
  function initSidebar() {
    const sidebar = document.querySelector('.dashboard__sidebar');
    const toggle = document.querySelector('.sidebar-toggle');
    if (!sidebar || !toggle) return;

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });

    // Mobile sidebar toggle
    const mobileMenuBtn = document.querySelector('.dashboard__mobile-menu-btn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Close sidebar on overlay click (mobile)
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && sidebar.classList.contains('mobile-open')) {
        if (!sidebar.contains(e.target) && !e.target.closest('.dashboard__mobile-menu-btn')) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });
  }

  /* === Role Toggle (Admin <-> User) === */
  function initRoleToggle() {
    const toggleBtn = document.querySelector('.role-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('admin');
      currentRole = toggleBtn.classList.contains('admin') ? 'admin' : 'user';
      
      // Show/hide admin and user sections
      document.querySelectorAll('[data-role]').forEach(el => {
        const roles = el.dataset.role.split(',').map(r => r.trim());
        el.style.display = roles.includes(currentRole) ? '' : 'none';
      });

      // Update role label
      const label = toggleBtn.querySelector('.role-toggle__label');
      if (label) {
        label.textContent = currentRole === 'admin' ? 'Admin View' : 'User View';
      }

      // Update nav items based on role
      document.querySelectorAll('.dashboard__nav-item[data-role]').forEach(item => {
        const roles = item.dataset.role.split(',').map(r => r.trim());
        item.style.display = roles.includes(currentRole) ? '' : 'none';
      });
    });
  }

  /* === Sortable Table === */
  function initSortableTable() {
    document.querySelectorAll('.data-table').forEach(table => {
      const headers = table.querySelectorAll('th[data-sort]');
      headers.forEach(th => {
        th.addEventListener('click', () => {
          const column = th.dataset.sort;
          const isAsc = th.classList.contains('sorted-asc');
          
          // Reset all headers
          headers.forEach(h => {
            h.classList.remove('sorted', 'sorted-asc', 'sorted-desc');
          });
          
          th.classList.add('sorted', isAsc ? 'sorted-desc' : 'sorted-asc');
          
          const tbody = table.querySelector('tbody');
          const rows = Array.from(tbody.querySelectorAll('tr'));
          const colIndex = Array.from(th.parentElement.children).indexOf(th);
          
          rows.sort((a, b) => {
            let aVal = a.children[colIndex]?.textContent.trim() || '';
            let bVal = b.children[colIndex]?.textContent.trim() || '';
            
            // Try numeric sort
            const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
            const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ''));
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
              return isAsc ? bNum - aNum : aNum - bNum;
            }
            
            return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
          });
          
          rows.forEach(row => tbody.appendChild(row));
        });
      });
    });
  }

  /* === SVG Circular Progress Rings === */
  function initProgressRings() {
    document.querySelectorAll('.progress-ring').forEach(ring => {
      const circle = ring.querySelector('.progress-ring__circle');
      const text = ring.querySelector('.progress-ring__text');
      if (!circle) return;

      const radius = circle.getAttribute('r');
      const circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = circumference;

      const percent = parseInt(ring.dataset.percent, 10) || 0;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
            if (text) {
              animateValue(text, 0, percent, 1000, '%');
            }
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(ring);
    });
  }

  function animateValue(el, start, end, duration, suffix = '') {
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * (end - start) + start) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* === SVG Line Chart === */
  function initLineChart() {
    const chartContainer = document.querySelector('.line-chart');
    if (!chartContainer) return;

    const data = JSON.parse(chartContainer.dataset.values || '[]');
    const labels = JSON.parse(chartContainer.dataset.labels || '[]');
    if (!data.length) return;

    const width = chartContainer.offsetWidth;
    const height = 250;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...data) * 1.1;
    const minVal = 0;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      const line = createSVGElement('line', {
        x1: padding.left, y1: y,
        x2: width - padding.right, y2: y,
        stroke: 'var(--border-color)', 'stroke-width': 1, 'stroke-dasharray': '4,4'
      });
      svg.appendChild(line);

      const val = Math.round(maxVal - (maxVal / 4) * i);
      const text = createSVGElement('text', {
        x: padding.left - 10, y: y + 4,
        'text-anchor': 'end', fill: 'var(--text-tertiary)',
        'font-size': '11', 'font-family': 'var(--font-body)'
      });
      text.textContent = val;
      svg.appendChild(text);
    }

    // Points and path
    const points = data.map((val, i) => ({
      x: padding.left + (i / (data.length - 1)) * chartW,
      y: padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH
    }));

    // Area fill
    const areaPath = `M${points[0].x},${padding.top + chartH} ` +
      points.map(p => `L${p.x},${p.y}`).join(' ') +
      ` L${points[points.length - 1].x},${padding.top + chartH} Z`;

    const area = createSVGElement('path', {
      d: areaPath,
      fill: 'url(#chartGradient)', opacity: '0.3'
    });

    // Gradient definition
    const defs = createSVGElement('defs', {});
    const gradient = createSVGElement('linearGradient', {
      id: 'chartGradient', x1: '0', y1: '0', x2: '0', y2: '1'
    });
    const stop1 = createSVGElement('stop', { offset: '0%', 'stop-color': 'var(--color-primary)', 'stop-opacity': '0.4' });
    const stop2 = createSVGElement('stop', { offset: '100%', 'stop-color': 'var(--color-primary)', 'stop-opacity': '0' });
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    svg.appendChild(area);

    // Line
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const line = createSVGElement('path', {
      d: linePath, fill: 'none', stroke: 'var(--color-primary)',
      'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    });
    
    // Animate drawing
    const lineLength = line.getTotalLength ? 1000 : 1000;
    line.style.strokeDasharray = lineLength;
    line.style.strokeDashoffset = lineLength;
    line.style.animation = 'drawLine 1.5s ease forwards';
    svg.appendChild(line);

    // Dots
    points.forEach((p, i) => {
      const dot = createSVGElement('circle', {
        cx: p.x, cy: p.y, r: 4,
        fill: 'var(--bg-card)', stroke: 'var(--color-primary)', 'stroke-width': 2.5
      });
      dot.style.opacity = '0';
      dot.style.animation = `fadeIn 0.3s ease ${0.1 * i + 1}s forwards`;
      svg.appendChild(dot);
    });

    // X-axis labels
    labels.forEach((label, i) => {
      if (i >= points.length) return;
      const text = createSVGElement('text', {
        x: points[i].x, y: height - 8,
        'text-anchor': 'middle', fill: 'var(--text-tertiary)',
        'font-size': '11', 'font-family': 'var(--font-body)'
      });
      text.textContent = label;
      svg.appendChild(text);
    });

    chartContainer.appendChild(svg);
  }

  function createSVGElement(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  /* === Chat Interface === */
  function initChat() {
    const chatInput = document.querySelector('.chat-input input');
    const chatSendBtn = document.querySelector('.chat-input .btn');
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatInput || !chatSendBtn || !chatMessages) return;

    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      const msg = document.createElement('div');
      msg.className = 'chat-message chat-message--sent';
      msg.innerHTML = `
        <div class="chat-message__bubble">${escapeHtml(text)}</div>
        <span class="chat-message__time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      `;
      msg.style.animation = 'fadeUp 0.3s ease';
      chatMessages.appendChild(msg);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Simulate typing indicator and reply
      setTimeout(() => {
        const typing = document.createElement('div');
        typing.className = 'chat-message chat-message--received';
        typing.innerHTML = `
          <div class="chat-message__bubble">
            <div class="chat-typing">
              <span class="chat-typing__dot"></span>
              <span class="chat-typing__dot"></span>
              <span class="chat-typing__dot"></span>
            </div>
          </div>
        `;
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
          typing.remove();
          const reply = document.createElement('div');
          reply.className = 'chat-message chat-message--received';
          reply.innerHTML = `
            <div class="chat-message__bubble">Thanks for your message! Our team will get back to you shortly.</div>
            <span class="chat-message__time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          `;
          reply.style.animation = 'fadeUp 0.3s ease';
          chatMessages.appendChild(reply);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
      }, 500);
    };

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* === Mobile Nav === */
  function initMobileNav() {
    document.querySelectorAll('.dashboard__mobile-nav-item').forEach(item => {
      item.addEventListener('click', function() {
        document.querySelectorAll('.dashboard__mobile-nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  return { init };
})();
