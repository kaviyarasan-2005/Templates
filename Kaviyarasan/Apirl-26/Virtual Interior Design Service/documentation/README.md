# Aura — Virtual Interior Design Service Template

## Overview

**Aura** is a premium, fully responsive virtual interior design service website template built with pure **HTML5**, **CSS3** (custom architecture), and **Vanilla JavaScript (ES6+)** — zero frameworks, maximum performance.

---

## 📁 Project Structure

```
virtual-interior-design/
├── index.html                  → Redirect to home-1.html
├── home-1.html                 → General landing page
├── home-2.html                 → Tech/niche dark-mode variant
├── about.html                  → Company story, team, mission
├── services.html               → Filterable service grid
├── service-details.html        → Individual service with sidebar
├── pricing.html                → Monthly/yearly toggle + comparison
├── blog.html                   → Searchable article grid
├── blog-details.html           → Full article with sidebar
├── contact.html                → Form + map + contact info
├── login.html                  → Split-screen auth (no nav/footer)
├── register.html               → Registration with password meter
├── 404.html                    → Creative "empty room" fallback
├── coming-soon.html            → Countdown + notify form
├── dashboard.html              → Admin/User dual-view portal
├── maintenance.html            → Animated maintenance screen
├── robots.txt                  → SEO crawler instructions
├── sitemap.xml                 → XML sitemap
├── site.webmanifest            → PWA manifest
│
├── assets/
│   ├── css/
│   │   ├── base.css            → Variables, reset, typography
│   │   ├── layout.css          → Grid, containers, spacing
│   │   ├── components.css      → Navbar, buttons, cards, forms
│   │   ├── animations.css      → Keyframes, scroll classes
│   │   ├── dark-mode.css       → Dark theme overrides
│   │   ├── rtl.css             → Right-to-left layout overrides
│   │   ├── responsive.css      → All media queries
│   │   └── dashboard.css       → Dashboard-specific layout
│   │
│   ├── js/
│   │   ├── main.js             → Nav toggle, scroll observer
│   │   ├── animations.js       → Parallax, count-up, progress bar
│   │   ├── theme-toggle.js     → Dark/Light + RTL with localStorage
│   │   ├── forms.js            → Validation, password strength
│   │   ├── dashboard.js        → Sidebar, role switch, counters
│   │   └── utils.js            → debounce, throttle, helpers
│   │
│   └── images/
│       ├── favicons/           → All favicon variants
│       ├── hero/               → Hero backgrounds
│       ├── services/           → Service imagery
│       ├── portfolio/          → Project showcases
│       ├── team/               → Team photos
│       └── blog/               → Article images
│
└── documentation/
    ├── README.md               → This file
    ├── customization-guide.md  → Design token guide
    └── changelog.md            → Version history
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Color | `#0D7377` (Deep Teal) |
| Secondary Color | `#D4AF37` (Luxury Gold) |
| Background | `#FFFFFF` / Dark: `#0F172A` |
| Heading Font | Playfair Display |
| Body Font | Inter |
| Border Radius | `8px` / `16px` (lg) |
| Navbar Height | `72px` desktop, `64px` mobile |
| Max Width | `1280px` |

---

## 🚀 Quick Start

Simply open `index.html` (or `home-1.html`) in any modern browser. No build step required.

```
# Or serve locally with any static server, e.g.:
npx serve .
python -m http.server 8080
```

---

## 🌓 Theme & RTL

- **Dark/Light Mode**: Click the 🌙 moon icon in the navbar. Preference saved to `localStorage`.
- **RTL Toggle**: Click the 🌐 globe icon. Flips the entire layout direction. Saved to `localStorage`.

---

## 📊 Dashboard

`dashboard.html` supports two views:

| View | Access |
|---|---|
| **Admin** | See overview stats, revenue chart, orders table, user management |
| **User** | See project progress cards, order history, messages |

Switch roles using the **Admin / User** toggle in the dashboard header.

---

## 🔒 Auth Pages

`login.html` and `register.html` intentionally have **no navbar or footer** — they are designed as focused, full-viewport authentication screens.

---

## ✅ Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## 📄 License

Template — All rights reserved. © 2026 Aura.
