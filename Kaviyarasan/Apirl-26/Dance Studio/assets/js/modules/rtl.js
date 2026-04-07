/* ========================================
   DANCE STUDIO — RTL/LTR Manager
   Language direction switching
   ======================================== */

const RTLManager = (() => {
  const STORAGE_KEY = 'dance-studio-lang';

  const languages = {
    en: { dir: 'ltr', lang: 'en', label: 'English', font: "'Inter', sans-serif" },
    ar: { dir: 'rtl', lang: 'ar', label: 'العربية', font: "'Cairo', sans-serif" },
    he: { dir: 'rtl', lang: 'he', label: 'עברית', font: "'Heebo', sans-serif" }
  };

  let currentLang = 'en';

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    currentLang = saved && languages[saved] ? saved : 'en';
    applyLanguage(currentLang);
    bindEvents();
  }

  function bindEvents() {
    // Language dropdown items
    document.querySelectorAll('[data-lang]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = item.getAttribute('data-lang');
        setLanguage(lang);
      });
    });

    // Globe icon toggle for language dropdown
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = btn.closest('.lang-dropdown');
        if (dropdown) {
          dropdown.classList.toggle('open');
        }
      });
    });

    // Close language dropdown on outside click
    document.addEventListener('click', (e) => {
      document.querySelectorAll('.lang-dropdown.open').forEach(dd => {
        if (!dd.contains(e.target)) {
          dd.classList.remove('open');
        }
      });
    });
  }

  function setLanguage(lang) {
    if (!languages[lang]) return;
    currentLang = lang;
    applyLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);

    // Close dropdown
    document.querySelectorAll('.lang-dropdown.open').forEach(dd => {
      dd.classList.remove('open');
    });
  }

  function applyLanguage(lang) {
    const config = languages[lang];
    document.documentElement.setAttribute('dir', config.dir);
    document.documentElement.setAttribute('lang', config.lang);

    // Update active states in dropdown
    document.querySelectorAll('[data-lang]').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-lang') === lang);
    });

    // Update the display label
    document.querySelectorAll('.lang-current').forEach(el => {
      el.textContent = config.label;
    });
  }

  function getLanguage() {
    return currentLang;
  }

  function getDirection() {
    return languages[currentLang].dir;
  }

  return { init, setLanguage, getLanguage, getDirection };
})();
