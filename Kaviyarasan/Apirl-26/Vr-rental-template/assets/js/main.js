/* ============================================================
   RV ADVEN RENTALS - Main JavaScript
   Version: 1.0.0
   ============================================================ */

'use strict';

// ============================================================
// 1. UTILITY FUNCTIONS
// ============================================================
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

function debounce(fn, delay = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function getScrollbarWidth() {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);
  const inner = document.createElement('div');
  outer.appendChild(inner);
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  return scrollbarWidth;
}

// ============================================================
// 2. THEME MANAGEMENT (Dark / Light Mode)
// ============================================================
const ThemeManager = {
  STORAGE_KEY: 'rv-theme',
  DARK: 'dark',
  LIGHT: 'light',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? this.DARK : this.LIGHT);
    this.apply(theme);
    this.bindToggle();
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateIcon(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === this.DARK ? this.LIGHT : this.DARK);
  },

  updateIcon(theme) {
    $$('[data-theme-toggle]').forEach(btn => {
      const icon = btn.querySelector('i');
      if (!icon) return;
      if (theme === this.DARK) {
        icon.className = 'fas fa-sun';
        btn.setAttribute('aria-label', 'Switch to light mode');
        btn.setAttribute('title', 'Switch to light mode');
      } else {
        icon.className = 'fas fa-moon';
        btn.setAttribute('aria-label', 'Switch to dark mode');
        btn.setAttribute('title', 'Switch to dark mode');
      }
    });
  },

  bindToggle() {
    $$('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }
};

// ============================================================
// 3. RTL / LANGUAGE DIRECTION TOGGLE
// ============================================================
const DirectionManager = {
  STORAGE_KEY: 'rv-direction',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY) || 'ltr';
    this.apply(saved);
    this.bindToggle();
  },

  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(this.STORAGE_KEY, dir);
    this.updateIcon(dir);

    // Load RTL stylesheet if needed
    let rtlLink = $('#rtl-stylesheet');
    if (dir === 'rtl') {
      if (!rtlLink) {
        rtlLink = document.createElement('link');
        rtlLink.id = 'rtl-stylesheet';
        rtlLink.rel = 'stylesheet';
        rtlLink.href = this.getRTLPath();
        document.head.appendChild(rtlLink);
      }
    } else {
      if (rtlLink) rtlLink.remove();
    }
  },

  getRTLPath() {
    // Determine relative path based on current page depth
    const depth = location.pathname.split('/').filter(Boolean).length;
    const prefix = depth > 1 ? '../'.repeat(depth - 1) : '';
    // Handle pages subfolder
    if (location.pathname.includes('/pages/')) {
      return '../assets/css/rtl.css';
    }
    if (location.pathname.includes('/dashboard/')) {
      return '../../assets/css/rtl.css';
    }
    return 'assets/css/rtl.css';
  },

  toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    this.apply(current === 'rtl' ? 'ltr' : 'rtl');
  },

  updateIcon(dir) {
    const selector = '[data-dir-toggle], #dir-toggle, #dir-toggle-btn';
    $$(selector).forEach(btn => {
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      
      if (dir === 'rtl') {
        btn.innerHTML = 'RTL';
      } else {
        btn.innerHTML = 'LTR';
      }
      
      btn.classList.add('dir-toggle-text');
    });
  },

  bindToggle() {
    $$('[data-dir-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }
};

// ============================================================
// 4. NAVBAR
// ============================================================
const Navbar = {
  el: null,
  hamburger: null,
  mobileNav: null,
  overlay: null,
  isOpen: false,

  init() {
    this.el = $('.navbar');
    this.hamburger = $('.hamburger');
    this.mobileNav = $('.mobile-nav');
    this.overlay = $('.mobile-overlay');

    if (!this.el) return;

    // Scrollbar compensation
    const sbWidth = getScrollbarWidth();
    document.documentElement.style.setProperty('--scrollbar-width', sbWidth + 'px');

    this.onScroll();
    this.bindEvents();
    this.highlightActive();
    this.initMobileDropdowns();
  },

  onScroll() {
    window.addEventListener('scroll', debounce(() => {
      if (window.scrollY > 50) {
        this.el.classList.add('scrolled');
      } else {
        this.el.classList.remove('scrolled');
      }
    }, 10), { passive: true });
  },

  bindEvents() {
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMobile());
    }
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeMobile());
    }

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) this.closeMobile();
    });

    // Dropdown hover accessibility
    $$('.nav-item').forEach(item => {
      const dropdown = item.querySelector('.dropdown-menu');
      if (!dropdown) return;
      item.addEventListener('mouseenter', () => {
        dropdown.style.display = '';
      });
    });
  },

  toggleMobile() {
    this.isOpen ? this.closeMobile() : this.openMobile();
  },

  openMobile() {
    this.isOpen = true;
    this.hamburger?.classList.add('open');
    this.mobileNav?.classList.add('open');
    this.overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.hamburger?.setAttribute('aria-expanded', 'true');
  },

  closeMobile() {
    this.isOpen = false;
    this.hamburger?.classList.remove('open');
    this.mobileNav?.classList.remove('open');
    this.overlay?.classList.remove('open');
    document.body.style.overflow = '';
    this.hamburger?.setAttribute('aria-expanded', 'false');
  },

  highlightActive() {
    const current = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link, .mobile-nav-link, .dash-nav-link').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href') || '';
      if (href && (href.endsWith(current) || (current === '' && href.endsWith('index.html')))) {
        link.classList.add('active');
      }
    });
  },

  initMobileDropdowns() {
    if (!this.mobileNav) return;
    const links = Array.from(this.mobileNav.querySelectorAll('a.mobile-nav-link'));
    
    // 1. Identify groups (Parents and their following indented children)
    const groups = [];
    let currentGroup = null;

    const isIndented = (l) => {
      const style = l.getAttribute('style') || '';
      return style.includes('padding-left: 24px') || l.style.paddingLeft === '24px';
    };

    links.forEach(link => {
      if (!isIndented(link)) {
        currentGroup = { parent: link, children: [] };
        groups.push(currentGroup);
      } else if (currentGroup) {
        currentGroup.children.push(link);
      }
    });

    // 2. Process groups that actually have children
    groups.forEach(group => {
      if (group.children.length === 0) return;

      const { parent, children } = group;

      // Transform parent into toggle
      const icon = parent.querySelector('i');
      if (icon) {
        icon.className = 'fas fa-chevron-down';
        icon.style.transition = 'transform 0.3s ease';
      } else {
        parent.innerHTML += ' <i class="fas fa-chevron-down" style="transition: transform 0.3s ease; margin-left: auto;"></i>';
      }

      // Clone parent link for actual navigation if it has a real URL
      if (parent.getAttribute('href') !== '#' && !parent.dataset.hasClone) {
        const clone = parent.cloneNode(true);
        clone.style.paddingLeft = '24px';
        clone.style.fontSize = '0.9rem';
        const cloneIcon = clone.querySelector('i');
        if (cloneIcon) cloneIcon.remove();
        parent.dataset.hasClone = 'true';
        // Insert clone at start of children
        children.unshift(clone);
      }

      parent.setAttribute('href', '#');

      // Create container
      const container = document.createElement('div');
      container.className = 'mobile-submenu-container';
      container.style.cssText = 'display: none; flex-direction: column; background: rgba(0,0,0,0.02); border-radius: var(--radius-md); overflow: hidden; margin: 4px 0;';
      
      parent.parentNode.insertBefore(container, parent.nextSibling);

      // Move children into container
      children.forEach(child => container.appendChild(child));

      // Toggle events
      parent.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = container.style.display === 'flex';
        container.style.display = isOpen ? 'none' : 'flex';
        const ico = parent.querySelector('i');
        if (ico) ico.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    });

    // Handle initial active state
    const activeChild = Array.from(this.mobileNav.querySelectorAll('a.active')).find(l => isIndented(l));
    if (activeChild && activeChild.parentElement.classList.contains('mobile-submenu-container')) {
      const container = activeChild.parentElement;
      container.style.display = 'flex';
      const toggle = container.previousElementSibling;
      const toggleIco = toggle?.querySelector('i');
      if (toggleIco) toggleIco.style.transform = 'rotate(180deg)';
    }
  }
};

