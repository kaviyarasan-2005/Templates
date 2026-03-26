// ===========================
// CloudVault SaaS Platform
// Main JavaScript
// ===========================

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.textContent = currentTheme === 'dark' ? 'LIGHT' : 'DARK';
        
        themeToggle.addEventListener('click', () => {
            const theme = html.getAttribute('data-theme');
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? 'LIGHT' : 'DARK';
        });
    }
}

// RTL Toggle
function initRTLToggle() {
    const rtlToggle = document.querySelector('.rtl-toggle');
    const html = document.documentElement;
    
    const currentDir = localStorage.getItem('direction') || 'ltr';
    html.setAttribute('dir', currentDir);
    
    if (rtlToggle) {
        rtlToggle.textContent = currentDir === 'rtl' ? 'LTR' : 'RTL';
        
        rtlToggle.addEventListener('click', () => {
            const dir = html.getAttribute('dir');
            const newDir = dir === 'rtl' ? 'ltr' : 'rtl';
            
            html.setAttribute('dir', newDir);
            localStorage.setItem('direction', newDir);
            rtlToggle.textContent = newDir === 'rtl' ? 'LTR' : 'RTL';
        });
    }
}

// Mobile Menu
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            toggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
                navLinks.classList.remove('active');
                toggle.textContent = '☰';
            }
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                toggle.textContent = '☰';
            });
        });
    }
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Active Nav Link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index-v2.html' && linkPage === 'index-v2.html')) {
            link.classList.add('active');
        }
    });
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--color-danger)';
                    
                    input.addEventListener('input', () => {
                        input.style.borderColor = '';
                    });
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (isValid) {
                showNotification('Success! Form submitted.', 'success');
                form.reset();
            } else {
                showNotification('Please fill all required fields.', 'error');
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--bg-secondary);
        border: var(--border-width) solid var(--color-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'});
        z-index: 9999;
        font-family: var(--font-heading);
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.875rem;
        letter-spacing: 0.05em;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const elements = document.querySelectorAll('.card, .feature-card, .blog-card, .portfolio-item');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
    
    counters.forEach(counter => {
        const text = counter.textContent;
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        
        if (!isNaN(number)) {
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    counter.textContent = text;
                    clearInterval(timer);
                } else {
                    const formatted = Math.floor(current);
                    counter.textContent = text.replace(number, formatted);
                }
            }, 30);
        }
    });
}

// Password Toggle
function initPasswordToggle() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        const wrapper = input.parentElement;
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.textContent = '👁️';
        toggle.style.cssText = `
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
        `;
        
        wrapper.style.position = 'relative';
        
        toggle.addEventListener('click', () => {
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            toggle.textContent = type === 'password' ? '👁️' : '🙈';
        });
        
        wrapper.appendChild(toggle);
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initRTLToggle();
    initMobileMenu();
    initSmoothScroll();
    setActiveNavLink();
    initFormValidation();
    initScrollAnimations();
    initPasswordToggle();
    
    // Animate counters when visible
    const stats = document.querySelector('.stats');
    if (stats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stats);
    }
});

// Export utilities
window.appUtils = {
    showNotification
};
