/* VIRTUAL INTERIOR DESIGN — FORMS MODULE */
'use strict';

const Forms = {
    init() {
        this.initFloatingLabels();
        this.initValidation();
        this.initPasswordToggle();
        this.initPasswordStrength();
        this.initSubmitHandler();
        this.initRangeSlider();
        this.initCustomSelect();
    },

    initFloatingLabels() {
        document.querySelectorAll('.form-group__input').forEach(input => {
            // Check initial state
            if (input.value) input.classList.add('has-value');
            input.addEventListener('focus', () => input.classList.add('focused'));
            input.addEventListener('blur', () => {
                input.classList.remove('focused');
                input.classList.toggle('has-value', !!input.value);
            });
        });
    },

    initValidation() {
        document.querySelectorAll('form[data-validate]').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let valid = true;
                form.querySelectorAll('[required]').forEach(field => {
                    if (!this.validateField(field)) valid = false;
                });
                if (valid) this.handleSubmit(form);
            });
            // Real-time validation
            form.querySelectorAll('[required]').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => {
                    if (field.closest('.form-group').classList.contains('form-group--error')) {
                        this.validateField(field);
                    }
                });
            });
        });
    },

    validateField(field) {
        const group = field.closest('.form-group');
        if (!group) return true;
        let valid = true;
        let msg = '';
        const val = field.value.trim();

        if (field.hasAttribute('required') && !val) {
            valid = false; msg = 'This field is required';
        } else if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            valid = false; msg = 'Please enter a valid email';
        } else if (field.type === 'tel' && val && !/^[\d\s\-+()]{7,}$/.test(val)) {
            valid = false; msg = 'Please enter a valid phone number';
        } else if (field.minLength > 0 && val.length < field.minLength) {
            valid = false; msg = `Minimum ${field.minLength} characters required`;
        }

        group.classList.toggle('form-group--error', !valid);
        group.classList.toggle('form-group--success', valid && !!val);
        const errEl = group.querySelector('.form-group__error');
        if (errEl) errEl.textContent = msg;
        return valid;
    },

    initPasswordToggle() {
        document.querySelectorAll('.password-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.closest('.form-group').querySelector('input');
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
                const eyeOpen = btn.querySelector('.eye-open');
                const eyeClosed = btn.querySelector('.eye-closed');
                if (eyeOpen && eyeClosed) {
                    eyeOpen.style.display = isPassword ? 'none' : 'block';
                    eyeClosed.style.display = isPassword ? 'block' : 'none';
                }
            });
        });
    },

    initPasswordStrength() {
        document.querySelectorAll('[data-strength]').forEach(input => {
            const meter = document.querySelector('.strength-meter');
            if (!meter) return;
            input.addEventListener('input', () => {
                const val = input.value;
                let strength = 0;
                if (val.length >= 8) strength++;
                if (/[A-Z]/.test(val)) strength++;
                if (/[0-9]/.test(val)) strength++;
                if (/[^A-Za-z0-9]/.test(val)) strength++;
                const segments = meter.querySelectorAll('.strength-segment');
                const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e'];
                segments.forEach((seg, i) => {
                    seg.style.background = i < strength ? colors[Math.min(strength - 1, 3)] : 'var(--border-color)';
                });
            });
        });
    },

    initRangeSlider() {
        document.querySelectorAll('.range-slider').forEach(slider => {
            const output = document.querySelector(`[data-range-output="${slider.id}"]`);
            if (!output) return;
            const format = slider.getAttribute('data-format') || '';
            const update = () => {
                const val = parseInt(slider.value).toLocaleString();
                output.textContent = format.replace('{value}', val) || val;
                const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
                slider.style.background = `linear-gradient(to right, var(--terracotta) ${pct}%, var(--border-color) ${pct}%)`;
            };
            slider.addEventListener('input', update);
            update();
        });
    },

    initCustomSelect() {
        document.querySelectorAll('.custom-select').forEach(select => {
            select.addEventListener('change', () => {
                select.classList.toggle('has-value', !!select.value);
            });
        });
    },

    handleSubmit(form) {
        const btn = form.querySelector('[type="submit"]');
        if (!btn) return;
        const originalText = btn.innerHTML;
        // Loading state
        btn.disabled = true;
        btn.innerHTML = '<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg> Processing...';
        // Simulate submission
        setTimeout(() => {
            btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg> Success!';
            btn.style.background = 'var(--sage-green)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';
                form.reset();
                form.querySelectorAll('.form-group').forEach(g => {
                    g.classList.remove('form-group--success', 'form-group--error');
                });
            }, 2000);
        }, 1500);
    }
};
