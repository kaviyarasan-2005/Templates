// ===== MAIN.JS =====
document.addEventListener('DOMContentLoaded', () => {
  // === Header Scroll Effect ===
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // === Mobile Menu ===
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    // Mobile dropdown toggle
    mobileMenu.querySelectorAll('.nav-item').forEach(item => {
      const link = item.querySelector('.nav-link');
      const dropdown = item.querySelector('.dropdown');
      if (dropdown && link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          item.classList.toggle('open');
        });
      }
    });
  }

  // === FAQ Accordion ===
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const inner = item.querySelector('.faq-answer-inner');
      const isActive = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-answer').style.maxHeight = '0';
      });
      // Open clicked (if wasn't active)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });

  // === Pricing Toggle ===
  const toggleSwitch = document.querySelector('.toggle-switch');
  if (toggleSwitch) {
    toggleSwitch.addEventListener('click', () => {
      toggleSwitch.classList.toggle('active');
      const labels = document.querySelectorAll('.pricing-toggle span');
      labels.forEach(l => l.classList.toggle('active'));
      // Toggle prices
      document.querySelectorAll('.pricing-price').forEach(price => {
        const monthly = price.dataset.monthly;
        const yearly = price.dataset.yearly;
        if (monthly && yearly) {
          price.innerHTML = toggleSwitch.classList.contains('active')
            ? yearly + '<span>/year</span>'
            : monthly + '<span>/month</span>';
        }
      });
    });
  }

  // === Admin Sidebar Toggle (Mobile) ===
  const adminToggle = document.querySelector('.admin-sidebar-toggle');
  const adminSidebar = document.querySelector('.admin-sidebar');
  if (adminToggle && adminSidebar) {
    adminToggle.addEventListener('click', () => {
      adminSidebar.classList.toggle('open');
    });
  }

  // === Countdown Timer (Coming Soon) ===
  const countdownEl = document.querySelector('.countdown');
  if (countdownEl) {
    const target = new Date();
    target.setDate(target.getDate() + 30);
    function updateCountdown() {
      const now = new Date();
      const diff = target - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const items = countdownEl.querySelectorAll('.countdown-item .number');
      if (items.length === 4) {
        items[0].textContent = String(days).padStart(2, '0');
        items[1].textContent = String(hours).padStart(2, '0');
        items[2].textContent = String(minutes).padStart(2, '0');
        items[3].textContent = String(seconds).padStart(2, '0');
      }
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // === Form Submission (prevent default) ===
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Sent!';
        btn.style.background = '#16a34a';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
      }
    });
  });
});