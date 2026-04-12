/**
 * VINTAGE RARE BOOKSTORE — MAIN.JS
 * Core functionality: Navigation, Theme Toggle, Smooth Scroll, Ripple
 */

'use strict';

/* ===== THEME MANAGEMENT ===== */
const ThemeManager = {
  ATTR: 'data-theme',
  KEY: 'vrb_theme',

  init() {
    const saved = localStorage.getItem(this.KEY);
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (sysDark ? 'dark' : 'light');
    this.apply(theme);
    this.bindToggle();
    // Listen to system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.KEY)) {
        this.apply(e.matches ? 'dark' : 'light');
      }
    });
  },

  apply(theme) {
    document.documentElement.setAttribute(this.ATTR, theme);
    localStorage.setItem(this.KEY, theme);
    // Update aria-label on toggle button
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  },

  toggle() {
    const current = document.documentElement.getAttribute(this.ATTR) || 'light';
    this.apply(current === 'dark' ? 'light' : 'dark');
  },

  bindToggle() {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', () => this.toggle());
  }
};

/* ===== NAVBAR ===== */
const Navbar = {
  nav: null,
  hamburger: null,
  mobileNav: null,
  overlay: null,

  init() {
    this.nav = document.querySelector('.navbar');
    this.hamburger = document.getElementById('hamburger');
    this.mobileNav = document.getElementById('mobile-nav');

    if (!this.nav) return;

    // Scrolled state
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();

    // Hamburger
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Active link
    this.setActiveLink();

    // Dropdowns (desktop keyboard)
    this.initDropdowns();

    // Close mobile nav on outside click
    document.addEventListener('click', (e) => {
      if (this.mobileNav && this.mobileNav.classList.contains('open')) {
        if (!this.mobileNav.contains(e.target) && !this.hamburger.contains(e.target)) {
          this.closeMobileMenu();
        }
      }
    });

    // Mobile sub-menu toggles
    document.querySelectorAll('.mobile-sub-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = btn.nextElementSibling;
        if (sub) {
          sub.classList.toggle('open');
          btn.querySelector('.nav-chevron')?.style.setProperty('transform',
            sub.classList.contains('open') ? 'rotate(180deg)' : '');
        }
      });
    });
  },

  onScroll() {
    if (window.scrollY > 10) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  },

  toggleMobileMenu() {
    const isOpen = this.mobileNav?.classList.contains('open');
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  },

  openMobileMenu() {
    this.mobileNav?.classList.add('open');
    this.hamburger?.classList.add('open');
    this.hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  },

  closeMobileMenu() {
    this.mobileNav?.classList.remove('open');
    this.hamburger?.classList.remove('open');
    this.hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  },

  setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link[href]').forEach(link => {
      const href = link.getAttribute('href').split('/').pop();
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  },

  initDropdowns() {
    document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
      const trigger = item.querySelector('.nav-link');
      item.addEventListener('mouseenter', () => item.classList.add('open'));
      item.addEventListener('mouseleave', () => item.classList.remove('open'));
      // Keyboard
      trigger?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.classList.toggle('open');
        }
        if (e.key === 'Escape') item.classList.remove('open');
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-item.has-dropdown.open').forEach(item => {
        if (!item.contains(e.target)) item.classList.remove('open');
      });
    });
  }
};

/* ===== RIPPLE EFFECT ===== */
function addRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: 0;
    height: 0;
    background: rgba(255,255,255,0.35);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ripple 0.6s ease-out forwards;
    pointer-events: none;
  `;

  // Ensure btn is relative
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}

/* ===== SMOOTH SCROLL ANCHOR ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = document.querySelector('.navbar')?.offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target') || el.textContent.replace(/\D/g, ''), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOut cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ===== STAT BAR ANIMATION ===== */
function initStatBars() {
  const bars = document.querySelectorAll('.stat-bar-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute('data-width') + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(b => observer.observe(b));
}

/* ===== TESTIMONIALS CAROUSEL ===== */
const Carousel = {
  init(selector = '.testimonials-carousel') {
    const wrapper = document.querySelector(selector);
    if (!wrapper) return;

    const track = wrapper.querySelector('.testimonials-track');
    const dots = wrapper.querySelectorAll('.carousel-dot');
    const prev = wrapper.querySelector('.carousel-btn--prev');
    const next = wrapper.querySelector('.carousel-btn--next');
    const items = track?.children;
    if (!track || !items?.length) return;

    let current = 0;
    let autoTimer = null;
    const total = items.length;

    const goTo = (idx) => {
      current = ((idx % total) + total) % total;
      const item = items[current];
      const offset = item.offsetLeft;
      track.style.transform = `translateX(-${offset}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const startAuto = () => {
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    };

    const stopAuto = () => clearInterval(autoTimer);

    prev?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    next?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);

    // Touch swipe
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
    wrapper.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    });

    goTo(0);
    startAuto();
  }
};

/* ===== ACCORDION ===== */
function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close siblings if only-one mode
      if (item.closest('.accordion-single')) {
        item.closest('.accordion').querySelectorAll('.accordion-item.open').forEach(openItem => {
          openItem.classList.remove('open');
        });
      }

      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', (!isOpen).toString());
    });
  });
}

/* ===== MODAL ===== */
function initModals() {
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.getAttribute('data-modal-open'));
      modal?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelectorAll('.modal-overlay, [data-modal-close]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.hasAttribute('data-modal-close')) {
        e.target.closest('.modal-overlay')?.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });
}

/* ===== NAVBAR PAGE OFFSET ===== */
function setPageOffset() {
  const content = document.querySelector('.page-content');
  const navbar = document.querySelector('.navbar');
  // Already done via CSS, but for dynamic nav height:
  if (content && navbar) {
    content.style.paddingTop = navbar.offsetHeight + 'px';
  }
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Navbar.init();
  initSmoothScroll();
  initCounters();
  initStatBars();
  initAccordions();
  initModals();
  Carousel.init();

  // Register ripple on all .btn elements
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', addRipple);
  });

  // Fade-in page
  document.body.classList.add('page-enter');
});

// Export for module use if needed
if (typeof module !== 'undefined') {
  module.exports = { ThemeManager, Navbar, Carousel };
}
