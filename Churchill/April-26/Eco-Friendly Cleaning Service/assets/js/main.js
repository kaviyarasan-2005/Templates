/**
 * Main Module — Navigation, theme toggle, scroll events, core site functionality
 */
const App = (() => {
  'use strict';

  /* -------------------------------------------------------
     THEME MANAGEMENT
  ------------------------------------------------------- */
  const THEME_KEY = 'eco-clean-theme';

  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    Utils.storage.set(THEME_KEY, theme);

    // Update toggle icon
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      const sunIcon = toggle.querySelector('.icon-sun');
      const moonIcon = toggle.querySelector('.icon-moon');
      if (sunIcon) sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
      if (moonIcon) moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
    }

    Utils.bus.emit('themeChange', theme);
  };

  const toggleTheme = () => {
    const current = document.documentElement.dataset.theme || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  const initTheme = () => {
    const saved = Utils.storage.get(THEME_KEY);
    setTheme(saved || getSystemTheme());

    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.addEventListener('click', toggleTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!Utils.storage.get(THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  };

  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */
  const initNavigation = () => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.nav-hamburger');
    const menu = document.querySelector('.nav-menu');

    if (!navbar) return;

    // Scroll effect — add shadow on scroll
    const handleScroll = Utils.throttle(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, 50);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Hamburger toggle
    if (hamburger && menu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('open');
        document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
      });

      // Close menu when clicking a link (mobile)
      menu.addEventListener('click', (e) => {
        if (e.target.closest('.nav-link') && !e.target.closest('.nav-dropdown-toggle')) {
          hamburger.classList.remove('active');
          menu.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }

    // Dropdowns
    document.addEventListener('click', (e) => {
      const dropdownToggle = e.target.closest('.nav-dropdown-toggle');

      if (dropdownToggle) {
        e.preventDefault();
        const dropdown = dropdownToggle.closest('.nav-dropdown');
        const isOpen = dropdown.classList.contains('open');

        // Close all dropdowns
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));

        if (!isOpen) dropdown.classList.add('open');
        return;
      }

      // Close dropdowns when clicking outside
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });

    // Close dropdowns on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
        if (menu && menu.classList.contains('open')) {
          hamburger.classList.remove('active');
          menu.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });

    // Highlight active page
    highlightActivePage();
  };

  const highlightActivePage = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPage || (currentPage === 'index.html' && href === './'))) {
        link.classList.add('active');
      }
    });
  };

  /* -------------------------------------------------------
     SCROLL PROGRESS BAR
  ------------------------------------------------------- */
  const initScrollProgress = () => {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    const updateProgress = Utils.throttle(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }, 16);

    window.addEventListener('scroll', updateProgress, { passive: true });
  };

  /* -------------------------------------------------------
     SCROLL TO TOP BUTTON
  ------------------------------------------------------- */
  const initScrollToTop = () => {
    const btn = document.querySelector('.scroll-top-btn');
    if (!btn) return;

    const handleVisibility = Utils.throttle(() => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, 100);

    window.addEventListener('scroll', handleVisibility, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  /* -------------------------------------------------------
     ACCORDION
  ------------------------------------------------------- */
  const initAccordions = () => {
    document.addEventListener('click', (e) => {
      const header = e.target.closest('.accordion-header');
      if (!header) return;

      const item = header.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close siblings (for single-open behavior)
      const parent = item.parentElement;
      if (parent && parent.dataset.singleOpen !== undefined) {
        parent.querySelectorAll('.accordion-item.active').forEach(active => {
          if (active !== item) {
            active.classList.remove('active');
            active.querySelector('.accordion-content').style.maxHeight = '0';
          }
        });
      }

      item.classList.toggle('active');
      content.style.maxHeight = isActive ? '0' : `${content.scrollHeight}px`;
    });
  };

  /* -------------------------------------------------------
     TABS
  ------------------------------------------------------- */
  const initTabs = () => {
    document.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.tab-btn');
      if (!tabBtn) return;

      const tabContainer = tabBtn.closest('.tab-container');
      if (!tabContainer) return;

      const target = tabBtn.dataset.tab;

      // Update active button
      tabContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      tabBtn.classList.add('active');

      // Update active panel
      tabContainer.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === target);
      });
    });
  };

  /* -------------------------------------------------------
     MODAL
  ------------------------------------------------------- */
  const openModal = (modalId) => {
    const overlay = document.getElementById(modalId);
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus first focusable element
    const focusable = overlay.querySelector('input, button, [tabindex="0"]');
    if (focusable) focusable.focus();
  };

  const closeModal = (modalId) => {
    const overlay = document.getElementById(modalId);
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  const initModals = () => {
    document.addEventListener('click', (e) => {
      // Open trigger
      const openTrigger = e.target.closest('[data-modal-open]');
      if (openTrigger) openModal(openTrigger.dataset.modalOpen);

      // Close trigger
      const closeTrigger = e.target.closest('[data-modal-close]');
      if (closeTrigger) {
        const modal = closeTrigger.closest('.modal-overlay');
        if (modal) closeModal(modal.id);
      }

      // Click outside modal
      if (e.target.classList.contains('modal-overlay')) {
        closeModal(e.target.id);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
      }
    });
  };

  /* -------------------------------------------------------
     TOAST NOTIFICATIONS
  ------------------------------------------------------- */
  const showToast = (message, type = 'info', duration = 4000) => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>',
      error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
    };

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon" style="color: var(--${type})">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Close notification">✕</button>
    `;

    container.appendChild(toast);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));

    // Auto remove
    if (duration > 0) {
      setTimeout(() => removeToast(toast), duration);
    }
  };

  const removeToast = (toast) => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove());
  };

  /* -------------------------------------------------------
     SKIP TO CONTENT
  ------------------------------------------------------- */
  const initSkipToContent = () => {
    const skip = document.querySelector('.skip-to-content');
    if (skip) {
      skip.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.querySelector('main') || document.querySelector('#main-content');
        if (main) {
          main.tabIndex = -1;
          main.focus();
        }
      });
    }
  };

  /* -------------------------------------------------------
     HOMEPAGE SELECTOR
  ------------------------------------------------------- */
  const HOME_KEY = 'eco-clean-homepage';

  const initHomepageSelector = () => {
    const saved = Utils.storage.get(HOME_KEY, 'general');
    const urlParam = Utils.getParam('home');
    const currentHome = urlParam || saved;

    // If we're on index.html, redirect to the selected homepage
    const page = window.location.pathname.split('/').pop() || 'index.html';
    if (page === 'index.html') {
      const target = currentHome === 'niche' ? 'home-niche.html' : 'home-general.html';
      // Only redirect if not already showing the page
      if (window.location.pathname.indexOf(target) === -1) {
        Utils.storage.set(HOME_KEY, currentHome);
        // Soft redirect: load content or full redirect
        window.location.replace(target);
      }
    }
  };

  const setHomepage = (type) => {
    Utils.storage.set(HOME_KEY, type);
    Utils.setParam('home', type);
    const target = type === 'niche' ? 'home-niche.html' : 'home-general.html';
    window.location.href = target;
  };

  /* -------------------------------------------------------
     INIT
  ------------------------------------------------------- */
  const init = () => {
    initTheme();
    initNavigation();
    initScrollProgress();
    initScrollToTop();
    initAccordions();
    initTabs();
    initModals();
    initSkipToContent();

    // Initialize animation & form modules
    if (typeof Animations !== 'undefined') Animations.init();
    if (typeof Forms !== 'undefined') Forms.init();
    if (typeof I18n !== 'undefined') I18n.init();
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    toggleTheme,
    setTheme,
    openModal,
    closeModal,
    showToast,
    setHomepage,
    initHomepageSelector
  };
})();