// ============================================================
// 5. SCROLL ANIMATIONS (Intersection Observer)
// ============================================================
const ScrollAnimations = {
  observer: null,

  init() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements
      $$('.animate-fade-up, .animate-fade-in, .animate-slide-left, .animate-slide-right').forEach(el => {
        el.classList.add('animated');
      });
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.animate-fade-up, .animate-fade-in, .animate-slide-left, .animate-slide-right').forEach(el => {
      this.observer.observe(el);
    });
  }
};

// ============================================================
// 6. COUNTER ANIMATION
// ============================================================
const CounterAnimation = {
  observer: null,

  init() {
    const counters = $$('[data-counter]');
    if (!counters.length) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => this.observer.observe(el));
  },

  animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const duration = 2000;
    const suffix = el.getAttribute('data-suffix') || '';
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }
};

// ============================================================
// 7. ACCORDION / FAQ
// ============================================================
const Accordion = {
  init() {
    $$('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isOpen = item.classList.contains('open');

        // Close all others in the same group
        const group = item.closest('.accordion-group');
        if (group) {
          $$('.accordion-item.open', group).forEach(openItem => {
            if (openItem !== item) openItem.classList.remove('open');
          });
        }

        item.classList.toggle('open', !isOpen);
        header.setAttribute('aria-expanded', !isOpen);
      });
    });
  }
};

