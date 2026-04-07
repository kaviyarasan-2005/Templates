/**
 * animations.js
 * Scroll observers, counters, and progress bar
 */

export function initAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation class
        entry.target.classList.add('animate-fade-in');
        
        // Counter logic if applicable
        if (entry.target.classList.contains('counter')) {
          startCounter(entry.target);
        }

        // Unobserve after animating once
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Select elements to animate
  const staggeredEls = document.querySelectorAll('.stagger');
  staggeredEls.forEach(el => observer.observe(el));

  // Scroll Progress Bar
  const progressBar = document.createElement('div');
  progressBar.classList.add('scroll-progress');
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
}

function startCounter(el) {
  const target = +el.getAttribute('data-target');
  let count = 0;
  const speed = 200; // Lower is faster
  
  const inc = target / speed;

  const updateCount = () => {
    count += inc;
    if (count < target) {
      el.innerText = Math.ceil(count);
      requestAnimationFrame(updateCount);
    } else {
      el.innerText = target;
    }
  };

  updateCount();
}
