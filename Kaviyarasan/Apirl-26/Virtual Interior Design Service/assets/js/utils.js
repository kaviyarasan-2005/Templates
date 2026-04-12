// utils.js — Helpers: debounce, throttle, formatters

/**
 * Debounce: delays function until after wait ms have elapsed
 * since the last invocation.
 */
function debounce(fn, wait = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Throttle: ensures function is called at most once per limit ms.
 */
function throttle(fn, limit = 100) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Format a number as currency.
 */
function formatCurrency(amount, symbol = '$') {
  return symbol + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0 });
}

/**
 * Format date string to readable format.
 */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Clamp a value between min and max.
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Get value from localStorage with optional fallback.
 */
function getStorage(key, fallback = null) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Set value in localStorage safely.
 */
function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail (e.g. private browsing)
  }
}

/**
 * Generate a simple random ID.
 */
function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
