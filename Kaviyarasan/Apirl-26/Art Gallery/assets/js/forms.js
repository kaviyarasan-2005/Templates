/* ============================================
   ART GALLERY — FORMS
   Validation, Floating Labels, Submission
   ============================================ */
import { $, $$ } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  initFloatingLabels();
  initFormValidation();
});

/* ---------- FLOATING LABELS ---------- */
function initFloatingLabels() {
  $$('.form-group__input').forEach(input => {
    // Check initial state
    if (input.value) input.classList.add('has-value');

    input.addEventListener('focus', () => input.classList.add('focused'));
    input.addEventListener('blur', () => {
      input.classList.remove('focused');
      input.classList.toggle('has-value', !!input.value);
      validateField(input);
    });
    input.addEventListener('input', () => {
      clearFieldError(input);
    });
  });
}

/* ---------- FORM VALIDATION ---------- */
function initFormValidation() {
  $$('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isValid = validateForm(form);
      if (isValid) {
        showSuccess(form);
      }
    });
  });
}

function validateForm(form) {
  const fields = $$('.form-group__input[required]', form);
  let valid = true;

  fields.forEach(field => {
    if (!validateField(field)) valid = false;
  });

  return valid;
}

function validateField(field) {
  const group = field.closest('.form-group');
  if (!group || !field.hasAttribute('required')) return true;

  const value = field.value.trim();
  const type = field.type || field.tagName.toLowerCase();
  let error = '';

  // Required check
  if (!value) {
    error = 'This field is required';
  }
  // Email check
  else if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error = 'Please enter a valid email address';
  }
  // Phone check
  else if (type === 'tel' && !/^[\+]?[0-9\s\-\(\)]{7,15}$/.test(value)) {
    error = 'Please enter a valid phone number';
  }
  // Min length
  else if (field.minLength > 0 && value.length < field.minLength) {
    error = `Minimum ${field.minLength} characters required`;
  }
  // Password match
  else if (field.dataset.match) {
    const matchField = $(field.dataset.match);
    if (matchField && value !== matchField.value) {
      error = 'Passwords do not match';
    }
  }

  if (error) {
    setFieldError(group, error);
    return false;
  } else {
    setFieldSuccess(group);
    return true;
  }
}

function setFieldError(group, message) {
  group.classList.remove('success');
  group.classList.add('error');
  const errorEl = group.querySelector('.form-group__error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.id = errorEl.id || `error-${Date.now()}`;
    const input = group.querySelector('.form-group__input');
    if (input) input.setAttribute('aria-describedby', errorEl.id);
  }
}

function setFieldSuccess(group) {
  group.classList.remove('error');
  group.classList.add('success');
}

function clearFieldError(field) {
  const group = field.closest('.form-group');
  if (group) {
    group.classList.remove('error');
  }
}

function showSuccess(form) {
  const successMsg = form.querySelector('.form-success');
  if (successMsg) {
    successMsg.style.display = 'flex';
    form.reset();
    $$('.form-group', form).forEach(g => {
      g.classList.remove('success', 'error');
    });
    setTimeout(() => { successMsg.style.display = 'none'; }, 4000);
  } else {
    // Fallback
    const msg = document.createElement('div');
    msg.className = 'form-success-toast';
    msg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Message sent successfully!`;
    msg.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#22c55e;color:#fff;padding:12px 24px;border-radius:8px;display:flex;align-items:center;gap:8px;font-weight:500;z-index:9999;animation:slideInRight 0.3s ease';
    document.body.appendChild(msg);
    form.reset();
    setTimeout(() => msg.remove(), 4000);
  }
}
