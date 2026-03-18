/* ============================================================
   FORGECORE — main.js
   Navigation, Mobile Menu, Accordion, Scroll effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* ── Mobile Menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileClose = document.querySelector('.mobile-close');

  function openMenu() {
    hamburger?.classList.add('open');
    mobileOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    mobileOverlay?.classList.contains('open') ? closeMenu() : openMenu();
  });
  mobileClose?.addEventListener('click', closeMenu);

  /* Mobile sub-menus */
  document.querySelectorAll('.mobile-nav-link[data-sub]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const subId = link.dataset.sub;
      const sub = document.getElementById(subId);
      if (sub) sub.classList.toggle('open');
      const chevron = link.querySelector('.chevron');
      if (chevron) chevron.style.transform = sub?.classList.contains('open') ? 'rotate(180deg)' : '';
    });
  });

  /* Close on outside click */
  mobileOverlay?.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) closeMenu();
  });

  /* Close on ESC */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  /* ── Accordion (FAQ) ── */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('open'));

      // Open clicked (if wasn't already open)
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── FAQ Category Filter ── */
  document.querySelectorAll('.faq-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.faq-group').forEach(group => {
        if (cat === 'all' || group.dataset.cat === cat) {
          group.style.display = '';
        } else {
          group.style.display = 'none';
        }
      });
    });
  });

  /* ── Product Filter ── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('[data-category]').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp .4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ── Admin Sidebar Toggle ── */
  const adminSidebar = document.querySelector('.admin-sidebar');

  // Desktop collapse toggle (old style)
  const sidebarToggle = document.querySelector('.sidebar-toggle-btn');
  sidebarToggle?.addEventListener('click', () => {
    adminSidebar?.classList.toggle('collapsed');
  });

  // Mobile open/close (new layout)
  const sidebarOpenBtn = document.getElementById('sidebar-toggle');
  const sidebarCloseBtn = document.getElementById('sidebar-close');

  sidebarOpenBtn?.addEventListener('click', () => {
    adminSidebar?.classList.add('mobile-open');
    document.body.style.overflow = 'hidden';
  });
  sidebarCloseBtn?.addEventListener('click', () => {
    adminSidebar?.classList.remove('mobile-open');
    document.body.style.overflow = '';
  });

  // Close admin sidebar on outside click (mobile)
  document.addEventListener('click', (e) => {
    if (
      adminSidebar?.classList.contains('mobile-open') &&
      !adminSidebar.contains(e.target) &&
      e.target !== sidebarOpenBtn
    ) {
      adminSidebar.classList.remove('mobile-open');
      document.body.style.overflow = '';
    }
  });

  /* ── Pricing Toggle (Monthly/Annual) ── */
  const pricingToggle = document.getElementById('pricing-toggle');
  if (pricingToggle) {
    const prices = {
      monthly: ['0', '299', '899'],
      annual: ['0', '249', '749']
    };
    pricingToggle.addEventListener('change', () => {
      const mode = pricingToggle.checked ? 'annual' : 'monthly';
      document.querySelectorAll('.price-amount').forEach((el, i) => {
        el.textContent = prices[mode][i] || el.textContent;
      });
      const label = document.getElementById('billing-label');
      if (label) label.textContent = pricingToggle.checked ? 'Billed annually' : 'Billed monthly';
    });
  }

  /* ── Countdown Timer ── */
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 47);

    function updateCountdown() {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) { countdownEl.innerHTML = '<p>We are live!</p>'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      document.getElementById('cd-days') && (document.getElementById('cd-days').textContent = String(d).padStart(2,'0'));
      document.getElementById('cd-hours') && (document.getElementById('cd-hours').textContent = String(h).padStart(2,'0'));
      document.getElementById('cd-mins') && (document.getElementById('cd-mins').textContent = String(m).padStart(2,'0'));
      document.getElementById('cd-secs') && (document.getElementById('cd-secs').textContent = String(s).padStart(2,'0'));
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ── Form validation ── */
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const msgEl = field.nextElementSibling;
        if (!field.value.trim()) {
          field.classList.add('error');
          if (msgEl?.classList.contains('form-msg')) {
            msgEl.textContent = 'This field is required.';
            msgEl.classList.add('error');
          }
          valid = false;
        } else {
          field.classList.remove('error');
          if (msgEl?.classList.contains('form-msg')) msgEl.textContent = '';
        }
        // Email validation
        if (field.type === 'email' && field.value.trim()) {
          const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRe.test(field.value)) {
            field.classList.add('error');
            if (msgEl?.classList.contains('form-msg')) {
              msgEl.textContent = 'Please enter a valid email.';
              msgEl.classList.add('error');
            }
            valid = false;
          }
        }
      });
      if (valid) {
        const btn = form.querySelector('[type="submit"]');
        if (btn) { btn.textContent = 'Sent! ✓'; btn.disabled = true; btn.style.background = 'var(--success)'; }
      }
    });
  });

  /* ── Scroll-triggered fade-in ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card, .feature-card, .service-card, .blog-card, .pricing-card, .team-card, .process-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
  });

  /* ── Smooth stat counter ── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target || el.textContent);
        if (isNaN(target)) return;
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current.toLocaleString();
          if (current >= target) clearInterval(timer);
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter], [data-target]').forEach(el => {
    const val = parseInt(el.dataset.target || el.textContent);
    if (!isNaN(val)) { el.dataset.target = val; el.textContent = '0'; counterObserver.observe(el); }
  });

  /* ── Newsletter form ── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
      if (input?.value.trim()) {
        btn.textContent = 'Subscribed ✓';
        btn.style.background = 'var(--success)';
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Subscribe';
          btn.style.background = '';
        }, 3000);
      }
    });
  });

});
