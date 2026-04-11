/* ============================================
   main.js
   Theme toggle, RTL toggle, Navigation,
   Accordion, Testimonial Carousel, Mobile Menu
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // 1. THEME TOGGLE (Light / Dark)
  // ============================================
  function initTheme() {
    const html = document.documentElement;
    const stored = localStorage.getItem('aq-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');

    html.setAttribute('data-theme', theme);
    updateThemeIcons(theme);
  }

  function updateThemeIcons(theme) {
    document.querySelectorAll('.theme-icon').forEach(icon => {
      icon.className = theme === 'dark'
        ? 'theme-icon fa-solid fa-sun'
        : 'theme-icon fa-solid fa-moon';
    });
  }

  function setupThemeToggle() {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const html   = document.documentElement;
        const current = html.getAttribute('data-theme') || 'light';
        const next   = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem('aq-theme', next);
        updateThemeIcons(next);
      });
    });
  }

  // ============================================
  // 2. DIRECTION TOGGLE (LTR / RTL)
  // ============================================
  function initDirection() {
    const stored = localStorage.getItem('aq-dir');
    if (stored) {
      document.documentElement.setAttribute('dir', stored);
    }
  }

  function setupDirectionToggle() {
    document.querySelectorAll('.dir-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const html    = document.documentElement;
        const current = html.getAttribute('dir') || 'ltr';
        const next    = current === 'ltr' ? 'rtl' : 'ltr';
        html.setAttribute('dir', next);
        localStorage.setItem('aq-dir', next);
      });
    });
  }

  // ============================================
  // 3. MOBILE HAMBURGER MENU
  // ============================================
  function setupMobileMenu() {
    const btn  = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', !isOpen);
      btn.querySelector('i').className = isOpen
        ? 'fa-solid fa-bars text-xl'
        : 'fa-solid fa-xmark text-xl';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        if (btn.querySelector('i')) {
          btn.querySelector('i').className = 'fa-solid fa-bars text-xl';
        }
      }
    });
  }

  // ============================================
  // 4. ACTIVE NAV LINK DETECTION
  // ============================================
  function setActiveNavLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const hrefFile = href.split('/').pop();
      if (hrefFile === current ||
          (current === '' && hrefFile === 'home-1.html') ||
          (current === 'index.html' && hrefFile === 'home-1.html')) {
        link.classList.add('active');
      }
    });
  }

  // ============================================
  // 5. ACCORDION
  // ============================================
  function setupAccordions() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const body     = trigger.nextElementSibling;
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        const parent   = trigger.closest('.accordion-container, section');

        // Close others in same container
        if (parent) {
          parent.querySelectorAll('.accordion-trigger[aria-expanded="true"]').forEach(other => {
            if (other !== trigger) {
              other.setAttribute('aria-expanded', 'false');
              const otherBody = other.nextElementSibling;
              if (otherBody) otherBody.classList.remove('open');
            }
          });
        }

        trigger.setAttribute('aria-expanded', !expanded);
        if (body) body.classList.toggle('open', !expanded);
      });
    });
  }

  // ============================================
  // 6. TESTIMONIAL CAROUSEL
  // ============================================
  function setupCarousels() {
    document.querySelectorAll('.testimonial-carousel').forEach(c => {
      const track = c.querySelector('.testimonial-track');
      const dots  = c.querySelectorAll('.testimonial-dot');
      if (!track || !dots.length) return;

      const cards = track.querySelectorAll('.testimonial-card');
      let current = 0;
      let autoTimer;

      function goTo(idx) {
        const count = cards.length;
        current = (idx + count) % count;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
      }

      function startAuto() {
        autoTimer = setInterval(() => goTo(current + 1), 5000);
      }
      function stopAuto() {
        clearInterval(autoTimer);
      }

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
      });

      // Touch / swipe
      let touchStart = 0;
      c.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
      c.addEventListener('touchend', e => {
        const diff = touchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { stopAuto(); goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
      });

      goTo(0);
      startAuto();
    });
  }

  // ============================================
  // 7. PRICING TOGGLE (Monthly / Annual)
  // ============================================
  function setupPricingToggle() {
    const toggle = document.getElementById('pricing-toggle');
    if (!toggle) return;

    const opts       = toggle.querySelectorAll('.toggle-option');
    const monthly    = document.querySelectorAll('.price-monthly');
    const annual     = document.querySelectorAll('.price-annual');
    let mode = 'monthly';

    function update(newMode) {
      mode = newMode;
      opts.forEach(o => o.classList.toggle('active', o.dataset.mode === mode));
      monthly.forEach(el => el.classList.toggle('hidden', mode !== 'monthly'));
      annual.forEach(el  => el.classList.toggle('hidden', mode !== 'annual'));
    }

    opts.forEach(opt => {
      opt.addEventListener('click', () => update(opt.dataset.mode));
    });

    update('monthly');
  }

  // ============================================
  // 8. BLOG / ARTICLE FILTER
  // ============================================
  function setupArticleFilter() {
    const filterBtns = document.querySelectorAll('.article-tag[data-filter]');
    const cards = document.querySelectorAll('.article-card[data-category]');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        cards.forEach(card => {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ============================================
  // 9. DASHBOARD SIDEBAR TOGGLE
  // ============================================
  function setupDashboardSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar       = document.getElementById('dashboard-sidebar');
    const overlay       = document.getElementById('sidebar-overlay');
    if (!sidebarToggle || !sidebar) return;

    function openSidebar() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }
  }

  // ============================================
  // 10. SMOOTH SCROLL TO HASH
  // ============================================
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = parseFloat(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height-desktop')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // ============================================
  // 11. TOAST NOTIFICATIONS
  // ============================================
  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'circle-check' : 'circle-info'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Expose globally for form.js
  window.showToast = showToast;

  // ============================================
  // INIT
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDirection();
    setupThemeToggle();
    setupDirectionToggle();
    setupMobileMenu();
    setActiveNavLink();
    setupAccordions();
    setupCarousels();
    setupPricingToggle();
    setupArticleFilter();
    setupDashboardSidebar();
    setupSmoothScroll();
  });

})();
