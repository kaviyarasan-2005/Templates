/* VIRTUAL INTERIOR DESIGN — NAVIGATION MODULE */
'use strict';

const Navigation = {
    navbar: null,
    mobileToggle: null,
    mobileNav: null,
    lastScroll: 0,

    init() {
        this.navbar = document.querySelector('.navbar');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.mobileNav = document.querySelector('.mobile-nav');
        if (!this.navbar) return;
        this.initScrollBehavior();
        this.initMobileMenu();
        this.initHomeDropdown();
        this.initMegaMenu();
        this.initActiveLink();
    },

    initScrollBehavior() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const y = window.scrollY;
                    if (y > 50) this.navbar.classList.add('scrolled');
                    else this.navbar.classList.remove('scrolled');
                    this.lastScroll = y;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    },

    initMobileMenu() {
        if (!this.mobileToggle || !this.mobileNav) return;
        this.mobileToggle.addEventListener('click', () => {
            const isOpen = this.mobileNav.classList.toggle('open');
            this.mobileToggle.classList.toggle('active');
            this.mobileToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
            // Stagger link animations
            if (isOpen) {
                this.mobileNav.querySelectorAll('.mobile-nav__link').forEach((link, i) => {
                    link.style.transitionDelay = (i * 0.08 + 0.2) + 's';
                });
            }
        });
        // Close on link click
        this.mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
            link.addEventListener('click', () => {
                this.mobileNav.classList.remove('open');
                this.mobileToggle.classList.remove('active');
                this.mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        // Close on Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.mobileNav.classList.contains('open')) {
                this.mobileNav.classList.remove('open');
                this.mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    },

    initHomeDropdown() {
        const dropdown = document.querySelector('.home-dropdown');
        if (!dropdown) return;
        const menu = dropdown.querySelector('.home-dropdown__menu');
        let timeout;
        dropdown.addEventListener('mouseenter', () => { clearTimeout(timeout); menu.classList.add('show'); });
        dropdown.addEventListener('mouseleave', () => { timeout = setTimeout(() => menu.classList.remove('show'), 200); });
        // Keyboard
        dropdown.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); menu.classList.toggle('show'); }
            if (e.key === 'Escape') menu.classList.remove('show');
        });
    },

    initMegaMenu() {
        const trigger = document.querySelector('[data-mega-menu]');
        const megaMenu = document.querySelector('.mega-menu');
        if (!trigger || !megaMenu) return;
        let timeout;
        trigger.addEventListener('mouseenter', () => { clearTimeout(timeout); megaMenu.classList.add('show'); });
        trigger.addEventListener('mouseleave', () => { timeout = setTimeout(() => megaMenu.classList.remove('show'), 300); });
        megaMenu.addEventListener('mouseenter', () => clearTimeout(timeout));
        megaMenu.addEventListener('mouseleave', () => { timeout = setTimeout(() => megaMenu.classList.remove('show'), 200); });
    },

    initActiveLink() {
        const path = window.location.pathname;
        this.navbar.querySelectorAll('.navbar__link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && path.includes(href.replace('../', '').replace('./', ''))) {
                link.classList.add('active');
            }
        });
    }
};
