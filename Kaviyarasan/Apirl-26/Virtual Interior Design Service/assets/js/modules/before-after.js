/* VIRTUAL INTERIOR DESIGN — BEFORE/AFTER SLIDER */
'use strict';

const BeforeAfter = {
    init() {
        document.querySelectorAll('.ba-slider').forEach(slider => this.setup(slider));
    },

    setup(slider) {
        const handle = slider.querySelector('.ba-slider__handle');
        const before = slider.querySelector('.ba-slider__before');
        if (!handle || !before) return;

        let isDragging = false;

        const updatePosition = (x) => {
            const rect = slider.getBoundingClientRect();
            let pct = ((x - rect.left) / rect.width) * 100;
            pct = Math.max(0, Math.min(100, pct));
            handle.style.left = pct + '%';
            before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        };

        // Mouse events
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) updatePosition(e.clientX);
        });
        document.addEventListener('mouseup', () => isDragging = false);

        // Touch events
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault();
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (isDragging) updatePosition(e.touches[0].clientX);
        }, { passive: true });
        document.addEventListener('touchend', () => isDragging = false);

        // Click to position
        slider.addEventListener('click', (e) => {
            if (e.target === handle) return;
            updatePosition(e.clientX);
        });

        // Keyboard
        handle.setAttribute('tabindex', '0');
        handle.setAttribute('role', 'slider');
        handle.setAttribute('aria-label', 'Before and after comparison');
        handle.addEventListener('keydown', (e) => {
            const rect = slider.getBoundingClientRect();
            const currentLeft = parseFloat(handle.style.left) || 50;
            const step = 2;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                const newPct = Math.max(0, currentLeft - step);
                handle.style.left = newPct + '%';
                before.style.clipPath = `inset(0 ${100 - newPct}% 0 0)`;
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                const newPct = Math.min(100, currentLeft + step);
                handle.style.left = newPct + '%';
                before.style.clipPath = `inset(0 ${100 - newPct}% 0 0)`;
            }
        });
    }
};
