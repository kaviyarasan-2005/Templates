/**
 * i18n Module — Simplified for RTL/LTR toggle only
 */
const I18n = (() => {
  'use strict';

  const STORAGE_KEY = 'eco-clean-dir';
  let currentDir = 'ltr';

  /**
   * Get current direction
   */
  const getDir = () => currentDir;

  /**
   * Set direction (rtl or ltr)
   */
  const setDir = (dir) => {
    currentDir = dir;
    
    // Update HTML attributes
    document.documentElement.lang = 'en'; // Keep English
    document.documentElement.dir = dir;
    
    // Load/unload RTL stylesheet
    const rtlLink = document.getElementById('rtl-stylesheet');
    if (dir === 'rtl') {
      if (!rtlLink) {
        const link = document.createElement('link');
        link.id = 'rtl-stylesheet';
        link.rel = 'stylesheet';
        link.href = 'assets/css/rtl.css';
        document.head.appendChild(link);
      }
    } else {
      if (rtlLink) rtlLink.remove();
    }
    
    // Persist
    Utils.storage.set(STORAGE_KEY, dir);
    
    // Emit event
    Utils.bus.emit('dirChange', dir);
  };

  /**
   * Toggle between RTL and LTR
   */
  const toggleDir = () => {
    setDir(currentDir === 'ltr' ? 'rtl' : 'ltr');
  };

  /**
   * Initialize i18n system
   */
  const init = () => {
    // Load saved preference
    const saved = Utils.storage.get(STORAGE_KEY, 'ltr');
    setDir(saved);

    // Bind click to the globe icon
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('#dir-toggle');
      if (toggleBtn) {
        e.preventDefault();
        toggleDir();
      }
    });
  };

  // We expose setLang and getLang as aliases just in case other modules depend on them
  return { init, setDir, toggleDir, getDir, setLang: setDir, getLang: getDir, t: (k)=>k };
})();
