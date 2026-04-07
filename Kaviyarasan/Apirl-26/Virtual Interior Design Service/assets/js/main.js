/* VIRTUAL INTERIOR DESIGN — MAIN JS */
'use strict';

const App = {
    modules: {},
    
    init() {
        this.initPreloader();
        this.loadModules();
        this.initReadingProgress();
        this.initCustomCursor();
        this.initSmoothScroll();
        this.initSkipLink();
    },

    initPreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.body.classList.add('loaded');
                setTimeout(() => preloader.remove(), 600);
            }, 1200);
        });
    },

    loadModules() {
        if (typeof Navigation !== 'undefined') Navigation.init();
        if (typeof Theme !== 'undefined') Theme.init();
        if (typeof RTL !== 'undefined') RTL.init();
        if (typeof Animations !== 'undefined') Animations.init();
        if (typeof Forms !== 'undefined') Forms.init();
        if (typeof BeforeAfter !== 'undefined') BeforeAfter.init();
        if (typeof Dashboard !== 'undefined') Dashboard.init();
    },

    initReadingProgress() {
        const bar = document.querySelector('.reading-progress');
        if (!bar) return;
        window.addEventListener('scroll', () => {
            const h = document.documentElement;
            const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
            bar.style.width = pct + '%';
        }, { passive: true });
    },

    initCustomCursor() {
        if (window.matchMedia('(hover: none)').matches) return;
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) return;
        let mx = 0, my = 0, cx = 0, cy = 0;
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursor.classList.add('visible');
        });
        const lerp = (a, b, n) => a + (b - a) * n;
        (function update() {
            cx = lerp(cx, mx, 0.15); cy = lerp(cy, my, 0.15);
            cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
            requestAnimationFrame(update);
        })();
        document.querySelectorAll('a, button, [role="button"], input, textarea, select, .card').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
        document.addEventListener('mousedown', () => cursor.classList.add('click'));
        document.addEventListener('mouseup', () => cursor.classList.remove('click'));
    },

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const id = a.getAttribute('href');
                if (id === '#') return;
                const target = document.querySelector(id);
                if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
            });
        });
    },

    initSkipLink() {
        const skip = document.querySelector('.skip-link');
        if (skip) {
            skip.addEventListener('click', e => {
                e.preventDefault();
                const main = document.querySelector('main') || document.querySelector('#main-content');
                if (main) { main.focus(); main.scrollIntoView({ behavior: 'smooth' }); }
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
