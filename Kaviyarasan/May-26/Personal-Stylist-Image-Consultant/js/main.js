/**
 * main.js
 * Site-wide navigation active state, utility helpers,
 * and global init orchestrator.
 */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // SET ACTIVE NAV LINK
  // ----------------------------------------------------------
  function setActiveNavLink() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    // 1. First pass: Handle direct matches and clear all active states
    document.querySelectorAll('.nav-link, .nav-dropdown__item, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.remove('active');

      if (!href || href === '#' || href.startsWith('javascript:')) return;

      const linkFile = href.split('/').pop().split('#')[0] || 'index.html';

      if (
        (filename === 'index.html' || filename === '') && (linkFile === 'index.html' || linkFile === '')
      ) {
        link.classList.add('active');
      } else if (filename === linkFile) {
        link.classList.add('active');
      }
    });

    // 2. Second pass: Highlight parent dropdown triggers if a child is active
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav-dropdown__trigger');
      const menu = dropdown.querySelector('.nav-dropdown__menu');
      if (!trigger || !menu) return;

      const hasActiveChild = menu.querySelector('.active');
      if (hasActiveChild) {
        trigger.classList.add('active');
      }
    });
  }

  // ----------------------------------------------------------
  // NEWSLETTER FORMS (global handler)
  // ----------------------------------------------------------
  function initNewsletterForms() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = this.querySelector('input[type="email"]');
        const msg   = this.querySelector('.newsletter-success');
        if (!input?.value.trim()) {
          input?.classList.add('error', 'shake');
          setTimeout(() => input?.classList.remove('shake'), 600);
          return;
        }
        if (msg) {
          msg.style.display = 'block';
          setTimeout(() => { msg.style.display = 'none'; }, 4000);
        }
        input.value = '';
        input.classList.remove('error');
        input.classList.add('success');
        setTimeout(() => input.classList.remove('success'), 3000);
      });
    });
  }

  // ----------------------------------------------------------
  // COMING SOON COUNTDOWN
  // ----------------------------------------------------------
  function initCountdown() {
    const timer = document.getElementById('countdown-timer');
    if (!timer) return;

    const target = new Date(timer.getAttribute('data-target') || '2026-09-01T00:00:00');

    function update() {
      const now  = new Date();
      const diff = target - now;
      if (diff <= 0) {
        timer.innerHTML = '<span>Launching now!</span>';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000)  / 60000);
      const s = Math.floor((diff % 60000)    / 1000);

      const fmt = n => String(n).padStart(2, '0');

      document.getElementById('cd-days')?.textContent !== undefined
        && (document.getElementById('cd-days').textContent = fmt(d));
      document.getElementById('cd-hours')?.textContent !== undefined
        && (document.getElementById('cd-hours').textContent = fmt(h));
      document.getElementById('cd-mins')?.textContent !== undefined
        && (document.getElementById('cd-mins').textContent = fmt(m));
      document.getElementById('cd-secs')?.textContent !== undefined
        && (document.getElementById('cd-secs').textContent = fmt(s));
    }

    update();
    setInterval(update, 1000);
  }

  // ----------------------------------------------------------
  // PARALLAX EFFECT
  // ----------------------------------------------------------
  function initParallax() {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length || window.innerWidth < 768) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          parallaxEls.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
            const rect  = el.getBoundingClientRect();
            const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
            const img = el.querySelector('img');
            if (img) img.style.transform = `translateY(${offset}px) scale(1.15)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    initNewsletterForms();
    initCountdown();
    initParallax();
  });
})();
