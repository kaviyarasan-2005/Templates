/**
 * Animations Module — Intersection Observer scroll animations, counters, particles
 */
const Animations = (() => {
  'use strict';

  let observer = null;

  /**
   * Initialize scroll-triggered animations using Intersection Observer
   */
  const initScrollAnimations = () => {
    const animatedElements = document.querySelectorAll(
      '.anim-fade-in, .anim-fade-up, .anim-fade-left, .anim-fade-right, .anim-scale-in'
    );

    if (!animatedElements.length) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animatedElements.forEach(el => {
        el.classList.add('in-view');
        el.style.transition = 'none';
      });
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    animatedElements.forEach(el => observer.observe(el));
  };

  /**
   * Animate counter from 0 to target
   */
  const animateCounter = (el, target, duration = 2000) => {
    const start = performance.now();
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  /**
   * Initialize all counter elements
   */
  const initCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count, 10);
            const duration = parseInt(entry.target.dataset.duration || '2000', 10);
            animateCounter(entry.target, target, duration);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => counterObserver.observe(el));
  };

  /**
   * Create floating particle system in a container
   */
  const createParticles = (container, count = 12, type = 'leaf') => {
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle', `particle-${type}`);

      // Randomize position and timing
      const left = Math.random() * 100;
      const size = 8 + Math.random() * 16;
      const duration = 8 + Math.random() * 12;
      const delay = Math.random() * duration;
      const opacity = 0.15 + Math.random() * 0.35;

      particle.style.cssText = `
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: -${delay}s;
        opacity: ${opacity};
      `;

      container.appendChild(particle);
    }
  };

  /**
   * Ripple effect on button click
   */
  const initRippleEffect = () => {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      btn.style.setProperty('--ripple-x', `${x}%`);
      btn.style.setProperty('--ripple-y', `${y}%`);
      btn.classList.add('ripple');

      setTimeout(() => btn.classList.remove('ripple'), 600);
    });
  };

  /**
   * 3D tilt effect on hover
   */
  const initTiltEffect = (selector = '.tilt-card') => {
    const cards = document.querySelectorAll(selector);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (0.5 - y) * 10;
        const tiltY = (x - 0.5) * 10;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  };

  /**
   * Before/After image slider
   */
  const initBeforeAfterSlider = (selector = '.ba-slider') => {
    const sliders = document.querySelectorAll(selector);

    sliders.forEach(slider => {
      const handle = slider.querySelector('.ba-handle');
      const afterWrap = slider.querySelector('.ba-after');
      let isDragging = false;

      const updatePosition = (x) => {
        const rect = slider.getBoundingClientRect();
        let percentage = ((x - rect.left) / rect.width) * 100;
        percentage = Math.max(0, Math.min(100, percentage));

        handle.style.left = `${percentage}%`;
        afterWrap.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      };

      // Mouse events
      handle.addEventListener('mousedown', () => { isDragging = true; });
      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          e.preventDefault();
          updatePosition(e.clientX);
        }
      });
      document.addEventListener('mouseup', () => { isDragging = false; });

      // Touch events
      handle.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
      document.addEventListener('touchmove', (e) => {
        if (isDragging) {
          updatePosition(e.touches[0].clientX);
        }
      }, { passive: true });
      document.addEventListener('touchend', () => { isDragging = false; });

      // Initialize at 50%
      afterWrap.style.clipPath = 'inset(0 0 0 50%)';
      handle.style.left = '50%';
    });
  };

  /**
   * Smooth progress bar fill on scroll
   */
  const initProgressBars = () => {
    const bars = document.querySelectorAll('[data-progress]');
    if (!bars.length) return;

    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target.dataset.progress;
            entry.target.style.width = `${target}%`;
            progressObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    bars.forEach(el => progressObserver.observe(el));
  };

  /**
   * Initialize all animation systems
   */
  const init = () => {
    initScrollAnimations();
    initCounters();
    initRippleEffect();
    initProgressBars();
  };

  /**
   * Cleanup
   */
  const destroy = () => {
    if (observer) observer.disconnect();
  };

  return {
    init,
    destroy,
    animateCounter,
    createParticles,
    initTiltEffect,
    initBeforeAfterSlider,
    initScrollAnimations,
    initCounters,
    initRippleEffect,
    initProgressBars
  };
})();
