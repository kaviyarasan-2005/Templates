/* ============================================
   INK STUDIO - Main JavaScript
   ============================================ */

'use strict';

const InkStudio = (() => {
  // ---- State ----
  const state = {
    scrollY: 0,
    isMobileMenuOpen: false,
    currentLightboxIndex: -1,
    lightboxImages: [],
  };

  // ---- DOM Ready ----
  function init() {
    initNavbar();
    initScrollAnimations();
    initDropdowns();
    initLightbox();
    initAccordions();
    initSmoothScroll();
    initCurrentPageHighlight();
    initCounterAnimations();
    initTestimonialSlider();
    initParallax();
    handleScrollEvents();
  }

  // ---- Navbar ----
  function initNavbar() {
    const toggle = document.querySelector('.navbar-toggle');
    const nav = document.querySelector('.navbar-nav');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        state.isMobileMenuOpen = !state.isMobileMenuOpen;
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = state.isMobileMenuOpen ? 'hidden' : '';

        if (overlay) {
          if (state.isMobileMenuOpen) {
            overlay.style.display = 'block';
            requestAnimationFrame(() => overlay.classList.add('active'));
          } else {
            overlay.classList.remove('active');
            setTimeout(() => { overlay.style.display = 'none'; }, 300);
          }
        }
      });

      if (overlay) {
        overlay.addEventListener('click', () => {
          toggle.click();
        });
      }

      // Handle Book Now button move to mobile menu
      const actions = document.querySelector('.navbar-actions');
      if (actions && nav && !nav.querySelector('.mobile-cta')) {
        const bookNow = actions.querySelector('.btn-primary');
        if (bookNow) {
          const mobileCTA = document.createElement('li');
          mobileCTA.className = 'nav-item mobile-cta';
          mobileCTA.style.display = 'none'; // Only show in mobile CSS
          
          const bookNowClone = bookNow.cloneNode(true);
          // Ensure it's large in the menu
          bookNowClone.classList.remove('btn-sm');
          mobileCTA.appendChild(bookNowClone);
          nav.appendChild(mobileCTA);
        }
      }
    }

    // Navbar scroll shadow
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 10) {
          navbar.classList.add('navbar-scrolled');
        } else {
          navbar.classList.remove('navbar-scrolled');
        }
      }
    }, { passive: true });
  }

  // ---- Dropdowns ----
  function initDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

    dropdownItems.forEach(item => {
      const link = item.querySelector('.nav-link');

      // Desktop hover handled by CSS, but click for mobile
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('open');
          // Close other dropdowns
          dropdownItems.forEach(other => {
            if (other !== item) other.classList.remove('open');
          });
        }
      });
    });

    // Close dropdowns on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item.has-dropdown')) {
        dropdownItems.forEach(item => item.classList.remove('open'));
      }
    });
  }

  // ---- Scroll Animations (Intersection Observer) ----
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll, .animate-fade-up, .animate-fade-down, .animate-fade-left, .animate-fade-right, .animate-scale-in');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      elements.forEach(el => observer.observe(el));
    } else {
      elements.forEach(el => el.classList.add('animated'));
    }
  }

  // ---- Lightbox ----
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    // Gather gallery images
    const galleryItems = document.querySelectorAll('[data-lightbox]');
    state.lightboxImages = Array.from(galleryItems).map(item => ({
      src: item.getAttribute('data-lightbox'),
      alt: item.getAttribute('data-alt') || 'Gallery image'
    }));

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
      item.style.cursor = 'pointer';
    });

    function openLightbox(index) {
      state.currentLightboxIndex = index;
      lightboxImg.src = state.lightboxImages[index].src;
      lightboxImg.alt = state.lightboxImages[index].alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
      state.currentLightboxIndex += direction;
      if (state.currentLightboxIndex < 0) state.currentLightboxIndex = state.lightboxImages.length - 1;
      if (state.currentLightboxIndex >= state.lightboxImages.length) state.currentLightboxIndex = 0;
      lightboxImg.src = state.lightboxImages[state.currentLightboxIndex].src;
      lightboxImg.alt = state.lightboxImages[state.currentLightboxIndex].alt;
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  // ---- Accordions ----
  function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');

        // Close all siblings
        const parent = item.parentElement;
        parent.querySelectorAll('.accordion-item').forEach(sibling => {
          sibling.classList.remove('active');
          const content = sibling.querySelector('.accordion-content');
          if (content) content.style.maxHeight = null;
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
          const content = item.querySelector('.accordion-content');
          if (content) content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  // ---- Smooth Scroll ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 72;
          const top = target.offsetTop - navHeight - 20;
          window.scrollTo({ top, behavior: 'smooth' });

          // Close mobile menu
          if (state.isMobileMenuOpen) {
            document.querySelector('.navbar-toggle')?.click();
          }
        }
      });
    });
  }

  // ---- Current Page Highlight ----
  function initCurrentPageHighlight() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href')?.split('/').pop();
      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });
  }

  // ---- Counter Animations ----
  function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.floor(start + (target - start) * eased);

        el.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }
  }

  // ---- Testimonials Slider ----
  function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;

    const track = slider.querySelector('.testimonial-track');
    const slides = slider.querySelectorAll('.testimonial-card');
    const dots = slider.querySelectorAll('.slider-dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');

    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    let autoPlayTimer;

    function goToSlide(index) {
      currentSlide = index;
      if (currentSlide < 0) currentSlide = slides.length - 1;
      if (currentSlide >= slides.length) currentSlide = 0;

      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function startAutoPlay() {
      autoPlayTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayTimer);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); stopAutoPlay(); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); stopAutoPlay(); startAutoPlay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); stopAutoPlay(); startAutoPlay(); });
    });

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      }
      startAutoPlay();
    }, { passive: true });
  }

  // ---- Parallax ----
  function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    if (parallaxElements.length === 0) return;

    let ticking = false;

    function updateParallax() {
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 0.5;
        const rect = el.parentElement.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const offset = window.scrollY * speed * 0.3;
          el.style.transform = `translateY(${offset}px)`;
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ---- Scroll Events ----
  function handleScrollEvents() {
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }, { passive: true });

      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ---- Public API ----
  return { init };
})();

// Init on DOM ready
document.addEventListener('DOMContentLoaded', InkStudio.init);
