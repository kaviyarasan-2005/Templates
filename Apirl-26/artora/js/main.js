/**
 * ARTORA — Main JavaScript
 * Art Gallery & Exhibition Space Template
 * Vanilla ES6+ | No dependencies
 */

'use strict';

/* ============================================================
   UTILS
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
const off = (el, ev, fn) => el && el.removeEventListener(ev, fn);

function debounce(fn, wait = 200) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

function getCookie(name) {
  return document.cookie.split('; ').find(r => r.startsWith(name + '='))?.split('=')[1];
}
function setCookie(name, value, days = 365) {
  const d = new Date(); d.setTime(d.getTime() + days * 864e5);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

/* ============================================================
   DARK MODE
   ============================================================ */
const DarkMode = {
  init() {
    const stored = localStorage.getItem('artora-theme');
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = stored || preferred;
    this.apply(theme);

    $$('[data-dark-toggle]').forEach(btn => {
      on(btn, 'click', () => this.toggle());
      this.syncToggle(btn, theme);
    });
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('artora-theme', theme);
    $$('[data-dark-toggle]').forEach(btn => this.syncToggle(btn, theme));
  },
  toggle() {
    const cur = document.documentElement.getAttribute('data-theme');
    this.apply(cur === 'dark' ? 'light' : 'dark');
  },
  syncToggle(btn, theme) {
    btn.classList.toggle('active', theme === 'dark');
    btn.setAttribute('aria-checked', theme === 'dark');
  }
};

/* ============================================================
   NAVIGATION
   ============================================================ */
