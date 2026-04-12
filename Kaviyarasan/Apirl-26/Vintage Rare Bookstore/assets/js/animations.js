/**
 * VINTAGE RARE BOOKSTORE — ANIMATIONS.JS
 * Intersection Observer scroll reveals, parallax, 3D tilt, typewriter
 */

'use strict';

/* ===== SCROLL REVEAL (IntersectionObserver) ===== */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ===== PARALLAX EFFECT ===== */
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax') || '0.3');
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = (rect.top + scrollY) * speed - scrollY * speed;
        el.style.transform = `translateY(${offset * 0.2}px)`;
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* ===== HERO PARALLAX ===== */
function initHeroParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.25}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ===== 3D CARD TILT ===== */
function initCardTilt() {
  const cards = document.querySelectorAll('.feature-card[data-tilt]');
  if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ===== TYPEWRITER EFFECT ===== */
function initTypewriter() {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;

  const phrases = el.getAttribute('data-typewriter').split('|');
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let delay = 120;

  function tick() {
    const currentPhrase = phrases[phraseIdx];
    if (deleting) {
      el.textContent = currentPhrase.substring(0, --charIdx);
      delay = 60;
    } else {
      el.textContent = currentPhrase.substring(0, ++charIdx);
      delay = 120;
    }

    if (!deleting && charIdx === currentPhrase.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
}

/* ===== DUST PARTICLES ===== */
function initParticles() {
  const container = document.querySelector('.particles-container');
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (-Math.random() * 15) + 's';
    p.style.width = (2 + Math.random() * 4) + 'px';
    p.style.height = p.style.width;
    p.style.opacity = (0.2 + Math.random() * 0.3).toString();
    container.appendChild(p);
  }
}

/* ===== FALLING PAGES (404 page) ===== */
function initFallingPages() {
  const container = document.querySelector('.falling-pages-container');
  if (!container) return;

  const count = 12;
  for (let i = 0; i < count; i++) {
    const page = document.createElement('div');
    page.className = 'falling-page';
    page.style.left = Math.random() * 100 + '%';
    page.style.animationDuration = (4 + Math.random() * 6) + 's';
    page.style.animationDelay = (-Math.random() * 8) + 's';
    page.style.transform = `rotate(${(Math.random() - 0.5) * 30}deg)`;
    container.appendChild(page);
  }
}

/* ===== BLOG LIVE SEARCH ===== */
function initBlogSearch() {
  const searchInput = document.getElementById('blog-search');
  const cards = document.querySelectorAll('.blog-card');
  if (!searchInput || !cards.length) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    cards.forEach(card => {
      const title = card.querySelector('.card__title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.card__excerpt')?.textContent.toLowerCase() || '';
      const visible = title.includes(query) || excerpt.includes(query) || query === '';
      card.style.display = visible ? '' : 'none';
    });
  });
}

/* ===== CATEGORY FILTER ===== */
function initCategoryFilter() {
  const pills = document.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll('[data-category]');
  if (!pills.length || !items.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      items.forEach(item => {
        const cat = item.getAttribute('data-category') || '';
        const show = filter === 'all' || cat.includes(filter);
        item.style.display = show ? '' : 'none';
        // Re-trigger reveal
        if (show) {
          setTimeout(() => item.classList.add('visible'), 50);
        }
      });
    });
  });
}

/* ===== COUNTDOWN TIMER ===== */
function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  const target = new Date(el.getAttribute('data-date') || '2024-12-31T00:00:00');

  function update() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      el.innerHTML = '<span>Launch!</span>';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    function unit(id, val, label) {
      const unitEl = el.querySelector(`[data-unit="${id}"]`);
      if (unitEl) {
        const numEl = unitEl.querySelector('.countdown-num');
        if (numEl && numEl.textContent !== String(val).padStart(2, '0')) {
          numEl.textContent = String(val).padStart(2, '0');
          numEl.style.animation = 'none';
          requestAnimationFrame(() => { numEl.style.animation = 'countdown-tick 0.3s ease'; });
        }
      }
    }

    unit('days', days, 'Days');
    unit('hours', hours, 'Hours');
    unit('minutes', minutes, 'Minutes');
    unit('seconds', seconds, 'Seconds');
  }

  update();
  setInterval(update, 1000);
}

/* ===== MARQUEE PAUSE ON HOVER ===== */
function initMarquee() {
  const tracks = document.querySelectorAll('.marquee-track');
  // Duplicate content for seamless loop
  tracks.forEach(track => {
    const clone = track.innerHTML;
    track.innerHTML += clone; // duplicate for infinite scroll
  });
}

/* ===== INIT ALL ===== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeroParallax();
  initParallax();
  initCardTilt();
  initTypewriter();
  initParticles();
  initFallingPages();
  initBlogSearch();
  initCategoryFilter();
  initCountdown();
  initMarquee();
});
