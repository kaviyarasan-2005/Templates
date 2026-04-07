/* VIRTUAL INTERIOR DESIGN — RTL MODULE */
'use strict';

const RTL = {
    currentLang: 'en',
    currentDir: 'ltr',
    languages: {
        en: { dir: 'ltr', label: 'English', font: "'Plus Jakarta Sans', sans-serif" },
        ar: { dir: 'rtl', label: 'العربية', font: "'Tajawal', sans-serif" },
        he: { dir: 'rtl', label: 'עברית', font: "'Heebo', sans-serif" },
        es: { dir: 'ltr', label: 'Español', font: "'Plus Jakarta Sans', sans-serif" }
    },

    init() {
        this.loadSaved();
        this.bindEvents();
        this.updateActiveItem();
    },

    loadSaved() {
        const savedLang = localStorage.getItem('vid-lang');
        if (savedLang && this.languages[savedLang]) {
            this.setLanguage(savedLang);
        }
    },

    setLanguage(lang) {
        const config = this.languages[lang];
        if (!config) return;
        this.currentLang = lang;
        this.currentDir = config.dir;
        document.documentElement.setAttribute('dir', config.dir);
        document.documentElement.setAttribute('lang', lang);
        document.body.style.fontFamily = config.font;
        localStorage.setItem('vid-lang', lang);
        this.updateActiveItem();
        // Dispatch event for other modules
        document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang, dir: config.dir } }));
    },

    bindEvents() {
        // Language dropdown toggle
        const dropdown = document.querySelector('.lang-dropdown');
        if (!dropdown) return;
        const trigger = dropdown.querySelector('.lang-dropdown__trigger');
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('open');
            });
        }
        // Language items
        dropdown.querySelectorAll('.lang-dropdown__item').forEach(item => {
            item.addEventListener('click', () => {
                const lang = item.getAttribute('data-lang');
                this.setLanguage(lang);
                dropdown.classList.remove('open');
            });
        });
        // Close on outside click
        document.addEventListener('click', () => dropdown.classList.remove('open'));
        dropdown.addEventListener('click', e => e.stopPropagation());
        // Close on Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') dropdown.classList.remove('open');
        });
    },

    updateActiveItem() {
        document.querySelectorAll('.lang-dropdown__item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-lang') === this.currentLang);
        });
    }
};