// ============================================================
// 8. SCROLL TO TOP
// ============================================================
const ScrollToTop = {
  btn: null,

  init() {
    this.btn = $('.scroll-top');
    if (!this.btn) return;

    window.addEventListener('scroll', debounce(() => {
      if (window.scrollY > 400) {
        this.btn.classList.add('visible');
      } else {
        this.btn.classList.remove('visible');
      }
    }, 50), { passive: true });

    this.btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// ============================================================
// 9. FORM VALIDATION
// ============================================================
const FormValidator = {
  init() {
    $$('form[data-validate]').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (this.validate(form)) {
          this.handleSubmit(form);
        }
      });

      // Real-time validation
      $$('[required]', form).forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearError(input));
      });
    });
  },

  validate(form) {
    let valid = true;
    $$('[required]', form).forEach(field => {
      if (!this.validateField(field)) valid = false;
    });
    return valid;
  },

  validateField(field) {
    const value = field.value.trim();
    let error = '';

    if (!value) {
      error = 'This field is required.';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address.';
    } else if (field.type === 'tel' && !/^[\d\s\+\-\(\)]{7,}$/.test(value)) {
      error = 'Please enter a valid phone number.';
    } else if (field.minLength && value.length < field.minLength) {
      error = `Minimum ${field.minLength} characters required.`;
    }

    if (error) {
      this.showError(field, error);
      return false;
    } else {
      this.clearError(field);
      return true;
    }
  },

  showError(field, message) {
    field.classList.add('error');
    let errorEl = field.parentNode.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      errorEl.setAttribute('role', 'alert');
      field.parentNode.appendChild(errorEl);
    }
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  },

  clearError(field) {
    field.classList.remove('error');
    const errorEl = field.parentNode.querySelector('.form-error');
    if (errorEl) errorEl.remove();
  },

  handleSubmit(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        submitBtn.style.background = 'var(--color-success)';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          form.reset();
        }, 3000);
      }, 1500);
    }
  }
};

