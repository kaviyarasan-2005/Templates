/**
 * Renovo - Main JavaScript
 * main.js
 */

/* ============ THEME TOGGLE ============ */
(function initTheme() {
  const saved = localStorage.getItem('Renovo-theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = saved || preferred;
  document.documentElement.setAttribute('data-theme', theme);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('Renovo-theme', next);
  updateThemeIcon();
}

function updateThemeIcon() {
  const theme = document.documentElement.getAttribute('data-theme');
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) { icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon'; }
  });
}

/* ============ RTL TOGGLE ============ */
(function initRTL() {
  const saved = localStorage.getItem('Renovo-dir') || 'ltr';
  document.documentElement.setAttribute('dir', saved);
})();

function toggleRTL() {
  const current = document.documentElement.getAttribute('dir');
  const next = current === 'rtl' ? 'ltr' : 'rtl';
  document.documentElement.setAttribute('dir', next);
  localStorage.setItem('Renovo-dir', next);
  updateRTLIcon();
}

function updateRTLIcon() {
    const dir = document.documentElement.getAttribute("dir");
    document.querySelectorAll(".rtl-toggle-btn").forEach(btn => {
      btn.textContent = dir === "rtl" ? "RTL" : "LTR";
      btn.setAttribute("title", dir === "rtl" ? "Switch to LTR" : "Switch to RTL");
      btn.setAttribute("aria-label", dir === "rtl" ? "Switch to LTR" : "Switch to RTL");
    });
  }

/* ============ NAVBAR ============ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // Hamburger
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-overlay');
  const closeBtn = document.querySelector('.mobile-nav-close');

  function openMobileNav() {
    hamburger?.classList.add('open');
    mobileNav?.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openMobileNav);
  closeBtn?.addEventListener('click', closeMobileNav);
  overlay?.addEventListener('click', closeMobileNav);

  // Mobile dropdowns
  document.querySelectorAll('.mobile-nav-link[data-dropdown]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('data-dropdown'));
      target?.classList.toggle('open');
      const icon = link.querySelector('i');
      if (icon) icon.style.transform = target?.classList.contains('open') ? 'rotate(180deg)' : '';
    });
  });

  // Desktop dropdown keyboard
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('open');
      }
      if (e.key === 'Escape') item.classList.remove('open');
    });
  });
}

/* ============ SCROLL REVEAL ============ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ============ COUNTER ANIMATION ============ */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target') || el.textContent, 10);
  const duration = 2000;
  const suffix = el.getAttribute('data-suffix') || '';
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ============ ACCORDION ============ */
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion-item.active').forEach(openItem => {
        openItem.classList.remove('active');
        openItem.querySelector('.accordion-body')?.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('active');
        body?.classList.add('open');
      }
    });
  });
}

/* ============ BLOG FILTER ============ */
function initBlogFilter() {
  const searchInput = document.querySelector('#blog-search');
  const filterBtns = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-category]');
  if (!cards.length) return;

  let activeFilter = 'all';
  let searchTerm = '';

  function filterCards() {
    cards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const text = card.textContent.toLowerCase();
      const matchesFilter = activeFilter === 'all' || category === activeFilter;
      const matchesSearch = !searchTerm || text.includes(searchTerm);
      card.style.display = matchesFilter && matchesSearch ? '' : 'none';
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      filterCards();
    });
  });

  searchInput?.addEventListener('input', e => {
    searchTerm = e.target.value.toLowerCase().trim();
    filterCards();
  });
}

/* ============ FORM VALIDATION ============ */
function initFormValidation() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(field => {
        const group = field.closest('.form-group');
        const error = group?.querySelector('.form-error');
        const value = field.value.trim();

        if (!value) {
          field.classList.add('error');
          error?.classList.add('show');
          valid = false;
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          field.classList.add('error');
          if (error) { error.textContent = 'Please enter a valid email.'; error.classList.add('show'); }
          valid = false;
        } else if (field.type === 'tel' && !/^\+?[\d\s\-()]{7,}$/.test(value)) {
          field.classList.add('error');
          if (error) { error.textContent = 'Please enter a valid phone number.'; error.classList.add('show'); }
          valid = false;
        } else {
          field.classList.remove('error');
          error?.classList.remove('show');
        }
      });

      // Password match
      const pw = form.querySelector('#password');
      const cpw = form.querySelector('#confirm-password');
      if (pw && cpw && pw.value !== cpw.value) {
        cpw.classList.add('error');
        const err = cpw.closest('.form-group')?.querySelector('.form-error');
        if (err) { err.textContent = 'Passwords do not match.'; err.classList.add('show'); }
        valid = false;
      }

      if (valid) {
        const btn = form.querySelector('[type="submit"]');
        if (btn) { btn.textContent = 'Sent! ?'; btn.disabled = true; }
      }
    });

    // Real-time clear errors
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim()) {
          field.classList.remove('error');
          field.closest('.form-group')?.querySelector('.form-error')?.classList.remove('show');
        }
      });
    });
  });
}

/* ============ COUNTDOWN TIMER ============ */
function initCountdown() {
  const el = document.querySelector('#countdown');
  if (!el) return;

  const targetDate = new Date(el.getAttribute('data-target') || '2025-12-31T00:00:00');

  function update() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) { el.innerHTML = '<span>Launching Now!</span>'; return; }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const fmt = n => String(n).padStart(2, '0');
    el.innerHTML = `
      <div class="countdown-unit"><span class="countdown-num">${fmt(d)}</span><span class="countdown-label">Days</span></div>
      <div class="countdown-sep">:</div>
      <div class="countdown-unit"><span class="countdown-num">${fmt(h)}</span><span class="countdown-label">Hours</span></div>
      <div class="countdown-sep">:</div>
      <div class="countdown-unit"><span class="countdown-num">${fmt(m)}</span><span class="countdown-label">Mins</span></div>
      <div class="countdown-sep">:</div>
      <div class="countdown-unit"><span class="countdown-num">${fmt(s)}</span><span class="countdown-label">Secs</span></div>`;
  }

  update();
  setInterval(update, 1000);
}

/* ============ SMOOTH SCROLL ============ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '72', 10);
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });
}

/* ============ LOAD MORE (Blog) ============ */
function initLoadMore() {
  const btn = document.querySelector('#load-more-btn');
  const hiddenCards = document.querySelectorAll('.blog-card.hidden');
  if (!btn || !hiddenCards.length) return;

  btn.addEventListener('click', () => {
    hiddenCards.forEach(card => card.classList.remove('hidden'));
    btn.style.display = 'none';
  });
}

/* ============ INIT ============ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initCounters();
  initAccordion();
  initBlogFilter();
  initFormValidation();
  initCountdown();
  initSmoothScroll();
  initLoadMore();
  updateThemeIcon();
  updateRTLIcon();

  // Bind toggles
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => btn.addEventListener('click', toggleTheme));
  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => btn.addEventListener('click', toggleRTL));
});

