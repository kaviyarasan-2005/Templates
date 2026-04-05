/* ============================================================
   MAIN.JS — App Init, IntersectionObserver, Utilities
   ============================================================ */
'use strict';

/* ── Utilities ──────────────────────────────── */

/**
 * Debounce function
 */
function debounce(fn, delay = 16) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function
 */
function throttle(fn, limit = 16) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Query helpers
 */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/**
 * Add event listener shorthand
 */
function on(el, event, handler, options) {
  if (!el) return;
  (Array.isArray(el) ? el : [el]).forEach(e =>
    e.addEventListener(event, handler, options)
  );
}

/* ── Scroll Reveal System ───────────────────── */

function initScrollReveal() {
  const revealEls = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ── Lazy Image Loading ─────────────────────── */

function initLazyImages() {
  const lazyImgs = $$('img[data-src]');
  if (!lazyImgs.length) return;

  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        if (!src) return;

        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });

  lazyImgs.forEach(img => imgObserver.observe(img));
}

/* ── 3D Card Tilt Effect ────────────────────── */

function initCardTilt() {
  $$('.tilt-card').forEach(card => {
    on(card, 'mousemove', throttle((e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }));

    on(card, 'mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Ripple Button Effect ───────────────────── */

function initRipple() {
  on(document, 'click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    btn.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

/* ── Smooth Scroll for anchor links ────────── */

function initSmoothScroll() {
  on(document, 'click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    e.preventDefault();
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/* ── Hero Carousel ──────────────────────────── */

function initHeroCarousel() {
  const carousel = $('.hero-carousel');
  if (!carousel) return;

  const slides = $$('.hero-slide', carousel);
  if (slides.length < 2) return;

  let current = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
  }

  function startAutoplay() {
    interval = setInterval(() => goTo(current + 1), 5000);
  }

  // Dots
  const dotsContainer = $('.hero-dots');
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `hero-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      on(dot, 'click', () => {
        clearInterval(interval);
        goTo(i);
        startAutoplay();
        $$('.hero-dot', dotsContainer).forEach((d, di) => d.classList.toggle('active', di === current));
      });
      dotsContainer.appendChild(dot);
    });
  }

  startAutoplay();
}

/* ── Before/After Slider ────────────────────── */

function initBeforeAfterSliders() {
  $$('.before-after').forEach(slider => {
    const afterEl = slider.querySelector('.before-after-after');
    const handle = slider.querySelector('.before-after-handle');
    if (!afterEl || !handle) return;

    // Set initial position
    afterEl.style.clipPath = 'inset(0 50% 0 0)';
    handle.style.left = '50%';

    let dragging = false;

    function setPosition(x) {
      const rect = slider.getBoundingClientRect();
      const percent = Math.min(Math.max(((x - rect.left) / rect.width) * 100, 0), 100);
      afterEl.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      handle.style.left = `${percent}%`;
    }

    on(handle, 'mousedown', (e) => { dragging = true; e.preventDefault(); });
    on(handle, 'touchstart', (e) => { dragging = true; }, { passive: true });

    on(document, 'mousemove', throttle((e) => {
      if (!dragging) return;
      setPosition(e.clientX);
    }));
    on(document, 'touchmove', throttle((e) => {
      if (!dragging) return;
      setPosition(e.touches[0].clientX);
    }), { passive: true });

    on(document, 'mouseup', () => { dragging = false; });
    on(document, 'touchend', () => { dragging = false; });
  });
}

/* ── Testimonial Carousel ───────────────────── */

function initTestimonialCarousel() {
  const carousel = $('.testimonial-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.testimonial-track');
  const cards = $$('.testimonial-card', track);
  const prev = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  if (!track || cards.length < 2) return;

  let current = 0;
  const perView = window.innerWidth > 768 ? 3 : 1;

  function update() {
    track.style.transform = `translateX(-${current * (100 / perView)}%)`;
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current >= cards.length - perView;
  }

  on(prev, 'click', () => { if (current > 0) { current--; update(); } });
  on(next, 'click', () => { if (current < cards.length - perView) { current++; update(); } });

  update();
}

/* ── Reading Progress Bar ───────────────────── */

function initReadingProgress() {
  const bar = $('.progress-bar');
  if (!bar) return;

  on(window, 'scroll', throttle(() => {
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / docHeight) * 100;
    bar.style.width = `${Math.min(scrolled, 100)}%`;
  }));
}

/* ── Modal System ───────────────────────────── */

function initModals() {
  // Open
  on(document, 'click', (e) => {
    const trigger = e.target.closest('[data-modal]');
    if (!trigger) return;
    const modal = document.getElementById(trigger.dataset.modal);
    if (!modal) return;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close')?.focus();
  });

  // Close via button or backdrop
  on(document, 'click', (e) => {
    if (e.target.closest('.modal-close') || e.target.classList.contains('modal-overlay')) {
      e.target.closest('.modal-overlay')?.classList.remove('show');
      document.body.style.overflow = '';
    }
  });

  // Close via Escape
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape') {
      $$('.modal-overlay.show').forEach(m => {
        m.classList.remove('show');
        document.body.style.overflow = '';
      });
    }
  });
}

/* ── Accordion ──────────────────────────────── */

function initAccordion() {
  on(document, 'click', (e) => {
    const header = e.target.closest('.accordion-header');
    if (!header) return;

    const item = header.closest('.accordion-item');
    const parent = item?.parentElement;
    if (!item) return;

    // Close siblings
    $$('.accordion-item.active', parent).forEach(sibling => {
      if (sibling !== item) sibling.classList.remove('active');
    });

    item.classList.toggle('active');
  });
}

/* ── Tabs ───────────────────────────────────── */

function initTabs() {
  on(document, 'click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    const tabsContainer = btn.closest('[data-tabs]') || btn.closest('.tabs-wrapper');
    if (!tabsContainer) return;

    const target = btn.dataset.tab;

    $$('.tab-btn', tabsContainer).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    $$('.tab-panel', tabsContainer).forEach(p => {
      p.classList.toggle('active', p.dataset.panel === target);
    });
  });
}

/* ── Toast Notifications ────────────────────── */

function showToast(message, type = 'success', duration = 4000) {
  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.success}</div>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── Filter Pills (Service/Blog) ────────────── */

function initFilterPills() {
  $$('.filter-pills').forEach(pillGroup => {
    const items = $$('[data-filter-target]');
    on(pillGroup, 'click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;

      $$('.filter-pill', pillGroup).forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ── Real-time Blog Search ──────────────────── */

function initBlogSearch() {
  const searchInput = $('#blog-search');
  if (!searchInput) return;

  const cards = $$('.blog-card');

  on(searchInput, 'input', debounce(() => {
    const query = searchInput.value.toLowerCase().trim();
    let visible = 0;

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const show = !query || text.includes(query);
      card.closest('[data-filter-target]').style.display = show ? '' : 'none';
      if (show) visible++;
    });

    const noResults = $('#no-results');
    if (noResults) noResults.classList.toggle('hidden', visible > 0);
  }, 250));
}

/* ── Init All ───────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initLazyImages();
  initCardTilt();
  initRipple();
  initSmoothScroll();
  initHeroCarousel();
  initBeforeAfterSliders();
  initTestimonialCarousel();
  initReadingProgress();
  initModals();
  initAccordion();
  initTabs();
  initFilterPills();
  initBlogSearch();
});

/* Export utilities for other modules */
window.StylistApp = { $, $$, on, debounce, throttle, showToast };
