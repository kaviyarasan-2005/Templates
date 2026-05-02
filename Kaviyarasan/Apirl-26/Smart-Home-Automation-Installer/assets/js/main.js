/* ============================================
   MAIN.JS — Core Site Functionality
   ============================================ */

(function () {
  'use strict';

  // ---- Theme Management ----
  const ThemeManager = {
    init() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      this.apply(theme);
      this.bindToggle();
    },
    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      const icons = document.querySelectorAll('#theme-icon');
      icons.forEach(icon => {
        if (icon) {
          icon.innerHTML = theme === 'dark'
            ? '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor"/>'
            : '<circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>';
        }
      });
    },
    bindToggle() {
      const btns = document.querySelectorAll('#theme-toggle');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const current = document.documentElement.getAttribute('data-theme');
          this.apply(current === 'dark' ? 'light' : 'dark');
        });
      });
    }
  };

  // ---- RTL Management ----
  const RTLManager = {
    init() {
      const saved = localStorage.getItem('dir');
      const dir = saved || 'rtl';
      this.apply(dir);
      this.bindToggle();
    },
    apply(dir) {
      document.documentElement.setAttribute('dir', dir);
      localStorage.setItem('dir', dir);
      document.querySelectorAll('#rtl-toggle').forEach(btn => {
        btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      });
    },
    bindToggle() {
      document.querySelectorAll('#rtl-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const current = document.documentElement.getAttribute('dir') || 'rtl';
          this.apply(current === 'rtl' ? 'ltr' : 'rtl');
        });
      });
    }
  };

  // ---- Navbar ----
  const Navbar = {
    init() {
      this.navbar = document.querySelector('.navbar');
      this.hamburger = document.getElementById('nav-hamburger');
      this.mobileNav = document.getElementById('mobile-nav');
      this.bindScroll();
      this.bindHamburger();
      this.bindDropdowns();
      this.setActiveLink();
    },
    bindScroll() {
      if (!this.navbar) return;
      window.addEventListener('scroll', () => {
        this.navbar.classList.toggle('scrolled', window.scrollY > 10);
      });
    },
    bindHamburger() {
      if (!this.hamburger || !this.mobileNav) return;
      this.hamburger.addEventListener('click', () => {
        this.mobileNav.classList.toggle('open');
        document.body.style.overflow = this.mobileNav.classList.contains('open') ? 'hidden' : '';
      });
    },
    bindDropdowns() {
      document.querySelectorAll('.nav-dropdown__trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const dropdown = trigger.closest('.nav-dropdown');
          document.querySelectorAll('.nav-dropdown').forEach(d => {
            if (d !== dropdown) d.classList.remove('open');
          });
          dropdown.classList.toggle('open');
        });
      });
      document.addEventListener('click', () => {
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
      });
    },
    setActiveLink() {
      const path = window.location.pathname;
      const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
      document.querySelectorAll('.navbar__links a, .mobile-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === filename || href.endsWith('/' + filename))) {
          link.classList.add('active');
        }
      });
    }
  };

  // ---- AOS Init ----
  const AOSInit = {
    init() {
      if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 600, once: true, offset: 100, easing: 'ease-out' });
      }
    }
  };

  // ---- Form Validation ----
  const FormValidator = {
    init() {
      document.querySelectorAll('form[data-validate]').forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          let valid = true;
          form.querySelectorAll('[required]').forEach(input => {
            if (!this.validateField(input)) valid = false;
          });
          if (valid) {
            this.showSuccess(form);
          }
        });
        form.querySelectorAll('[required]').forEach(input => {
          input.addEventListener('blur', () => this.validateField(input));
          input.addEventListener('input', () => {
            if (input.classList.contains('error')) this.validateField(input);
          });
        });
      });
      this.initPasswordStrength();
    },
    validateField(input) {
      const value = input.value.trim();
      const type = input.type;
      let isValid = true;

      if (!value) {
        isValid = false;
      } else if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        isValid = false;
      } else if (input.dataset.minlength && value.length < parseInt(input.dataset.minlength)) {
        isValid = false;
      } else if (input.dataset.match) {
        const matchEl = document.getElementById(input.dataset.match);
        if (matchEl && matchEl.value !== value) isValid = false;
      }

      input.classList.toggle('error', !isValid);
      const group = input.closest('.form-group');
      if (group) group.classList.toggle('has-error', !isValid);
      return isValid;
    },
    initPasswordStrength() {
      document.querySelectorAll('[data-password-strength]').forEach(input => {
        input.addEventListener('input', () => {
          const bar = input.closest('.form-group').querySelector('.password-strength__bar');
          if (!bar) return;
          const val = input.value;
          let strength = 0;
          if (val.length >= 6) strength++;
          if (val.length >= 10) strength++;
          if (/[A-Z]/.test(val) && /[0-9]/.test(val)) strength++;
          if (/[^A-Za-z0-9]/.test(val)) strength++;
          bar.className = 'password-strength__bar';
          if (strength <= 1) bar.classList.add('weak');
          else if (strength <= 2) bar.classList.add('medium');
          else bar.classList.add('strong');
        });
      });
    },
    showSuccess(form) {
      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = 'Submitted Successfully!';
        btn.style.background = '#10B981';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          form.reset();
          form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
          form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
          form.querySelectorAll('.password-strength__bar').forEach(bar => bar.className = 'password-strength__bar');
        }, 2000);
      }
    }
  };

  // ---- Accordion ----
  const Accordion = {
    init() {
      document.querySelectorAll('.accordion__trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const item = trigger.closest('.accordion__item');
          const content = item.querySelector('.accordion__content');
          const isOpen = item.classList.contains('open');

          // Close siblings
          item.parentElement.querySelectorAll('.accordion__item.open').forEach(openItem => {
            if (openItem !== item) {
              openItem.classList.remove('open');
              openItem.querySelector('.accordion__content').style.maxHeight = '0';
            }
          });

          item.classList.toggle('open', !isOpen);
          content.style.maxHeight = isOpen ? '0' : content.scrollHeight + 'px';
        });
      });
    }
  };

  // ---- Pricing Toggle ----
  const PricingToggle = {
    init() {
      const toggle = document.querySelector('.pricing-toggle__switch');
      if (!toggle) return;
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        const isAnnual = toggle.classList.contains('active');
        document.querySelectorAll('.pricing-toggle__label').forEach((label, i) => {
          label.classList.toggle('active', i === (isAnnual ? 1 : 0));
        });
        document.querySelectorAll('[data-monthly]').forEach(el => {
          el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
        });
      });
    }
  };

  // ---- Blog Filter/Search ----
  const BlogFilter = {
    init() {
      const searchInput = document.getElementById('blog-search');
      if (searchInput) {
        searchInput.addEventListener('input', () => {
          const q = searchInput.value.toLowerCase();
          document.querySelectorAll('.blog-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(q) ? '' : 'none';
          });
        });
      }
      document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', () => {
          document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
          tag.classList.add('active');
          const cat = tag.dataset.category;
          document.querySelectorAll('.blog-card').forEach(card => {
            card.style.display = (!cat || cat === 'all' || card.dataset.category === cat) ? '' : 'none';
          });
        });
      });
    }
  };

  // ---- Countdown Timer (Coming Soon) ----
  const Countdown = {
    init() {
      const el = document.getElementById('countdown');
      if (!el) return;
      const target = new Date();
      target.setDate(target.getDate() + 30);
      const update = () => {
        const now = new Date();
        const diff = target - now;
        if (diff <= 0) return;
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        el.querySelector('[data-days]').textContent = String(days).padStart(2, '0');
        el.querySelector('[data-hours]').textContent = String(hours).padStart(2, '0');
        el.querySelector('[data-minutes]').textContent = String(mins).padStart(2, '0');
        el.querySelector('[data-seconds]').textContent = String(secs).padStart(2, '0');
      };
      update();
      setInterval(update, 1000);
    }
  };

  // ---- Counter Animation ----
  const CounterAnimation = {
    init() {
      const counters = document.querySelectorAll('[data-count]');
      if (!counters.length) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(c => observer.observe(c));
    },
    animate(el) {
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  };

  // ---- Smooth scroll for anchor links ----
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
          const target = document.querySelector(a.getAttribute('href'));
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }
  };

  // ---- Password Visibility Toggle ----
  const PasswordToggle = {
    init() {
      document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const input = btn.previousElementSibling;
          if (!input) return;
          const isPassword = input.type === 'password';
          input.type = isPassword ? 'text' : 'password';
          btn.innerHTML = isPassword
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
        });
      });
    }
  };

  // ---- Init All ----
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    RTLManager.init();
    Navbar.init();
    AOSInit.init();
    FormValidator.init();
    Accordion.init();
    PricingToggle.init();
    BlogFilter.init();
    Countdown.init();
    CounterAnimation.init();
    SmoothScroll.init();
    PasswordToggle.init();
  });
})();
