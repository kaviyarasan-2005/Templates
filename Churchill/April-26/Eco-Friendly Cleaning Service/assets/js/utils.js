/**
 * Utils Module — Helper functions, localStorage wrappers, debounce/throttle
 */
const Utils = (() => {
  'use strict';

  /**
   * Debounce function — delays execution until after wait ms have elapsed
   */
  const debounce = (fn, wait = 250) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  };

  /**
   * Throttle function — limits execution to at most once per wait ms
   */
  const throttle = (fn, wait = 100) => {
    let lastTime = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn(...args);
      }
    };
  };

  /**
   * Safe localStorage wrapper
   */
  const storage = {
    get(key, fallback = null) {
      try {
        const val = localStorage.getItem(key);
        return val !== null ? JSON.parse(val) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch { /* ignore */ }
    }
  };

  /**
   * Select single element
   */
  const $ = (selector, parent = document) => parent.querySelector(selector);

  /**
   * Select multiple elements
   */
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  /**
   * Generate unique ID
   */
  const uid = (prefix = 'id') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

  /**
   * Format number with commas
   */
  const formatNumber = (num) => new Intl.NumberFormat().format(num);

  /**
   * Check if element is in viewport
   */
  const isInViewport = (el, threshold = 0) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - threshold) &&
      rect.bottom >= threshold
    );
  };

  /**
   * Smooth scroll to element
   */
  const scrollTo = (target, offset = 0) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  /**
   * Get URL parameter
   */
  const getParam = (key) => new URLSearchParams(window.location.search).get(key);

  /**
   * Set URL parameter without reload
   */
  const setParam = (key, value) => {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.replaceState({}, '', url);
  };

  /**
   * Create element helper
   */
  const createElement = (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, val]) => {
      if (key === 'class') el.className = val;
      else if (key === 'text') el.textContent = val;
      else if (key === 'html') el.innerHTML = val;
      else if (key.startsWith('data-')) el.setAttribute(key, val);
      else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
      else el.setAttribute(key, val);
    });
    children.forEach(child => {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else if (child) el.appendChild(child);
    });
    return el;
  };

  /**
   * Simple event emitter
   */
  class EventBus {
    constructor() { this.events = {}; }
    on(event, fn) { (this.events[event] = this.events[event] || []).push(fn); }
    off(event, fn) { this.events[event] = (this.events[event] || []).filter(f => f !== fn); }
    emit(event, ...args) { (this.events[event] || []).forEach(fn => fn(...args)); }
  }

  const bus = new EventBus();

  return {
    debounce,
    throttle,
    storage,
    $,
    $$,
    uid,
    formatNumber,
    isInViewport,
    scrollTo,
    getParam,
    setParam,
    createElement,
    bus
  };
})();
