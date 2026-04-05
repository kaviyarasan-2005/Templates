/* ============================================
   INK STUDIO - Form Validation
   ============================================ */

'use strict';

const FormHandler = (() => {
  function init() {
    const forms = document.querySelectorAll('[data-validate]');
    forms.forEach(bindForm);
    initPasswordToggles();
    initFileUploads();
  }

  function bindForm(form) {
    const inputs = form.querySelectorAll('[required], [data-rules]');

    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group')?.classList.contains('error')) {
          validateField(input);
        }
      });
    });

    // Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      inputs.forEach(input => {
        if (!validateField(input)) isValid = false;
      });

      if (isValid) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.classList.add('btn-loading');
          submitBtn.disabled = true;
        }

        // Simulate submission
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
          }

          showToast('Message sent successfully!', 'success');
          form.reset();

          // Clear all error states
          form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
          });
        }, 2000);
      }
    });
  }

  function validateField(input) {
    const group = input.closest('.form-group');
    const errorEl = group?.querySelector('.form-error');
    let isValid = true;
    let message = '';

    // Required
    if (input.required && !input.value.trim()) {
      isValid = false;
      message = 'This field is required';
    }

    // Email
    if (isValid && input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      }
    }

    // Phone
    if (isValid && input.type === 'tel' && input.value) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
      if (!phoneRegex.test(input.value)) {
        isValid = false;
        message = 'Please enter a valid phone number';
      }
    }

    // Min length
    const minLength = input.getAttribute('minlength');
    if (isValid && minLength && input.value.length < parseInt(minLength)) {
      isValid = false;
      message = `Must be at least ${minLength} characters`;
    }

    // Password match
    if (isValid && input.getAttribute('data-match')) {
      const matchInput = document.getElementById(input.getAttribute('data-match'));
      if (matchInput && input.value !== matchInput.value) {
        isValid = false;
        message = 'Passwords do not match';
      }
    }

    // Apply state
    if (group) {
      group.classList.toggle('error', !isValid);
      group.classList.toggle('success', isValid && input.value.trim() !== '');
    }
    if (errorEl) {
      errorEl.textContent = message;
    }

    return isValid;
  }

  function initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling || btn.closest('.input-wrapper')?.querySelector('input');
        if (input) {
          const isPassword = input.type === 'password';
          input.type = isPassword ? 'text' : 'password';
          btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

          // Toggle icon
          const showIcon = btn.querySelector('.icon-show');
          const hideIcon = btn.querySelector('.icon-hide');
          if (showIcon) showIcon.style.display = isPassword ? 'none' : 'block';
          if (hideIcon) hideIcon.style.display = isPassword ? 'block' : 'none';
        }
      });
    });
  }

  function initFileUploads() {
    document.querySelectorAll('.file-upload-area').forEach(area => {
      const input = area.querySelector('input[type="file"]');
      const label = area.querySelector('.file-upload-label');

      if (!input) return;

      // Drag & Drop
      area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.classList.add('drag-over');
      });

      area.addEventListener('dragleave', () => {
        area.classList.remove('drag-over');
      });

      area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
          input.files = e.dataTransfer.files;
          updateFileLabel(input, label);
        }
      });

      input.addEventListener('change', () => updateFileLabel(input, label));
    });
  }

  function updateFileLabel(input, label) {
    if (input.files.length > 0) {
      const names = Array.from(input.files).map(f => f.name).join(', ');
      if (label) label.textContent = names;
    }
  }

  // ---- Toast Notification System ----
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
      error: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
      warning: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>',
      info: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
    };

    toast.innerHTML = `
      <span style="color: var(--color-${type === 'info' ? 'info' : type})">${icons[type] || icons.info}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Expose showToast globally
  window.showToast = showToast;

  return { init, showToast };
})();

document.addEventListener('DOMContentLoaded', FormHandler.init);
