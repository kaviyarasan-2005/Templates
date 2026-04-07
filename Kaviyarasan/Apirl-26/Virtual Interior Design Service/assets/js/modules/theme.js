/* VIRTUAL INTERIOR DESIGN — THEME MODULE */
'use strict';

const Theme = {
    toggle: null,
    currentTheme: 'light',

    init() {
        this.toggle = document.querySelector('.theme-toggle');
        this.loadSaved();
        this.bindEvents();
    },

    loadSaved() {
        const saved = localStorage.getItem('vid-theme');
        if (saved) {
            this.setTheme(saved);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.setTheme('dark');
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('vid-theme')) this.setTheme(e.matches ? 'dark' : 'light');
        });
    },

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('vid-theme', theme);
        this.updateIcon();
    },

    updateIcon() {
        if (!this.toggle) return;
        const sun = this.toggle.querySelector('.theme-icon-sun');
        const moon = this.toggle.querySelector('.theme-icon-moon');
        if (sun && moon) {
            if (this.currentTheme === 'dark') {
                sun.style.display = 'block';
                moon.style.display = 'none';
            } else {
                sun.style.display = 'none';
                moon.style.display = 'block';
            }
        }
    },

    bindEvents() {
        if (!this.toggle) return;
        this.toggle.addEventListener('click', () => {
            this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
        });
    }
};