const Nav = {
  el: null,
  lastScroll: 0,
  init() {
    this.el = $('.site-nav');
    if (!this.el) return;

    on(window, 'scroll', debounce(() => this.handleScroll(), 10), { passive: true });

    // Hamburger
    const ham = $('.nav-hamburger');
    const drawer = $('.nav-drawer');
    if (ham && drawer) {
      on(ham, 'click', () => this.toggleDrawer(ham, drawer));
      on($('.nav-drawer-backdrop', drawer), 'click', () => this.closeDrawer(ham, drawer));
    }

    // Escape key closes drawer/search
    on(document, 'keydown', e => {
      if (e.key === 'Escape') {
        this.closeDrawer(ham, drawer);
        SearchOverlay.close();
      }
    });
  },
  handleScroll() {
    const cur = window.scrollY;
    this.el.classList.toggle('scrolled', cur > 20);
    this.el.classList.toggle('hidden', cur > this.lastScroll && cur > 100);
    this.lastScroll = cur < 0 ? 0 : cur;
  },
  toggleDrawer(ham, drawer) {
    const open = drawer.classList.toggle('active');
    ham.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
    ham.setAttribute('aria-expanded', open);
  },
  closeDrawer(ham, drawer) {
    if (!drawer) return;
    drawer.classList.remove('active');
    ham?.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/* ============================================================
   SEARCH OVERLAY
   ============================================================ */
const SearchOverlay = {
  el: null,
  init() {
    this.el = $('.search-overlay');
    if (!this.el) return;
    $$('[data-search-open]').forEach(btn => on(btn, 'click', () => this.open()));
    $$('[data-search-close], .search-close').forEach(btn => on(btn, 'click', () => this.close()));
  },
  open() {
    if (!this.el) return;
    this.el.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('input', this.el)?.focus(), 100);
  },
  close() {
    if (!this.el) return;
    this.el.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/* ============================================================
   HERO SLIDER (Ken Burns)
   ============================================================ */
const HeroSlider = {
  slides: [],
  current: 0,
  timer: null,
  init() {
    this.slides = $$('.hero-slide');
    if (this.slides.length < 2) return;
    this.slides[0].classList.add('active');
    this.timer = setInterval(() => this.next(), 5000);

    // Dots
    const dots = $$('.hero-dot');
    dots.forEach((dot, i) => on(dot, 'click', () => this.goTo(i)));
  },
  next() {
    this.goTo((this.current + 1) % this.slides.length);
  },
  prev() {
    this.goTo((this.current - 1 + this.slides.length) % this.slides.length);
  },
  goTo(n) {
    this.slides[this.current].classList.remove('active');
    this.current = n;
    this.slides[this.current].classList.add('active');
    $$('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === n));
  }
};

/* ============================================================
   FILTERS (Exhibition Grid, Artworks)
   ============================================================ */
const Filter = {
  init() {
    $$('.filter-bar').forEach(bar => {
      const tabs = $$('.filter-tab', bar);
      tabs.forEach(tab => {
        on(tab, 'click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const filter = tab.dataset.filter;
          this.apply(filter, bar.closest('.filter-section') || document);
        });
      });
    });
  },
  apply(filter, ctx) {
    const items = $$('[data-category]', ctx);
    items.forEach(item => {
      const match = filter === 'all' || item.dataset.category?.split(',').includes(filter);
      item.style.display = match ? '' : 'none';
      if (match) item.classList.add('filter-enter');
    });
  }
};

/* ============================================================
   LAZY IMAGES
   ============================================================ */
const LazyImages = {
  init() {
    if (!('IntersectionObserver' in window)) {
      $$('img[loading="lazy"]').forEach(img => this.load(img));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          this.load(e.target);
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '200px' });
    $$('img[loading="lazy"]').forEach(img => io.observe(img));
  },
  load(img) {
    if (img.dataset.src) img.src = img.dataset.src;
    img.onload = () => img.classList.add('loaded');
    if (img.complete) img.classList.add('loaded');
  }
};

/* ============================================================
   LIGHTBOX
   ============================================================ */
const Lightbox = {
  el: null,
  images: [],
  current: 0,
  init() {
    this.el = $('.lightbox');
    if (!this.el) return;

    $$('[data-lightbox]').forEach((img, i) => {
      this.images.push({ src: img.dataset.lightbox || img.src, caption: img.dataset.caption || img.alt });
      on(img, 'click', () => this.open(i));
    });

    on($('.lightbox-close', this.el), 'click', () => this.close());
    on($('.lightbox-prev', this.el), 'click', () => this.prev());
    on($('.lightbox-next', this.el), 'click', () => this.next());
    on(this.el, 'click', e => { if (e.target === this.el) this.close(); });
    on(document, 'keydown', e => {
      if (!this.el.classList.contains('active')) return;
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'Escape') this.close();
    });
  },
  open(i) {
    this.current = i;
    this.show();
    this.el.classList.add('active');
    document.body.style.overflow = 'hidden';
  },
  close() {
    this.el.classList.remove('active');
    document.body.style.overflow = '';
  },
  next() { this.current = (this.current + 1) % this.images.length; this.show(); },
  prev() { this.current = (this.current - 1 + this.images.length) % this.images.length; this.show(); },
  show() {
    const img = $('.lightbox-img', this.el);
    const cap = $('.lightbox-caption strong', this.el);
    if (img) img.src = this.images[this.current].src;
    if (cap) cap.textContent = this.images[this.current].caption;
  }
};

/* ============================================================
   ACCORDION
   ============================================================ */
const Accordion = {
  init() {
    $$('.accordion-header').forEach(header => {
      on(header, 'click', () => {
        const item = header.closest('.accordion-item');
        const isOpen = item.classList.contains('active');
        $$('.accordion-item').forEach(i => i.classList.remove('active'));
        if (!isOpen) item.classList.add('active');
      });
    });
  }
};

/* ============================================================
   COUNTDOWN TIMER
   ============================================================ */
const Countdown = {
  init() {
    $$('[data-countdown]').forEach(el => {
      const target = new Date(el.dataset.countdown).getTime();
      this.tick(el, target);
      setInterval(() => this.tick(el, target), 1000);
    });
  },
  tick(el, target) {
    const diff = target - Date.now();
    if (diff < 0) return;
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    const s = Math.floor((diff % 6e4) / 1000);
    const set = (sel, val) => { const e = $(sel, el); if (e) e.textContent = String(val).padStart(2, '0'); };
    set('[data-days]', d); set('[data-hours]', h); set('[data-mins]', m); set('[data-secs]', s);
  }
};

/* ============================================================
   ADMIN CHARTS (SVG)
   ============================================================ */
const Charts = {
  init() {
    this.drawLine();
    this.drawBar();
    this.drawPie();
  },
  drawLine() {
    const el = $('#chart-line');
    if (!el) return;
    const data = [420,380,510,470,590,620,580,710,680,760,820,790];
    const w = el.clientWidth || 600, h = 200;
    const max = Math.max(...data);
    const pts = data.map((v, i) => `${(i / (data.length-1)) * w},${h - (v/max)*h*0.85}`).join(' ');
    const area = `0,${h} ` + pts + ` ${w},${h}`;
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;overflow:visible">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c9a962" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#c9a962" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <polygon points="${area}" fill="url(#lg)"/>
      <polyline points="${pts}" fill="none" stroke="#c9a962" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      ${data.map((v,i) => `<circle cx="${(i/(data.length-1))*w}" cy="${h-(v/max)*h*0.85}" r="4" fill="#c9a962" stroke="var(--color-surface)" stroke-width="2"/>`).join('')}
    </svg>`;
  },
  drawBar() {
    const el = $('#chart-bar');
    if (!el) return;
    const data = [{ label:'Impressionism', val:85 },{ label:'Modern', val:72 },{ label:'Photography', val:63 },{ label:'Sculpture', val:48 },{ label:'Digital', val:55 },{ label:'Abstract', val:78 }];
    const w = el.clientWidth || 500, h = 180;
    const bw = (w / data.length) * 0.55;
    const gap = (w / data.length);
    const max = Math.max(...data.map(d => d.val));
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h+30}" xmlns="http://www.w3.org/2000/svg" style="width:100%">
      ${data.map((d,i) => {
        const bh = (d.val/max)*h*0.9;
        const x = gap*i + (gap-bw)/2;
        return `<rect x="${x}" y="${h-bh}" width="${bw}" height="${bh}" fill="#c9a962" opacity="0.85" rx="1"/>
        <text x="${x+bw/2}" y="${h+20}" text-anchor="middle" font-size="9" fill="var(--text-muted)" font-family="DM Sans,sans-serif">${d.label}</text>`;
      }).join('')}
    </svg>`;
  },
  drawPie() {
    const el = $('#chart-pie');
    if (!el) return;
    const segments = [
      { label:'Website', val:42, color:'#c9a962' },
      { label:'Social', val:28, color:'#1a1a1a' },
      { label:'Email', val:18, color:'#999' },
      { label:'Walk-in', val:12, color:'#e8e3dd' }
    ];
    const total = segments.reduce((a,b) => a+b.val, 0);
    let angle = -Math.PI/2;
    const cx=90, cy=90, r=80;
    const paths = segments.map(s => {
      const a = (s.val/total)*Math.PI*2;
      const x1 = cx+r*Math.cos(angle), y1 = cy+r*Math.sin(angle);
      const x2 = cx+r*Math.cos(angle+a), y2 = cy+r*Math.sin(angle+a);
      const large = a > Math.PI ? 1 : 0;
      const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;
      angle += a;
      return `<path d="${d}" fill="${s.color}" stroke="var(--color-surface)" stroke-width="2"/>`;
    });
    const legend = segments.map((s,i) => `
      <g transform="translate(0,${i*22})">
        <rect width="10" height="10" fill="${s.color}" rx="2"/>
        <text x="16" y="9" font-size="11" fill="var(--text-secondary)" font-family="DM Sans,sans-serif">${s.label} (${s.val}%)</text>
      </g>`);
    el.innerHTML = `<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" style="width:100%">
      ${paths.join('')}
      <circle cx="${cx}" cy="${cy}" r="40" fill="var(--color-surface)"/>
      <text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="22" fill="var(--color-accent)" font-family="Cormorant Garamond,serif">${total}%</text>
      <text x="${cx}" y="${cy+14}" text-anchor="middle" font-size="9" fill="var(--text-muted)" font-family="DM Sans,sans-serif">INQUIRIES</text>
      <g transform="translate(210,40)">${legend.join('')}</g>
    </svg>`;
  }
};

/* ============================================================
   FORM VALIDATION
   ============================================================ */
const Forms = {
  init() {
    $$('form[data-validate]').forEach(form => {
      on(form, 'submit', e => {
        e.preventDefault();
        if (this.validate(form)) this.submit(form);
      });
    });
    // Newsletter inline
    $$('.newsletter-form').forEach(form => {
      on(form, 'submit', e => {
        e.preventDefault();
        Toast.show('Thank you for subscribing!');
        form.reset();
      });
    });
  },
  validate(form) {
    let valid = true;
    $$('[required]', form).forEach(field => {
      const err = field.nextElementSibling;
      if (!field.value.trim()) {
        field.classList.add('error');
        if (err?.classList.contains('form-error')) err.style.display = 'block';
        valid = false;
      } else {
        field.classList.remove('error');
        if (err?.classList.contains('form-error')) err.style.display = 'none';
      }
    });
    return valid;
  },
  submit(form) {
    const btn = $('[type="submit"]', form);
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    setTimeout(() => {
      Toast.show('Message sent successfully!');
      form.reset();
      if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
    }, 1200);
  }
};

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
const Toast = {
  show(msg, dur = 3000) {
    let el = $('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('active');
    clearTimeout(this._t);
    this._t = setTimeout(() => el.classList.remove('active'), dur);
  }
};

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
const ScrollAnimate = {
  init() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    $$('[data-animate]').forEach(el => io.observe(el));
  }
};

/* ============================================================
   ARTWORK QUICK VIEW
   ============================================================ */
const QuickView = {
  init() {
    $$('[data-quick-view]').forEach(btn => {
      on(btn, 'click', e => {
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest('.card-artwork');
        const title = $('.card-artwork__title', card)?.textContent || 'Artwork';
        const artist = $('.card-artwork__artist', card)?.textContent || '';
        const img = $('img', card)?.src || '';
        this.show({ title, artist, img });
      });
    });
  },
  show({ title, artist, img }) {
    let modal = $('#quick-view-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'quick-view-modal';
      modal.className = 'modal';
      modal.innerHTML = `<div class="modal-backdrop"></div>
        <div class="modal-panel">
          <div class="modal-header">
            <h3 class="modal-title" id="qv-title"></h3>
            <button class="btn-ghost" data-close>✕ Close</button>
          </div>
          <div class="modal-body" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5)">
            <img id="qv-img" src="" alt="" style="width:100%;aspect-ratio:3/4;object-fit:cover">
            <div>
              <p class="eyebrow" id="qv-artist"></p>
              <p style="margin-top:var(--space-4)">Inquire about acquiring this work.</p>
              <div style="margin-top:var(--space-5);display:flex;flex-direction:column;gap:var(--space-3)">
                <a href="artwork-single.html" class="btn btn-primary btn-arrow">View Details <svg width="16" height="16"><use href="assets/icons/sprite.svg#icon-arrow-right"/></svg></a>
                <button class="btn btn-outline">Inquire Now</button>
              </div>
            </div>
          </div>
        </div>`;
      document.body.appendChild(modal);
      on($('.modal-backdrop', modal), 'click', () => this.close(modal));
      on($('[data-close]', modal), 'click', () => this.close(modal));
    }
    $('#qv-title').textContent = title;
    $('#qv-artist').textContent = artist;
    $('#qv-img').src = img;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },
  close(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/* ============================================================
   FAVORITES (User wishlist)
   ============================================================ */
const Favorites = {
  items: [],
  init() {
    this.items = JSON.parse(localStorage.getItem('artora-favorites') || '[]');
    $$('[data-favorite]').forEach(btn => {
      const id = btn.dataset.favorite;
      btn.classList.toggle('active', this.items.includes(id));
      on(btn, 'click', () => this.toggle(btn, id));
    });
  },
  toggle(btn, id) {
    if (this.items.includes(id)) {
      this.items = this.items.filter(i => i !== id);
      btn.classList.remove('active');
      Toast.show('Removed from favorites');
    } else {
      this.items.push(id);
      btn.classList.add('active');
      Toast.show('Added to favorites');
    }
    localStorage.setItem('artora-favorites', JSON.stringify(this.items));
  }
};

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-enter');
  DarkMode.init();
  Nav.init();
  SearchOverlay.init();
  HeroSlider.init();
  Filter.init();
  LazyImages.init();
  Lightbox.init();
  Accordion.init();
  Countdown.init();
  Charts.init();
  Forms.init();
  ScrollAnimate.init();
  QuickView.init();
  Favorites.init();
});

/* Export for module use */
export { DarkMode, Nav, Toast, Charts, Filter };