// ============================================================
// 10. IMAGE GALLERY / LIGHTBOX
// ============================================================
const Lightbox = {
  overlay: null,
  img: null,
  current: 0,
  images: [],

  init() {
    const galleryItems = $$('[data-lightbox]');
    if (!galleryItems.length) return;

    this.images = galleryItems.map(item => ({
      src: item.getAttribute('data-lightbox') || item.src || item.href,
      alt: item.getAttribute('data-alt') || item.getAttribute('alt') || ''
    }));

    this.createOverlay();

    galleryItems.forEach((item, i) => {
      item.style.cursor = 'zoom-in';
      item.addEventListener('click', e => {
        e.preventDefault();
        this.open(i);
      });
    });
  },

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox-overlay';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.innerHTML = `
      <button class="lightbox-close" aria-label="Close gallery"><i class="fas fa-times"></i></button>
      <button class="lightbox-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
      <button class="lightbox-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
      <div class="lightbox-content">
        <img class="lightbox-img" src="" alt="" />
        <p class="lightbox-caption"></p>
      </div>
    `;
    document.body.appendChild(this.overlay);

    this.img = this.overlay.querySelector('.lightbox-img');

    this.overlay.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.overlay.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
    this.overlay.querySelector('.lightbox-next').addEventListener('click', () => this.next());
    this.overlay.addEventListener('click', e => { if (e.target === this.overlay) this.close(); });

    document.addEventListener('keydown', e => {
      if (!this.overlay.classList.contains('open')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Inject lightbox styles
    const style = document.createElement('style');
    style.textContent = `
      .lightbox-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:9999; align-items:center; justify-content:center; }
      .lightbox-overlay.open { display:flex; }
      .lightbox-content { max-width:90vw; max-height:90vh; text-align:center; }
      .lightbox-img { max-width:100%; max-height:80vh; object-fit:contain; border-radius:8px; }
      .lightbox-caption { color:rgba(255,255,255,0.7); margin-top:12px; font-size:0.875rem; }
      .lightbox-close,.lightbox-prev,.lightbox-next { position:fixed; background:rgba(255,255,255,0.1); border:none; color:white; width:48px;height:48px; border-radius:50%; cursor:pointer; font-size:1.1rem; display:flex;align-items:center;justify-content:center; transition:background .2s; }
      .lightbox-close { top:20px; right:20px; }
      .lightbox-prev { left:20px; top:50%; transform:translateY(-50%); }
      .lightbox-next { right:20px; top:50%; transform:translateY(-50%); }
      .lightbox-close:hover,.lightbox-prev:hover,.lightbox-next:hover { background:rgba(255,255,255,0.2); }
    `;
    document.head.appendChild(style);
  },

  open(index) {
    this.current = index;
    this.show();
    this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.overlay.classList.remove('open');
    document.body.style.overflow = '';
  },

  show() {
    const { src, alt } = this.images[this.current];
    this.img.src = src;
    this.img.alt = alt;
    const caption = this.overlay.querySelector('.lightbox-caption');
    if (caption) caption.textContent = alt;
  },

  prev() {
    this.current = (this.current - 1 + this.images.length) % this.images.length;
    this.show();
  },

  next() {
    this.current = (this.current + 1) % this.images.length;
    this.show();
  }
};

// ============================================================
// 11. SEARCH FILTER (Services / Blog)
// ============================================================
const SearchFilter = {
  init() {
    const searchInput = $('[data-search-input]');
    const filterBtns = $$('[data-filter]');
    const items = $$('[data-search-item]');

    if (!searchInput && !filterBtns.length) return;

    let currentFilter = 'all';
    let currentSearch = '';

    const applyFilters = () => {
      items.forEach(item => {
        const category = item.getAttribute('data-category') || '';
        const text = item.textContent.toLowerCase();
        const matchesFilter = currentFilter === 'all' || category === currentFilter;
        const matchesSearch = !currentSearch || text.includes(currentSearch.toLowerCase());
        item.style.display = (matchesFilter && matchesSearch) ? '' : 'none';
      });
    };

    if (searchInput) {
      searchInput.addEventListener('input', debounce(e => {
        currentSearch = e.target.value;
        applyFilters();
      }, 300));
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        applyFilters();
      });
    });
  }
};

// ============================================================
// 12. PRICING TOGGLE (Monthly / Seasonal)
// ============================================================
const PricingToggle = {
  init() {
    const toggle = $('[data-pricing-toggle]');
    if (!toggle) return;

    toggle.addEventListener('change', () => {
      const isAlt = toggle.checked;
      $$('[data-price-base]').forEach(el => {
        const base = el.getAttribute('data-price-base');
        const alt = el.getAttribute('data-price-alt');
        el.textContent = isAlt ? alt : base;
      });
      $$('[data-period-label]').forEach(el => {
        el.textContent = isAlt ? 'per week' : 'per day';
      });
    });
  }
};

// ============================================================
// 13. COUNTDOWN TIMER (Coming Soon Page)
// ============================================================
const Countdown = {
  init() {
    const el = $('[data-countdown]');
    if (!el) return;

    const targetDate = new Date(el.getAttribute('data-countdown')).getTime();

    const update = () => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        el.innerHTML = '<span class="countdown-ended">We are live!</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      el.querySelectorAll('[data-unit]').forEach(unit => {
        const type = unit.getAttribute('data-unit');
        const val = { days, hours, minutes, seconds }[type];
        const numEl = unit.querySelector('.countdown-num');
        if (numEl) numEl.textContent = String(val).padStart(2, '0');
      });
    };

    update();
    setInterval(update, 1000);
  }
};

// ============================================================
// 14. COOKIE BANNER
// ============================================================
const CookieBanner = {
  init() {
    const banner = $('.cookie-banner');
    if (!banner) return;

    if (!localStorage.getItem('rv-cookies-accepted')) {
      setTimeout(() => banner.classList.add('visible'), 1500);
    }

    const acceptBtn = banner.querySelector('[data-accept-cookies]');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('rv-cookies-accepted', '1');
        banner.classList.remove('visible');
      });
    }
  }
};

// ============================================================
// 15. HERO PARALLAX (subtle)
// ============================================================
const HeroParallax = {
  init() {
    const heroBg = $('.hero-bg');
    if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }, { passive: true });
  }
};

// ============================================================
// 16. TOAST NOTIFICATION
// ============================================================
const Toast = {
  container: null,

  init() {
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed; bottom: 80px; right: 24px; z-index: 9999;
      display: flex; flex-direction: column; gap: 10px; pointer-events: none;
    `;
    document.body.appendChild(this.container);
  },

  show(message, type = 'success', duration = 3000) {
    const colors = {
      success: '#27AE60', error: '#E74C3C', info: '#3498DB', warning: '#F39C12'
    };
    const icons = {
      success: 'fa-check-circle', error: 'fa-exclamation-circle',
      info: 'fa-info-circle', warning: 'fa-exclamation-triangle'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
      display: flex; align-items: center; gap: 10px;
      background: white; color: #2C3E50; padding: 12px 16px;
      border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      border-left: 4px solid ${colors[type]}; font-size: 0.875rem;
      font-weight: 500; pointer-events: auto; min-width: 280px;
      transform: translateX(120%); transition: transform 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas ${icons[type]}" style="color:${colors[type]}"></i> ${message}`;
    this.container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// ============================================================
// 17. HERO CONTENT ANIMATION (staggered entrance)
// ============================================================
function animateHeroContent() {
  const heroContent = $('.hero-content');
  if (!heroContent) return;

  const elements = heroContent.querySelectorAll('.hero-label, h1, .hero-desc, .hero-actions, .trust-badges, .hero-search');
  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 120);
  });
}

// ============================================================
// 18. INITIALIZE ALL MODULES
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  DirectionManager.init();
  Navbar.init();
  ScrollAnimations.init();
  CounterAnimation.init();
  Accordion.init();
  ScrollToTop.init();
  FormValidator.init();
  Lightbox.init();
  SearchFilter.init();
  PricingToggle.init();
  Countdown.init();
  CookieBanner.init();
  HeroParallax.init();
  Toast.init();
  animateHeroContent();
});

// Export for use in other scripts
window.RVApp = { Toast, ThemeManager, DirectionManager };
