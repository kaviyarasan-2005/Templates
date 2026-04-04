/* ============================================
   ART GALLERY — ANIMATIONS
   Intersection Observer, Scroll Effects, Lightbox
   ============================================ */
import { $, $$, throttle } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initParallax();
  initHeroSlider();
  initLightbox();
  initAccordion();
  initFilterPills();
  initHorizontalScroll();
});

/* ---------- SCROLL REVEALS ---------- */
function initScrollReveals() {
  const reveals = $$('.reveal, .reveal-left, .reveal-right');
  if (!reveals.length) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  reveals.forEach(el => observer.observe(el));

  // Staggered children
  $$('[data-stagger]').forEach(parent => {
    const children = $$('.stagger-child', parent);
    const parentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 100}ms`;
            child.classList.add('visible');
          });
          parentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    parentObserver.observe(parent);
  });
}

/* ---------- PARALLAX ---------- */
function initParallax() {
  const parallaxEls = $$('[data-parallax]');
  if (!parallaxEls.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', throttle(() => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const offset = (scrollY - el.offsetTop) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, 16));
}

/* ---------- HERO SLIDER ---------- */
function initHeroSlider() {
  const slider = $('.hero-slider');
  if (!slider) return;

  const slides = $$('.hero-slider__slide', slider);
  const dots = $$('.hero-slider__dot', slider);
  let current = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startAutoplay() {
    interval = setInterval(next, 5000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      goTo(i);
      startAutoplay();
    });
  });

  if (slides.length > 1) startAutoplay();
}

/* ---------- LIGHTBOX ---------- */
function initLightbox() {
  const lightbox = $('.lightbox');
  if (!lightbox) return;

  const img = $('.lightbox__img', lightbox);
  const counter = $('.lightbox__counter', lightbox);
  const prevBtn = $('.lightbox__nav--prev', lightbox);
  const nextBtn = $('.lightbox__nav--next', lightbox);
  const closeBtn = $('.lightbox__close', lightbox);

  let items = [];
  let currentIndex = 0;

  // Collect all lightbox triggers
  function refreshItems() {
    items = $$('[data-lightbox]');
    items.forEach((item, i) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(i);
      });
    });
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.classList.add('no-scroll');
    // Focus trap
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  function updateLightbox() {
    const src = items[currentIndex].dataset.lightbox || items[currentIndex].src || items[currentIndex].href;
    img.src = src;
    img.alt = items[currentIndex].alt || 'Artwork';
    if (counter) counter.textContent = `${currentIndex + 1} / ${items.length}`;
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + items.length) % items.length;
    updateLightbox();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Click backdrop to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  });

  refreshItems();
}

/* ---------- ACCORDION ---------- */
function initAccordion() {
  $$('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const content = item.querySelector('.accordion__content');
      const isOpen = item.classList.contains('open');

      // Close siblings (optional: single open)
      const parent = item.parentElement;
      $$('.accordion__item.open', parent).forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          const c = openItem.querySelector('.accordion__content');
          c.style.maxHeight = '0';
          openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      content.style.maxHeight = isOpen ? '0' : content.scrollHeight + 'px';
      trigger.setAttribute('aria-expanded', !isOpen);
    });
  });
}

/* ---------- FILTER PILLS ---------- */
function initFilterPills() {
  $$('.filter-pills').forEach(container => {
    const pills = $$('.filter-pill', container);
    const targetId = container.dataset.target;
    const items = targetId ? $$(`#${targetId} [data-category]`) : [];

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter || 'all';
        items.forEach(item => {
          const show = filter === 'all' || item.dataset.category === filter;
          item.style.display = show ? '' : 'none';
        });

        // Update count if exists
        const countEl = container.querySelector('.filter-count');
        if (countEl) {
          const visible = items.filter(i => i.style.display !== 'none').length;
          countEl.textContent = `${visible} result${visible !== 1 ? 's' : ''}`;
        }
      });
    });
  });
}

/* ---------- HORIZONTAL SCROLL (DRAG) ---------- */
function initHorizontalScroll() {
  $$('.h-scroll').forEach(container => {
    let isDown = false, startX, scrollLeft;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.style.cursor = 'grabbing';
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });
    container.addEventListener('mouseleave', () => { isDown = false; container.style.cursor = 'grab'; });
    container.addEventListener('mouseup', () => { isDown = false; container.style.cursor = 'grab'; });
    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      container.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    container.style.cursor = 'grab';
  });
}
