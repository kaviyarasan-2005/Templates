/**
 * Forms Module — Validation, multi-step forms, floating labels
 */
const Forms = (() => {
  'use strict';

  const validators = {
    required: (val) => val.trim() !== '' ? null : 'This field is required',
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'Please enter a valid email',
    phone: (val) => /^[\d\s\-+()]{7,20}$/.test(val) ? null : 'Please enter a valid phone number',
    minLength: (min) => (val) => val.length >= min ? null : `Must be at least ${min} characters`,
    maxLength: (max) => (val) => val.length <= max ? null : `Must be no more than ${max} characters`,
    match: (targetId) => (val) => {
      const target = document.getElementById(targetId);
      return target && val === target.value ? null : 'Fields do not match';
    },
    pattern: (regex, msg) => (val) => regex.test(val) ? null : msg
  };

  /**
   * Show error on a form group
   */
  const showError = (input, message) => {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    const errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  };

  /**
   * Clear error from form group
   */
  const clearError = (input) => {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
  };

  /**
   * Validate a single input
   */
  const validateInput = (input) => {
    const rules = input.dataset.validate ? input.dataset.validate.split('|') : [];
    let error = null;

    for (const rule of rules) {
      if (rule === 'required') {
        error = validators.required(input.value);
      } else if (rule === 'email') {
        error = validators.email(input.value);
      } else if (rule === 'phone') {
        error = validators.phone(input.value);
      } else if (rule.startsWith('min:')) {
        error = validators.minLength(parseInt(rule.split(':')[1]))(input.value);
      } else if (rule.startsWith('max:')) {
        error = validators.maxLength(parseInt(rule.split(':')[1]))(input.value);
      } else if (rule.startsWith('match:')) {
        error = validators.match(rule.split(':')[1])(input.value);
      }
      
      if (error) break;
    }

    if (error) {
      showError(input, error);
      return false;
    }

    clearError(input);
    return true;
  };

  /**
   * Validate entire form
   */
  const validateForm = (form) => {
    const inputs = form.querySelectorAll('[data-validate]');
    let isValid = true;

    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });

    return isValid;
  };

  /**
   * Init real-time validation (on input event with debounce)
   */
  const initValidation = (form) => {
    if (!form) return;

    const debouncedValidate = Utils.debounce((input) => {
      if (input.dataset.touched === 'true') {
        validateInput(input);
      }
    }, 300);

    form.addEventListener('input', (e) => {
      const input = e.target;
      if (input.dataset.validate) {
        input.dataset.touched = 'true';
        debouncedValidate(input);
      }
    });

    form.addEventListener('blur', (e) => {
      const input = e.target;
      if (input.dataset.validate) {
        input.dataset.touched = 'true';
        validateInput(input);
      }
    }, true);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        // Emit event for form handler
        Utils.bus.emit('formSubmit', form);
      } else {
        // Shake the first error
        const firstError = form.querySelector('.has-error .form-input');
        if (firstError) {
          firstError.style.animation = 'shake 500ms ease';
          firstError.addEventListener('animationend', () => {
            firstError.style.animation = '';
          }, { once: true });
          firstError.focus();
        }
      }
    });
  };

  /**
   * Multi-step form controller
   */
  const initMultiStep = (container) => {
    if (!container) return;

    const steps = container.querySelectorAll('.step-panel');
    const progressCircles = container.querySelectorAll('.progress-step-circle');
    const progressSteps = container.querySelectorAll('.progress-step');
    let currentStep = 0;

    const showStep = (index) => {
      steps.forEach((step, i) => {
        step.style.display = i === index ? 'block' : 'none';
        if (i === index) step.style.animation = 'fadeInUp 400ms ease';
      });

      progressSteps.forEach((step, i) => {
        step.classList.toggle('active', i === index);
        step.classList.toggle('completed', i < index);
      });

      currentStep = index;
    };

    // Next/prev button handlers
    container.addEventListener('click', (e) => {
      if (e.target.closest('.step-next')) {
        // Validate current step inputs before proceeding
        const currentPanel = steps[currentStep];
        const inputs = currentPanel.querySelectorAll('[data-validate]');
        let valid = true;
        inputs.forEach(input => {
          input.dataset.touched = 'true';
          if (!validateInput(input)) valid = false;
        });

        if (valid && currentStep < steps.length - 1) {
          showStep(currentStep + 1);
        }
      }
      
      if (e.target.closest('.step-prev')) {
        if (currentStep > 0) {
          showStep(currentStep - 1);
        }
      }
    });

    showStep(0);
  };

  /**
   * Password strength checker
   */
  const initPasswordStrength = (input, barContainer) => {
    if (!input || !barContainer) return;

    input.addEventListener('input', () => {
      const val = input.value;
      let strength = 0;

      if (val.length >= 8) strength++;
      if (/[a-z]/.test(val) && /[A-Z]/.test(val)) strength++;
      if (/\d/.test(val)) strength++;
      if (/[^a-zA-Z\d]/.test(val)) strength++;

      barContainer.classList.remove('strength-weak', 'strength-medium', 'strength-strong');

      if (val.length === 0) return;
      if (strength <= 1) barContainer.classList.add('strength-weak');
      else if (strength <= 2) barContainer.classList.add('strength-medium');
      else barContainer.classList.add('strength-strong');
    });
  };

  /**
   * Show/hide password toggle
   */
  const initPasswordToggle = () => {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.password-toggle');
      if (!toggle) return;

      const input = toggle.parentElement.querySelector('input');
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

      // Toggle icon
      const showIcon = toggle.querySelector('.icon-show');
      const hideIcon = toggle.querySelector('.icon-hide');
      if (showIcon) showIcon.style.display = isPassword ? 'none' : 'block';
      if (hideIcon) hideIcon.style.display = isPassword ? 'block' : 'none';
    });
  };

  /**
   * Initialize all form features
   */
  const init = () => {
    // Auto-init all forms with data-validate-form attribute
    document.querySelectorAll('[data-validate-form]').forEach(form => {
      initValidation(form);
    });

    // Auto-init multi-step forms
    document.querySelectorAll('[data-multi-step]').forEach(container => {
      initMultiStep(container);
    });

    // Password toggles
    initPasswordToggle();
  };

  return {
    init,
    initValidation,
    initMultiStep,
    initPasswordStrength,
    initPasswordToggle,
    validateForm,
    validateInput,
    showError,
    clearError
  };
})();
