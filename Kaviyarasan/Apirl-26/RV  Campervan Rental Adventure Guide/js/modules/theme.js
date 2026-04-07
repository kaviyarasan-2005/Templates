/**
 * theme.js
 * Dark/light mode switcher
 */

export function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('site-theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Only auto-apply dark if no saved preference and system prefers dark, but don't force it universally 
  // since design dictates light defaults usually, EXCEPT for home-digital
  
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    // If specific page requires dark mode by default (like home-digital)
    if (document.body.classList.contains('default-dark')) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  // Bind toggle buttons
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('site-theme', newTheme);
      
      // Optional: Dispatch event for charts/maps to re-render
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    });
  });
}
