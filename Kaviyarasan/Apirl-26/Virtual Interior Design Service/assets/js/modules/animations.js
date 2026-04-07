/* VIRTUAL INTERIOR DESIGN — ANIMATIONS MODULE */
'use strict';

const Animations = {
    init() {
        this.initScrollReveal();
        this.initCounters();
        this.initParallax();
        this.initMagneticButtons();
        this.initCardTilt();
        this.initMarquee();
        this.initTextSplit();
        this.initStaggerChildren();
    },

    initScrollReveal() {
        const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur');
        if (!els.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        els.forEach(el => obs.observe(el));
    },

    initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(el => obs.observe(el));
    },

    animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.floor(eased * target);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    },

    initParallax() {
        const els = document.querySelectorAll('[data-parallax]');
        if (!els.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    els.forEach(el => {
                        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
                        const rect = el.getBoundingClientRect();
                        const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
                        el.style.transform = `translateY(${offset * 0.1}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    },

    initMagneticButtons() {
        const btns = document.querySelectorAll('.btn--magnetic');
        btns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    },

    initCardTilt() {
        const cards = document.querySelectorAll('.card--tilt');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(1000px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) scale(1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                card.style.transition = 'transform 0.5s ease';
            });
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    },

    initMarquee() {
        document.querySelectorAll('.marquee').forEach(m => {
            const track = m.querySelector('.marquee__track');
            if (!track) return;
            // Clone for seamless loop
            const clone = track.innerHTML;
            track.innerHTML += clone;
            // Pause on hover
            m.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
            m.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
        });
    },

    initTextSplit() {
        document.querySelectorAll('[data-split]').forEach(el => {
            const text = el.textContent;
            const type = el.getAttribute('data-split'); // 'word' or 'char'
            el.setAttribute('aria-label', text);
            if (type === 'word') {
                el.innerHTML = text.split(' ').map((w, i) =>
                    `<span class="split-word" style="animation-delay:${i * 0.08}s">${w}</span>`
                ).join(' ');
            } else {
                el.innerHTML = text.split('').map((c, i) =>
                    `<span class="split-char" style="animation-delay:${i * 0.03}s">${c === ' ' ? '&nbsp;' : c}</span>`
                ).join('');
            }
        });
    },

    initStaggerChildren() {
        document.querySelectorAll('[data-stagger]').forEach(parent => {
            const delay = parseFloat(parent.getAttribute('data-stagger')) || 0.1;
            Array.from(parent.children).forEach((child, i) => {
                child.style.transitionDelay = (i * delay) + 's';
            });
        });
    }
};
