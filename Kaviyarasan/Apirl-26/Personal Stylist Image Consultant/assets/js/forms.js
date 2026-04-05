/* ============================================================
   FORMS.JS — Validation, Floating Labels, Password Strength
   ============================================================ */
'use strict';

(function () {

  /* ── Password Strength ──────────────────── */
  function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 'weak', label: 'Weak', bars: 1 };
    if (score <= 2) return { level: 'fair', label: 'Fair', bars: 2 };
    if (score <= 3) return { level: 'strong', label: 'Good', bars: 3 };
    return { level: 'strong', label: 'Strong', bars: 4 };
  }

  function initPasswordStrength() {
    document.querySelectorAll('[data-password-strength]').forEach(input => {
      const container = input.closest('.form-group');
      const barsEl = container?.querySelector('.password-strength');
      const labelEl = container?.querySelector('.strength-label');
      if (!barsEl) return;

      const bars = barsEl.querySelectorAll('.strength-bar');

      input.addEventListener('input', () => {
        const result = checkPasswordStrength(input.value);
        bars.forEach((bar, i) => {
          bar.classList.toggle('active', i < result.bars);
          bar.className = `strength-bar ${i < result.bars ? `active ${result.level}` : ''}`;
        });
        if (labelEl) {
          labelEl.textContent = input.value ? result.label : '';
          labelEl.className = `strength-label ${result.level}`;
        }
      });
    });
  }

  /* ── Password Visibility Toggle ─────────── */
  function initPasswordToggle() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.form-password')?.querySelector('input');
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

        // Swap icons
        const eyeIcon = btn.querySelector('.icon-eye');
        const eyeOffIcon = btn.querySelector('.icon-eye-off');
        if (eyeIcon) eyeIcon.style.display = isPassword ? 'none' : 'block';
        if (eyeOffIcon) eyeOffIcon.style.display = isPassword ? 'block' : 'none';
      });
    });
  }

  /* ── Real-time Field Validation ─────────── */
  const validators = {
    required: (val) => val.trim() !== '' ? null : 'This field is required.',
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'Please enter a valid email address.',
    minlength: (val, param) => val.length >= parseInt(param) ? null : `Minimum ${param} characters required.`,
    phone: (val) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val.replace(/\s/g,'')) ? null : 'Please enter a valid phone number.',
  };

  function validateField(input) {
    const rules = input.dataset.validate?.split(',') || [];
    const group = input.closest('.form-group');
    if (!group) return true;

    for (const rule of rules) {
      const [ruleName, param] = rule.trim().split(':');
      const fn = validators[ruleName];
      if (!fn) continue;

      const error = fn(input.value, param);
      if (error) {
        setFieldError(group, input, error);
        return false;
      }
    }

    setFieldValid(group, input);
    return true;
  }

  function setFieldError(group, input, message) {
    group.classList.add('has-error');
    input.classList.add('error');
    let errorEl = group.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'form-error';
      input.insertAdjacentElement('afterend', errorEl);
    }
    errorEl.textContent = message;
  }

  function setFieldValid(group, input) {
    group.classList.remove('has-error');
    input.classList.remove('error');
    const errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.textContent = '';
  }

  function initValidation() {
    // Validate on blur
    document.querySelectorAll('[data-validate]').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group')?.classList.contains('has-error')) {
          validateField(input);
        }
      });
    });

    // Validate all on form submit
    document.querySelectorAll('form[data-validate-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll('[data-validate]');
        let allValid = true;
        inputs.forEach(input => {
          if (!validateField(input)) allValid = false;
        });

        if (allValid) {
          // Submit form or show success
          handleFormSuccess(form);
        }
      });
    });
  }

  function handleFormSuccess(form) {
    const successMsg = form.querySelector('[data-success-msg]');
    if (successMsg) {
      form.style.opacity = '0';
      form.style.transform = 'scale(0.97)';
      form.style.transition = 'all 400ms ease';
      setTimeout(() => {
        form.style.display = 'none';
        successMsg.classList.remove('hidden');
        successMsg.style.animation = 'fadeInUp 600ms ease both';
      }, 400);
    } else {
      // Use toast
      if (window.StylistApp?.showToast) {
        window.StylistApp.showToast('Message sent successfully! We\'ll be in touch soon.', 'success');
      }
      form.reset();
    }
  }

  /* ── Newsletter Form ────────────────────── */
  function initNewsletterForms() {
    document.querySelectorAll('.footer-newsletter-form, .newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input?.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          input?.classList.add('error');
          return;
        }
        input.classList.remove('error');

        // Simulate success
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.textContent = '✓ Subscribed!';
          btn.disabled = true;
        }
        if (window.StylistApp?.showToast) {
          window.StylistApp.showToast('You\'ve been subscribed to our newsletter!', 'success');
        }
        setTimeout(() => {
          input.value = '';
          if (btn) { btn.textContent = 'Subscribe'; btn.disabled = false; }
        }, 3000);
      });
    });
  }

  /* ── Coming Soon Email Capture ──────────── */
  function initComingSoonForm() {
    const form = document.getElementById('notify-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input?.value) return;

      const btn = form.querySelector('button');
      btn.innerHTML = '<span class="spinner"></span> Done!';
      btn.disabled = true;

      setTimeout(() => {
        form.innerHTML = `<p class="success-message reveal" style="color:var(--color-success);font-weight:600;font-size:1.125rem;">
          ✓ You're on the list! We'll notify you at launch.
        </p>`;
      }, 1200);
    });
  }

  /* ── Init ───────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initPasswordStrength();
    initPasswordToggle();
    initValidation();
    initNewsletterForms();
    initComingSoonForm();
  });

})();
