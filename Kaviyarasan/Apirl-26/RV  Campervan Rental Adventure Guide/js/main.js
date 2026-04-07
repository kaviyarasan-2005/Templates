/**
 * main.js
 * Core initialization and module loader
 */

// Import modules
import { initNavigation } from './modules/navigation.js';
import { initTheme } from './modules/theme.js';
import { initDirection } from './modules/direction.js';
import { initAnimations } from './modules/animations.js';

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Systems
  initTheme();
  initDirection();
  initNavigation();
  initAnimations();

  // Route-based initialization
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Load modules dynamically based on the page
  if (currentPage.includes('dashboard')) {
    import('./modules/dashboard.js').then(module => {
      module.initDashboard();
    });
  }

  if (currentPage.includes('contact') || currentPage.includes('book')) {
    import('./modules/forms.js').then(module => {
      module.initForms();
    });
  }

  if (document.querySelector('#map')) {
    import('./modules/maps.js').then(module => {
      module.initMap();
    });
  }

  if (document.querySelector('.search-input') || document.querySelector('.filter-grid')) {
    import('./modules/search.js').then(module => {
      module.initSearch();
    });
  }
});

// Utility: Debounce
export function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Utility: Throttle
export function throttle(func, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
