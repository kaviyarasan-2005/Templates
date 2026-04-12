// animations.js — Scroll-triggered animations and parallax

document.addEventListener('DOMContentLoaded', () => {

  // ---- Intersection Observer for .animate-on-scroll ----
  const observerConfig = { root: null, rootMargin: '0px', threshold: 0.15 };

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Respect staggered delays from CSS classes
        entry.target.classList.add('is-visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, observerConfig);

  document.querySelectorAll('.animate-on-scroll').forEach(el => animObserver.observe(el));

  // ---- Parallax for hero backgrounds ----
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    const handleParallax = () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.4;
        el.style.backgroundPositionY = `calc(50% + ${scrollY * speed}px)`;
      });
    };
    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // ---- Scroll Progress Bar ----
  const progressBar = document.createElement('div');
  progressBar.id = 'scrollProgress';
  Object.assign(progressBar.style, {
    position: 'fixed', top: '0', left: '0', height: '3px',
    background: 'linear-gradient(90deg, var(--color-primary, #0D7377), var(--color-secondary, #D4AF37))',
    width: '0%', zIndex: '9999', transition: 'width 0.1s',
    pointerEvents: 'none'
  });
  document.body.appendChild(progressBar);

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });

  // ---- Number count-up on scroll (for stats sections outside dashboard) ----
  const countUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      const num = parseFloat(text.replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return;

      const prefix = text.match(/^[^0-9]*/)?.[0] || '';
      const suffix = text.match(/[^0-9.]+$/)?.[0] || '';
      const isDecimal = text.includes('.');
      const duration = 1400;
      const start = performance.now();

      const animate = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = eased * num;
        el.textContent = prefix + (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      countUpObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => countUpObserver.observe(el));
});
