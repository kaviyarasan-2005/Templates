/* ============================================
   animations.js
   Scroll reveal, Ken Burns hero effect,
   IntersectionObserver-based animations
   ============================================ */

(function() {
  'use strict';

  // ---- Scroll Reveal via IntersectionObserver ----
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      revealEls.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  }

  // ---- Hero Ken Burns / Slow Zoom Effect ----
  function initHeroKenBurns() {
    const heroImgs = document.querySelectorAll('.hero-ken-burns');
    if (!heroImgs.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    heroImgs.forEach(img => {
      img.style.cssText += `
        animation: kenBurns 18s ease-in-out infinite alternate;
      `;
    });
  }

  // ---- Navbar Scroll Shadow ----
  function initNavScroll() {
    const nav = document.querySelector('.fixed-nav');
    if (!nav) return;

    const handler = () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handler, { passive: true });
    handler();
  }

  // ---- Counter Animation (for stat cards) ----
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target') || el.textContent.replace(/\D/g, ''), 10);
    if (isNaN(target)) return;

    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1500;
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.animate-counter');
    if (!counters.length) return;

    const addedClass = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !addedClass.has(entry.target)) {
          addedClass.add(entry.target);
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  // ---- Smooth hover tilt effect on cards (subtle) ----
  function initCardTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !cards.length) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * 4;
        const tiltY = -(x / rect.width) * 4;
        card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---- Inject Ken Burns keyframes ----
  function injectKeyframes() {
    if (document.getElementById('anim-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'anim-keyframes';
    style.textContent = `
      @keyframes kenBurns {
        0%   { transform: scale(1)    translate(0, 0); }
        50%  { transform: scale(1.05) translate(-1%, -0.5%); }
        100% { transform: scale(1.08) translate(1%, 0.5%); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);
  }

  // ---- Init all ----
  document.addEventListener('DOMContentLoaded', () => {
    injectKeyframes();
    initScrollReveal();
    initHeroKenBurns();
    initNavScroll();
    initCounters();
    initCardTilt();
  });

})();
