/**
 * direction.js
 * RTL/LTR toggle logic
 */

export function initDirection() {
  const dirToggleBtns = document.querySelectorAll('.dir-toggle');
  
  // Check local storage for preference
  const savedDir = localStorage.getItem('site-direction');
  
  if (savedDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr'); // Default
  }

  // Bind toggle buttons
  dirToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir');
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('site-direction', newDir);
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('directionChanged', { detail: { dir: newDir } }));
    });
  });
}
