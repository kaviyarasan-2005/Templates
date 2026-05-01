/* ============================================
   ART GALLERY — MAIN JS
   Navbar, Theme, RTL, Custom Cursor
   ============================================ */
import { $, $$, storage, throttle } from './utils.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
  initNavbar();
  initTheme();
  initRTL();
  highlightActiveNav();
  initMagnetic();
}

/* ---------- NAVBAR ---------- */
function initNavbar() {
  const navbar = $('.navbar');
  const hamburger = $('.navbar__hamburger');
  const mobileMenu = $('.navbar__mobile-menu');

  if (!navbar) return;

  // Scroll shadow
  window.addEventListener('scroll', throttle(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, 50));

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    $$('.navbar__link', mobileMenu).forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // Dropdown (keyboard accessible)
  $$('.navbar__dropdown').forEach(dd => {
    const trigger = $('.navbar__dropdown-trigger', dd);
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = dd.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Keyboard navigation
    dd.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dd.classList.remove('open');
        trigger.focus();
      }
    });
  });
}

/* ---------- THEME (DARK/LIGHT) ---------- */
function initTheme() {
  const toggle = $('#theme-toggle');
  if (!toggle) return;

  const savedTheme = storage.get('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');

  setTheme(theme);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    storage.set('theme', next);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggle = $('#theme-toggle');
  if (!toggle) return;

  const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  toggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
  toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

/* ---------- RTL / LTR ---------- */
function initRTL() {
  const toggle = $('#rtl-toggle');
  if (!toggle) return;

  const savedDir = storage.get('dir', 'ltr');
  setDirection(savedDir);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'ltr' ? 'rtl' : 'ltr';
    setDirection(next);
    storage.set('dir', next);
  });
}

function setDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');

  // Load Arabic font dynamically
  if (dir === 'rtl') {
    if (!document.querySelector('link[href*="Noto+Sans+Arabic"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }

  const toggles = $$('#rtl-toggle, .rtl-toggle-mobile');
  toggles.forEach(toggle => {
    toggle.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    toggle.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR (English)' : 'Switch to RTL (Arabic)');
  });
}

/* ---------- ACTIVE NAV HIGHLIGHT ---------- */
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.navbar__link, .navbar__dropdown-item').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
      // If in dropdown, also activate parent
      const dropdown = link.closest('.navbar__dropdown');
      if (dropdown) {
        const trigger = dropdown.querySelector('.navbar__dropdown-trigger');
        if (trigger) trigger.classList.add('active');
      }
    }
  });
}

/* ---------- MAGNETIC ELEMENTS ---------- */
function initMagnetic() {
  const magnets = $$('.navbar__logo, .navbar__icon-btn, .btn--primary');
  magnets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - (left + width / 2)) * 0.4;
      const y = (e.clientY - (top + height / 2)) * 0.4;
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.transition = 'none';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.4s var(--ease-spring)';
    });
  });
}

