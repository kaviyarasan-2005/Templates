/* ============================================
   ANIMATIONS.JS — Scroll & Intersection Observer
   ============================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initParallax();
    initStaggerChildren();
    initImageLazyLoad();
  });

  /* ---- Scroll Reveal via IntersectionObserver ---- */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  /* ---- Stagger children animation ---- */
  function initStaggerChildren() {
    document.querySelectorAll('[data-stagger]').forEach(container => {
      const children = container.children;
      const delay = parseFloat(container.dataset.stagger) || 0.1;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            Array.from(children).forEach((child, i) => {
              child.style.transitionDelay = `${i * delay}s`;
              child.classList.add('visible');
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      // Prepare children
      Array.from(children).forEach(child => {
        child.classList.add('reveal');
      });

      observer.observe(container);
    });
  }

  /* ---- Subtle parallax on hero bg ---- */
  function initParallax() {
    const heroElements = document.querySelectorAll('.hero__bg');
    if (!heroElements.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          heroElements.forEach(bg => {
            const speed = 0.3;
            bg.style.transform = `translateY(${scrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---- Native lazy loading fallback ---- */
  function initImageLazyLoad() {
    // For browsers that support loading="lazy", this is a no-op.
    // For older browsers, use IntersectionObserver.
    if ('loading' in HTMLImageElement.prototype) return;

    const images = document.querySelectorAll('img[loading="lazy"]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    images.forEach(img => observer.observe(img));
  }

})();
