/* ============================================================
   NAVIGATION.JS — Sticky Nav, Dropdowns, Hamburger Drawer
   ============================================================ */
'use strict';

(function () {

  const nav = document.querySelector('.site-nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.nav-overlay');
  const drawerClose = document.querySelector('.drawer-close');

  /* ── Sticky Nav on Scroll ───────────────── */
  if (nav) {
    function handleScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', () => requestAnimationFrame(handleScroll), { passive: true });
    handleScroll();
  }

  /* ── Mobile Hamburger Drawer ────────────── */
  function openDrawer() {
    hamburger?.classList.add('active');
    drawer?.classList.add('open');
    overlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
    drawer?.querySelector('.drawer-close')?.focus();
  }

  function closeDrawer() {
    hamburger?.classList.remove('active');
    drawer?.classList.remove('open');
    overlay?.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = drawer?.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  drawerClose?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) closeDrawer();
  });

  /* ── Drawer Accordion Sub-menus ─────────── */
  document.querySelectorAll('.drawer-nav-link').forEach(link => {
    const item = link.closest('.drawer-nav-item');
    const sub = item?.querySelector('.drawer-sub');
    if (!sub) return;

    link.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close others
      document.querySelectorAll('.drawer-nav-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Active Nav Link ────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .drawer-nav-link').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href && href === currentPath) link.classList.add('active');
  });

  /* ── Desktop Dropdown keyboard support ─── */
  document.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.nav-dropdown');
    if (!dropdown) return;

    link?.addEventListener('click', (e) => {
      // On touch, toggle dropdown
      if (window.matchMedia('(hover: none)').matches) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });

    // Keyboard
    link?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('open');
        if (item.classList.contains('open')) {
          dropdown.querySelector('a')?.focus();
        }
      }
      if (e.key === 'Escape') {
        item.classList.remove('open');
        link.focus();
      }
    });

    // Close on focus out
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) item.classList.remove('open');
    });
  });

  // Close all dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
    }
  });

})();
