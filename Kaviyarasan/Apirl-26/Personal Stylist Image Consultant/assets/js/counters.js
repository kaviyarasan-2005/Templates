/* ============================================================
   COUNTERS.JS — Animated Stat Counters (IntersectionObserver)
   ============================================================ */
'use strict';

(function () {

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = parseInt(el.dataset.duration || 2000, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const start = Date.now();
    const startVal = 0;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(startVal + (target - startVal) * easeOut(progress));
      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
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

    counters.forEach(el => {
      // Set initial display
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      el.textContent = prefix + '0' + suffix;
      observer.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', initCounters);

})();
