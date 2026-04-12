/**
 * VINTAGE RARE BOOKSTORE — FORMS.JS
 * Client-side form validation, password strength, floating labels
 */

'use strict';

/* ===== VALIDATORS ===== */
const Validators = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  password: (v) => v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v) && /[!@#$%^&*(),.?":{}|<>]/.test(v),
  name: (v) => v.trim().length >= 2,
  phone: (v) => /^[\d\s\-+()]{7,15}$/.test(v.trim()),
  required: (v) => v.trim().length > 0,
  minLength: (v, n) => v.trim().length >= n,
};

/* ===== PASSWORD STRENGTH ===== */
function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  if (score <= 1) return { level: 'weak',   label: 'Weak' };
  if (score <= 2) return { level: 'fair',   label: 'Fair' };
  if (score <= 3) return { level: 'good',   label: 'Good' };
  return { level: 'strong', label: 'Strong' };
}

function updateStrengthBar(input) {
  const bar = input.closest('.form-group')?.querySelector('.pw-strength-fill');
  const label = input.closest('.form-group')?.querySelector('.pw-strength-label');
  if (!bar) return;

  if (!input.value) {
    bar.className = 'pw-strength-fill';
    bar.style.width = '0';
    if (label) label.textContent = '';
    return;
  }

  const { level, label: text } = getPasswordStrength(input.value);
  bar.className = `pw-strength-fill ${level}`;
  if (label) label.textContent = text;
}

/* ===== SHOW/HIDE PASSWORD ===== */
function initPasswordToggle() {
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.setAttribute('aria-label', isText ? 'Show password' : 'Hide password');
      btn.innerHTML = isText
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    });
  });
}

/* ===== SHOW FIELD ERROR ===== */
function showError(input, message) {
  const group = input.closest('.form-group');
  input.classList.add('error');
  input.classList.remove('success');
  input.setAttribute('aria-invalid', 'true');

  let errEl = group?.querySelector('.form-error');
  if (!errEl && group) {
    errEl = document.createElement('p');
    errEl.className = 'form-error';
    errEl.setAttribute('role', 'alert');
    group.appendChild(errEl);
  }
  if (errEl) {
    errEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> ${message}`;
  }
}

/* ===== CLEAR FIELD ERROR ===== */
function clearError(input) {
  const group = input.closest('.form-group');
  input.classList.remove('error');
  input.classList.add('success');
  input.setAttribute('aria-invalid', 'false');
  group?.querySelector('.form-error')?.remove();
}

/* ===== VALIDATE SINGLE FIELD ===== */
function validateField(input) {
  const val = input.value;
  const type = input.getAttribute('data-validate') || input.type;
  const required = input.required;

  if (required && !Validators.required(val)) {
    showError(input, 'This field is required.');
    return false;
  }
  if (!required && !val) { clearError(input); return true; }

  if (type === 'email' && !Validators.email(val)) {
    showError(input, 'Enter a valid email address.');
    return false;
  }
  if (type === 'password' && !Validators.password(val)) {
    showError(input, 'Password must be 8+ characters with uppercase, number, and special character.');
    return false;
  }
  if (input.id === 'confirm-password') {
    const pw = document.getElementById('password')?.value;
    if (val !== pw) { showError(input, 'Passwords do not match.'); return false; }
  }
  if (type === 'tel' && !Validators.phone(val)) {
    showError(input, 'Enter a valid phone number.');
    return false;
  }
  const min = parseInt(input.getAttribute('minlength') || '0', 10);
  if (min && !Validators.minLength(val, min)) {
    showError(input, `Minimum ${min} characters required.`);
    return false;
  }

  clearError(input);
  return true;
}

/* ===== BIND REAL-TIME VALIDATION ===== */
function bindFieldValidation(form) {
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
      // Password strength
      if (field.type === 'password' && field.id !== 'confirm-password') {
        updateStrengthBar(field);
      }
    });
  });
}

/* ===== VALIDATE ENTIRE FORM ===== */
function validateForm(form) {
  const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
  let valid = true;
  fields.forEach(field => {
    if (!validateField(field)) valid = false;
  });
  return valid;
}

/* ===== SHOW SUCCESS STATE ===== */
function showFormSuccess(form, message = 'Message sent successfully!') {
  const existing = form.querySelector('.form-success-msg');
  if (existing) existing.remove();

  const msg = document.createElement('div');
  msg.className = 'form-success-msg';
  msg.setAttribute('role', 'status');
  msg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    ${message}
  `;

  form.insertBefore(msg, form.firstChild);
  form.querySelectorAll('.form-group').forEach(g => (g.style.display = 'none'));
  form.querySelector('.form-submit')?.setAttribute('disabled', 'true');
  form.querySelector('.btn[type="submit"]')?.setAttribute('disabled', 'true');
}

/* ===== CONTACT FORM ===== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  bindFieldValidation(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('[type="submit"]');
    const original = btn?.innerHTML;
    if (btn) {
      btn.innerHTML = '<span class="loader"></span> Sending...';
      btn.disabled = true;
    }

    // Simulate API call
    setTimeout(() => {
      showFormSuccess(form, 'Thank you! We\'ll get back to you within 24 hours.');
    }, 1500);
  });
}

/* ===== LOGIN FORM ===== */
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  bindFieldValidation(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      btn.innerHTML = '<span class="loader"></span> Signing in...';
      btn.disabled = true;
    }

    setTimeout(() => {
      window.location.href = 'dashboard/index.html';
    }, 1500);
  });
}

/* ===== REGISTER FORM ===== */
function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  bindFieldValidation(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      btn.innerHTML = '<span class="loader"></span> Creating Account...';
      btn.disabled = true;
    }

    setTimeout(() => {
      showFormSuccess(form, 'Account created! Redirecting to your dashboard...');
      setTimeout(() => { window.location.href = 'dashboard/index.html'; }, 2000);
    }, 1500);
  });
}

/* ===== NEWSLETTER FORM ===== */
function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !Validators.email(emailInput.value)) {
        showError(emailInput, 'Enter a valid email address.');
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.textContent = 'Subscribed!'; btn.disabled = true; }
      emailInput.value = '';

      setTimeout(() => {
        if (btn) { btn.textContent = 'Subscribe'; btn.disabled = false; }
      }, 3000);
    });
  });
}

/* ===== FLOATING LABELS ===== */
function initFloatingLabels() {
  document.querySelectorAll('.form-group.floating .form-input').forEach(input => {
    // Set initial state
    if (input.value) input.classList.add('filled');
    input.addEventListener('input', () => {
      input.classList.toggle('filled', !!input.value);
    });
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggle();
  initFloatingLabels();
  initContactForm();
  initLoginForm();
  initRegisterForm();
  initNewsletterForms();
});
