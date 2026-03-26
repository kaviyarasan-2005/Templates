// FORXA - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {

  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Mobile menu
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu-close');
  const overlay = document.querySelector('.overlay');

  function openMobile() {
    if (mobileMenu) mobileMenu.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobile);
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);
  if (overlay) overlay.addEventListener('click', closeMobile);

  // Accordion FAQ
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
      const item = this.parentElement;
      const body = item.querySelector('.accordion-body');
      const inner = item.querySelector('.accordion-body-inner');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion-body').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });

  // Admin sidebar toggle (mobile)
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const adminSidebar = document.querySelector('.admin-sidebar');
  if (sidebarToggle && adminSidebar) {
    sidebarToggle.addEventListener('click', () => {
      adminSidebar.classList.toggle('active');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Product filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Contact form submit
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you soon.');
      this.reset();
    });
  }

  // Newsletter form
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for subscribing to our newsletter!');
      this.reset();
    });
  });

  // Countdown (Coming Soon page)
  function updateCountdown() {
    const target = new Date();
    target.setDate(target.getDate() + 45);
    const els = { days: document.getElementById('cd-days'), hours: document.getElementById('cd-hours'), minutes: document.getElementById('cd-minutes'), seconds: document.getElementById('cd-seconds') };
    if (!els.days) return;
    function tick() {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) return;
      els.days.textContent = String(Math.floor(diff / 86400000)).padStart(2,'0');
      els.hours.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
      els.minutes.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
      els.seconds.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
    }
    tick();
    setInterval(tick, 1000);
  }
  updateCountdown();

});
// ===== USER DASHBOARD JS =====
document.addEventListener('DOMContentLoaded', function () {

  // ── Sidebar toggle (mobile) ──────────────────────────────────────
  const toggleBtn   = document.getElementById('sidebarToggleBtn');
  const sidebar     = document.getElementById('userSidebar');
  const overlay     = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if (overlay)   overlay.addEventListener('click', closeSidebar);

  // Close sidebar on resize back to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) closeSidebar();
  });

  // Show/hide sidebar toggle button based on screen size
  function checkToggleVisibility() {
    if (toggleBtn) {
      toggleBtn.style.display = window.innerWidth <= 1024 ? 'inline-flex' : 'none';
    }
  }
  checkToggleVisibility();
  window.addEventListener('resize', checkToggleVisibility);

  // ── Active nav link highlight ────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'user-dashboard.html';
  document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href !== '#' && href.includes(currentPage)) {
      link.classList.add('active');
    }
  });

  // ── Notification bell badge ──────────────────────────────────────
  const notifBtn = document.querySelector('.udash-notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const badge = notifBtn.querySelector('.notif-count');
      if (badge) badge.style.display = 'none';
      // In a real app you would open a notification dropdown here
    });
  }

  // ── Stat card subtle entrance animation ─────────────────────────
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(function (card, i) {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(16px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setTimeout(function () {
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + i * 80);
  });

  // ── Progress bar animated fill ───────────────────────────────────
  const progressBar = document.querySelector('.udash-progress-bar');
  if (progressBar) {
    const target = progressBar.style.width;
    progressBar.style.width = '0';
    setTimeout(function () {
      progressBar.style.width       = target;
      progressBar.style.transition  = 'width 1s ease';
    }, 400);
  }

});
