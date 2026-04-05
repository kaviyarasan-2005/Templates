/* ============================================
   MAIN.JS — Core Site Functionality
   ============================================ */
(function () {
  'use strict';

  /* ---- DOM Ready ---- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavbar();
    initMobileMenu();
    initDropdowns();
    initThemeToggle();
    initRTLToggle();
    initBackToTop();
    initSmoothScroll();
    initFormValidation();
    initAccordion();
    initTabs();
    initCounters();
    initNewsletter();
    initRippleButtons();
    initActiveNav();
    initCartBadge();
  }

  /* ================================================
     NAVBAR — scroll behaviour
     ================================================ */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ================================================
     MOBILE MENU
     ================================================ */
  function initMobileMenu() {
    const toggle = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ================================================
     DROPDOWNS
     ================================================ */
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.navbar__dropdown');
    dropdowns.forEach(dd => {
      const toggleEl = dd.querySelector('.navbar__dropdown-toggle');
      if (!toggleEl) return;

      toggleEl.addEventListener('click', e => {
        e.preventDefault();
        // Close others
        dropdowns.forEach(other => { if (other !== dd) other.classList.remove('open'); });
        dd.classList.toggle('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!e.target.closest('.navbar__dropdown')) {
        dropdowns.forEach(dd => dd.classList.remove('open'));
      }
    });
  }

  /* ================================================
     THEME TOGGLE (Dark / Light)
     ================================================ */
  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  /* ================================================
     RTL / LTR TOGGLE
     ================================================ */
  function initRTLToggle() {
    const btn = document.getElementById('rtl-toggle');
    if (!btn) return;

    const saved = localStorage.getItem('dir') || 'ltr';
    applyDir(saved);

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      applyDir(next);
      localStorage.setItem('dir', next);
    });
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    const btn = document.getElementById('rtl-toggle');
    if (btn) {
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    }
  }

  /* ================================================
     BACK TO TOP
     ================================================ */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ================================================
     SMOOTH SCROLL — anchor links
     ================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ================================================
     FORM VALIDATION
     ================================================ */
  function initFormValidation() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', e => {
        let valid = true;
        form.querySelectorAll('[required]').forEach(input => {
          clearError(input);
          if (!input.value.trim()) {
            showError(input, 'This field is required');
            valid = false;
          } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            showError(input, 'Please enter a valid email');
            valid = false;
          } else if (input.minLength > 0 && input.value.length < input.minLength) {
            showError(input, `Minimum ${input.minLength} characters required`);
            valid = false;
          }
        });

        if (!valid) {
          e.preventDefault();
          const firstErr = form.querySelector('.form-input.error');
          if (firstErr) firstErr.focus();
        }
      });

      // Live clear on input
      form.querySelectorAll('[required]').forEach(input => {
        input.addEventListener('input', () => clearError(input));
      });
    });
  }

  function showError(input, msg) {
    input.classList.add('error');
    input.classList.add('animate-shake');
    setTimeout(() => input.classList.remove('animate-shake'), 400);
    let errEl = input.parentElement.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'form-error';
      input.parentElement.appendChild(errEl);
    }
    errEl.textContent = msg;
    errEl.style.display = 'block';
  }

  function clearError(input) {
    input.classList.remove('error');
    const errEl = input.parentElement.querySelector('.form-error');
    if (errEl) errEl.style.display = 'none';
  }

  /* ================================================
     ACCORDION
     ================================================ */
  function initAccordion() {
    document.querySelectorAll('.accordion__header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion__item');
        const body = item.querySelector('.accordion__body');
        const isOpen = item.classList.contains('active');

        // Close siblings
        item.closest('.accordion')?.querySelectorAll('.accordion__item').forEach(sib => {
          if (sib !== item) {
            sib.classList.remove('active');
            sib.querySelector('.accordion__body').style.maxHeight = '0';
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          body.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  /* ================================================
     TABS
     ================================================ */
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabsContainer => {
      const btns = tabsContainer.querySelectorAll('.tabs__btn');
      const panels = tabsContainer.querySelectorAll('.tabs__panel');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          btns.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          const panel = tabsContainer.querySelector(`#${target}`);
          if (panel) panel.classList.add('active');
        });
      });
    });
  }

  /* ================================================
     ANIMATED COUNTERS
     ================================================ */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => observer.observe(c));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(target * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ================================================
     NEWSLETTER FORM
     ================================================ */
  function initNewsletter() {
    document.querySelectorAll('.newsletter__form, .footer__newsletter-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input || !input.value.trim()) return;
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          showToast('Please enter a valid email address', 'error');
          return;
        }

        showToast('Thank you for subscribing! ☕', 'success');
        input.value = '';
      });
    });
  }

  /* ================================================
     TOAST NOTIFICATION
     ================================================ */
  window.showToast = function (message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.style.cssText = 'position:fixed;top:90px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.style.cssText = `
      padding:12px 20px;border-radius:8px;font-size:14px;font-weight:500;
      color:#fff;min-width:280px;max-width:400px;
      display:flex;align-items:center;gap:8px;
      box-shadow:0 4px 20px rgba(0,0,0,.15);
      animation:toastIn .4s ease both;
    `;

    const colors = { success: '#2D6A4F', error: '#E63946', warning: '#F4A261', info: '#457B9D' };
    toast.style.background = colors[type] || colors.info;
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut .3s ease both';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  /* ================================================
     RIPPLE EFFECT on Buttons
     ================================================ */
  function initRippleButtons() {
    document.querySelectorAll('.btn--primary, .btn--accent').forEach(btn => {
      btn.classList.add('ripple-effect');
      btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /* ================================================
     ACTIVE NAV LINK HIGHLIGHT
     ================================================ */
  function initActiveNav() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';

    document.querySelectorAll('.navbar__link, .mobile-menu__link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop();
      if (linkFile === filename || (filename === '' && linkFile === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ================================================
     CART BADGE
     ================================================ */
  function initCartBadge() {
    const badge = document.querySelector('.navbar__cart-badge');
    if (!badge) return;
    const count = parseInt(localStorage.getItem('cartCount') || '0', 10);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  window.updateCart = function (delta) {
    let count = parseInt(localStorage.getItem('cartCount') || '0', 10);
    count = Math.max(0, count + delta);
    localStorage.setItem('cartCount', count);
    const badge = document.querySelector('.navbar__cart-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
    if (delta > 0) showToast('Item added to cart! 🛒', 'success');
  };

  /* ================================================
     PRICING TOGGLE (Monthly / Yearly)
     ================================================ */
  window.initPricingToggle = function () {
    const toggle = document.getElementById('pricing-toggle');
    if (!toggle) return;

    toggle.addEventListener('change', () => {
      const isYearly = toggle.checked;
      document.querySelectorAll('[data-monthly]').forEach(el => {
        el.textContent = isYearly ? el.dataset.yearly : el.dataset.monthly;
      });
      document.querySelectorAll('[data-period]').forEach(el => {
        el.textContent = isYearly ? '/year' : '/month';
      });
    });
  };

})();
