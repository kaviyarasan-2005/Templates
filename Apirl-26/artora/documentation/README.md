# ARTORA — Documentation
## Art Gallery & Exhibition Space HTML Template

---

## 🎨 Template Overview

**Artora** is a premium HTML template for art galleries, museums, exhibition spaces, private collectors, and cultural institutions. Built with pure HTML5, CSS3 and Vanilla JavaScript — no frameworks, no jQuery.

**Template Name Options:** Artora / GalleryPro / Exhibitio

---

## 📁 File Structure

```
artora-template/
├── index.html              ← Home v1 (Contemporary Gallery)
├── home-2.html             ← Home v2 (Museum/Institutional)
├── about.html              ← About the Gallery
├── exhibitions.html        ← Exhibitions listing (filterable)
├── exhibition-single.html  ← Exhibition detail
├── artists.html            ← Artist directory
├── artist-single.html      ← Artist profile
├── artworks.html           ← Collection / Shop
├── artwork-single.html     ← Artwork detail
├── visit.html              ← Plan Your Visit
├── blog.html               ← Journal / News
├── blog-single.html        ← Article page
├── contact.html            ← Contact & Inquiries
├── membership.html         ← Membership tiers
├── 404.html                ← Error page
├── login.html              ← Sign In
├── register.html           ← Create Account
├── coming-soon.html        ← Coming Soon page
├── maintenance.html        ← Maintenance page
│
├── admin/
│   ├── index.html          ← Dashboard overview
│   ├── analytics.html      ← Traffic & analytics
│   ├── exhibitions.html    ← Exhibitions CRUD
│   ├── artworks.html       ← Artwork inventory
│   ├── artists.html        ← Artist management
│   ├── inquiries.html      ← Lead management
│   ├── users.html          ← Member database
│   └── settings.html       ← Site configuration
│
├── user/
│   ├── index.html          ← User dashboard
│   ├── favorites.html      ← Saved artworks
│   ├── tickets.html        ← Booking history
│   └── profile.html        ← Edit profile
│
├── css/
│   ├── base/
│   │   ├── variables.css   ← CSS custom properties (design tokens)
│   │   ├── reset.css       ← Reset & base styles
│   │   └── typography.css  ← Type scale & classes
│   ├── components/
│   │   ├── buttons.css     ← Button variants
│   │   ├── cards.css       ← Card components
│   │   ├── navigation.css  ← Nav, mega menu, drawer, search
│   │   ├── forms.css       ← Form controls
│   │   └── misc.css        ← Lightbox, tooltips, tags, accordions...
│   ├── layouts/
│   │   └── layout.css      ← Container, grid, section, footer
│   ├── pages/
│   │   └── admin.css       ← Admin & user dashboard styles
│   └── main.css            ← Imports all (use this in HTML)
│
├── js/
│   └── main.js             ← All JavaScript modules (ES6)
│
└── assets/
    └── icons/
        └── sprite.svg      ← SVG icon system (40+ icons)
```

---

## 🎨 Design System

### Color Customization
All colors are in `css/base/variables.css`. Change the accent color in one place:

```css
:root {
  --color-accent: #c9a962;      /* Gallery gold — change this */
  --color-primary: #1a1a1a;     /* Deep charcoal */
}
```

### Typography
Two Google Fonts are used:
- **Cormorant Garamond** — Display headings (elegant serif)
- **DM Sans** — Body text (clean sans-serif)

Change fonts in `css/base/variables.css`:
```css
--font-display: 'Cormorant Garamond', Georgia, serif;
--font-body:    'DM Sans', system-ui, sans-serif;
```

### Dark Mode
Dark mode is automatic (respects system preference) and user-toggleable.
Add `data-dark-toggle` to any button to make it a toggle.

---

## ⚙️ JavaScript Modules

All JavaScript is in `js/main.js`. Modules include:

| Module | Description |
|--------|-------------|
| `DarkMode` | Theme toggle with localStorage persistence |
| `Nav` | Sticky nav, hide-on-scroll, hamburger drawer |
| `SearchOverlay` | Full-screen search overlay |
| `HeroSlider` | Ken Burns hero slideshow |
| `Filter` | Category filter tabs for exhibitions/artworks |
| `LazyImages` | IntersectionObserver lazy loading |
| `Lightbox` | Full-screen image lightbox with keyboard nav |
| `Accordion` | Collapsible FAQ accordion |
| `Countdown` | Real-time countdown timer |
| `Charts` | SVG charts (line, bar, pie) — no dependencies |
| `Forms` | Client-side form validation |
| `Toast` | Notification toast messages |
| `ScrollAnimate` | Fade-in on scroll via IntersectionObserver |
| `QuickView` | Artwork quick view modal |
| `Favorites` | Save/unsave artworks with localStorage |

---

## 🔧 Common Customizations

### Adding a Hero Slide
```html
<div class="hero-slide">
  <img src="your-image.jpg" alt="Exhibition name">
</div>
```
Add a corresponding dot:
```html
<div class="hero-dot" role="button" aria-label="Slide 4"></div>
```

### Adding Exhibition Cards
```html
<article class="card card-exhibition" data-category="current">
  <div class="card-exhibition__image">
    <img src="image.jpg" alt="Exhibition Name" loading="lazy">
    <span class="card-exhibition__badge badge-current">Current</span>
  </div>
  <div class="card-exhibition__body">
    <p class="card-exhibition__dates">Jan 01 — Mar 31, 2026</p>
    <h3 class="card-exhibition__title">Exhibition Name</h3>
    <p class="card-exhibition__subtitle">Artist Name</p>
  </div>
</article>
```

### Scroll Animations
Add `data-animate` to any element to fade it in on scroll:
```html
<div data-animate>Content</div>
<div data-animate data-delay="1">Delayed by 0.1s</div>
<div data-animate data-delay="2">Delayed by 0.2s</div>
```

### Countdown Timer
```html
<div data-countdown="2026-09-01T10:00:00">
  <span data-days></span> days
  <span data-hours></span> hours
  <span data-mins></span> mins
  <span data-secs></span> secs
</div>
```

### Filter Tabs
```html
<div class="filter-bar">
  <button class="filter-tab active" data-filter="all">All</button>
  <button class="filter-tab" data-filter="painting">Painting</button>
</div>
<div class="filter-section">
  <div data-category="painting">...</div>
  <div data-category="sculpture">...</div>
</div>
```

---

## 🌙 Dark Mode

The template ships with full dark mode support.

- Automatically applies on first visit based on OS preference
- Saved to `localStorage` on toggle
- Toggle by clicking any `[data-dark-toggle]` element
- Override manually: `document.documentElement.setAttribute('data-theme', 'dark')`

---

## 🌐 RTL Support

RTL (right-to-left) support is built in via `[dir="rtl"]` selectors.

Activate by adding `dir="rtl"` to the `<html>` element:
```html
<html lang="ar" dir="rtl">
```

---

## ♿ Accessibility

- Semantic HTML5 elements throughout
- ARIA labels on interactive elements
- Skip-to-content link at top of every page
- Focus-visible styles
- Keyboard navigation for lightbox, modals, and drawer
- Color contrast meets WCAG 2.1 AA

---

## 🚀 Getting Started

1. Open `index.html` in your browser — no build step required
2. Customize colors in `css/base/variables.css`
3. Replace Unsplash placeholder images with your own
4. Update text content throughout the HTML files
5. For production: minify CSS/JS and optimize images

---

## 📞 Support

For questions or customization support, please use the item support tab on the marketplace where you purchased this template.

---

*Template Version 1.0.0 · Built for ThemeForest · © 2026 Artora Template*
