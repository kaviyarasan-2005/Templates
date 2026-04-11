/* ============================================
   forms.js
   Client-side form validation, password
   strength indicator, submission handlers
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // VALIDATION HELPERS
  // ============================================
  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }
  function isPhone(v) {
    return /^[\+]?[0-9\s\-\(\)]{7,20}$/.test(v.trim());
  }
  function isEmpty(v) {
    return v.trim() === '';
  }

  function showError(field, msg) {
    field.classList.add('error');
    const errEl = document.getElementById(field.id + '-error');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('visible');
    }
  }

  function clearError(field) {
    field.classList.remove('error');
    const errEl = document.getElementById(field.id + '-error');
    if (errEl) errEl.classList.remove('visible');
  }

  function clearAllErrors(form) {
    form.querySelectorAll('.form-field').forEach(f => clearError(f));
  }

  // Live validation on blur
  function attachLiveValidation(form) {
    form.querySelectorAll('.form-field').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(field);
      });
    });
  }

  function validateField(field) {
    const type = field.getAttribute('data-validate') || field.type;
    const val  = field.value;

    clearError(field);

    if (field.required && isEmpty(val)) {
      showError(field, field.getAttribute('data-error-required') || 'This field is required.');
      return false;
    }
    if (!isEmpty(val) && type === 'email' && !isEmail(val)) {
      showError(field, 'Please enter a valid email address.');
      return false;
    }
    if (!isEmpty(val) && type === 'tel' && !isPhone(val)) {
      showError(field, 'Please enter a valid phone number.');
      return false;
    }
    if (field.dataset.minLength && val.trim().length < parseInt(field.dataset.minLength)) {
      showError(field, `Minimum ${field.dataset.minLength} characters required.`);
      return false;
    }
    // Confirm password
    if (field.dataset.match) {
      const target = document.getElementById(field.dataset.match);
      if (target && val !== target.value) {
        showError(field, 'Passwords do not match.');
        return false;
      }
    }
    return true;
  }

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('.form-field').forEach(field => {
      if (!validateField(field)) valid = false;
    });
    return valid;
  }

  // ============================================
  // SUBMIT STATE
  // ============================================
  function setSubmitting(btn, state) {
    if (state) {
      btn.dataset.original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      btn.disabled = true;
    } else {
      btn.innerHTML = btn.dataset.original || 'Submit';
      btn.disabled = false;
    }
  }

  // ============================================
  // CONTACT FORM
  // ============================================
  function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    attachLiveValidation(form);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAllErrors(form);
      if (!validateForm(form)) return;

      const btn = form.querySelector('button[type="submit"]');
      setSubmitting(btn, true);

      await new Promise(r => setTimeout(r, 1500));

      setSubmitting(btn, false);
      form.reset();
      if (window.showToast) window.showToast('Your message has been sent. We\'ll be in touch shortly!');
    });
  }

  // ============================================
  // NEWSLETTER FORM
  // ============================================
  function setupNewsletterForms() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]');
        if (!email || !isEmail(email.value)) {
          if (email) { email.classList.add('error'); }
          return;
        }

        const btn = form.querySelector('button[type="submit"]');
        setSubmitting(btn, true);
        await new Promise(r => setTimeout(r, 1200));
        setSubmitting(btn, false);
        email.value = '';
        if (window.showToast) window.showToast('You\'ve been added to the Collector\'s Registry!');
      });
    });
  }

  // ============================================
  // PASSWORD STRENGTH INDICATOR
  // ============================================
  function setupPasswordStrength() {
    const pwInput  = document.getElementById('register-password');
    const barFill  = document.getElementById('strength-fill');
    const strengthLabel = document.getElementById('strength-label');
    if (!pwInput || !barFill) return;

    const levels = [
      { score: 0, text: '',         width: '0%',   color: '#dc3545' },
      { score: 1, text: 'Weak',     width: '25%',  color: '#dc3545' },
      { score: 2, text: 'Fair',     width: '50%',  color: '#f39c12' },
      { score: 3, text: 'Good',     width: '75%',  color: '#27ae60' },
      { score: 4, text: 'Strong',   width: '100%', color: '#1a7a3f' },
    ];

    function scorePassword(val) {
      let score = 0;
      if (val.length >= 8)  score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;
      return Math.min(score, 4);
    }

    pwInput.addEventListener('input', () => {
      const score = scorePassword(pwInput.value);
      const level = levels[score];
      barFill.style.width = level.width;
      barFill.style.backgroundColor = level.color;
      if (strengthLabel) strengthLabel.textContent = level.text;
    });
  }

  // ============================================
  // LOGIN FORM
  // ============================================
  function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    attachLiveValidation(form);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;

      const btn = form.querySelector('button[type="submit"]');
      setSubmitting(btn, true);
      await new Promise(r => setTimeout(r, 1500));
      setSubmitting(btn, false);
      // Demo: show toast
      if (window.showToast) window.showToast('Welcome back, Collector!');
    });
  }

  // ============================================
  // REGISTER FORM
  // ============================================
  function setupRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    attachLiveValidation(form);
    setupPasswordStrength();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;

      const terms = document.getElementById('register-terms');
      if (terms && !terms.checked) {
        if (window.showToast) window.showToast('Please accept Terms & Conditions.');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      setSubmitting(btn, true);
      await new Promise(r => setTimeout(r, 1500));
      setSubmitting(btn, false);
      if (window.showToast) window.showToast('Account created! Welcome to the Collector\'s Registry.');
    });
  }

  // ============================================
  // BOOKING / CONSULTATION FORM
  // ============================================
  function setupBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    attachLiveValidation(form);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;

      const btn = form.querySelector('button[type="submit"]');
      setSubmitting(btn, true);
      await new Promise(r => setTimeout(r, 1500));
      setSubmitting(btn, false);
      form.reset();
      if (window.showToast) window.showToast('Consultation request received! A curator will contact you within 48 hours.');
    });
  }

  // ============================================
  // COMING SOON SUBSCRIPTION
  // ============================================
  function setupComingSoonForm() {
    const form = document.getElementById('coming-soon-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]');
      if (!email || !isEmail(email.value)) {
        if (email) email.classList.add('error');
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      setSubmitting(btn, true);
      await new Promise(r => setTimeout(r, 1200));
      setSubmitting(btn, false);
      email.value = '';
      if (window.showToast) window.showToast('You\'ll be first to know when we open!');
    });
  }

  // ============================================
  // INIT
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    setupContactForm();
    setupNewsletterForms();
    setupLoginForm();
    setupRegisterForm();
    setupBookingForm();
    setupComingSoonForm();
  });

})();
