/**
 * forms.js
 * Multi-step, real-time validation, modals
 */

export function initForms() {
  const forms = document.querySelectorAll('.validate-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        // Pseudo-submit, show success modal or proceed to next step
        const isMulti = form.hasAttribute('data-multi-step');
        if (isMulti) {
          nextStep(form);
        } else {
          showModal('successModal');
        }
      } else {
        form.classList.add('animate-shake');
        setTimeout(() => form.classList.remove('animate-shake'), 800);
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateInput(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateInput(input);
        }
      });
    });
  });

  initModals();
}

function validateInput(input) {
  let isValid = true;
  if (input.required && !input.value.trim()) {
    isValid = false;
  }
  
  if (input.type === 'email' && input.value) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(input.value.trim())) {
      isValid = false;
    }
  }

  if (!isValid) {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
  }

  return isValid;
}

function validateForm(form) {
  let isFormValid = true;
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (!validateInput(input)) {
      isFormValid = false;
    }
  });
  return isFormValid;
}

// Multi-step logic stub
function nextStep(form) {
  const currentStep = form.querySelector('.step.active');
  const nextStep = currentStep.nextElementSibling;
  if (nextStep && nextStep.classList.contains('step')) {
    currentStep.classList.remove('active');
    nextStep.classList.add('active', 'animate-fade-in');
  } else {
    showModal('successModal');
  }
}

// Modals Setup
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const closeBtns = document.querySelectorAll('.modal-close');
  
  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      showModal(modalId);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });
}

function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
  }
}
