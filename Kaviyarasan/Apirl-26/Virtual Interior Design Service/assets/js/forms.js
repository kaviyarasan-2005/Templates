// forms.js — Contact + Auth form validation and submission

document.addEventListener('DOMContentLoaded', () => {
  // ---- Contact Form ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const validate = (id, checkFn) => {
        const el = document.getElementById(id);
        if (!el) return;
        const ok = checkFn(el.value.trim());
        el.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      };

      validate('name', v => v.length > 1);
      validate('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      validate('subject', v => v !== '');
      validate('message', v => v.length > 5);

      if (!valid) return;

      const btn = contactForm.querySelector('.btn-submit');
      btn.classList.add('loading');
      btn.disabled = true;

      setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;
        contactForm.reset();
        showToast();
      }, 1800);
    });

    // Live validation clearing
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => input.classList.remove('invalid'));
    });
  }

  // ---- Auth Forms ----
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailEl = document.getElementById('loginEmail');
      const passEl = document.getElementById('loginPassword');
      let valid = true;

      if (!emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        emailEl.classList.add('invalid'); valid = false;
      }
      if (!passEl.value.trim() || passEl.value.length < 6) {
        passEl.classList.add('invalid'); valid = false;
      }
      if (!valid) return;

      const btn = loginForm.querySelector('button[type="submit"]');
      btn.textContent = 'Signing in...';
      btn.disabled = true;
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const passEl = document.getElementById('regPassword');
      const confirmEl = document.getElementById('regConfirm');
      if (passEl.value !== confirmEl.value) {
        confirmEl.classList.add('invalid');
        return;
      }
      const btn = registerForm.querySelector('button[type="submit"]');
      btn.textContent = 'Creating Account...';
      btn.disabled = true;
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
    });

    // Password strength indicator
    const passEl = document.getElementById('regPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    if (passEl && strengthBar) {
      passEl.addEventListener('input', () => {
        const val = passEl.value;
        let strength = 0;
        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;
        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['', '#dc3545', '#ffc107', '#17a2b8', '#28a745'];
        strengthBar.style.width = (strength * 25) + '%';
        strengthBar.style.background = colors[strength];
        if (strengthText) strengthText.textContent = labels[strength];
      });
    }
  }
});

function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
