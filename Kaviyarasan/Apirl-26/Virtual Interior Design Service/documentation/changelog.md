# Changelog

All notable changes to the Aura template are documented here.

---

## [1.0.0] — 2026-04-12

### Added — Phase 1: Foundation
- `index.html` — redirect entry point
- `home-1.html` — full landing page with hero, features grid, 2×2 services, stats, testimonials carousel, CTA band, and footer
- `assets/css/base.css` — CSS variables, reset, typography scale
- `assets/css/layout.css` — container, grid, flexbox utilities
- `assets/css/components.css` — navbar, dropdowns, buttons, cards, forms, mobile overlay
- `assets/css/animations.css` — keyframes and scroll animation utility classes
- `assets/js/main.js` — mobile nav toggle, intersection observer, navbar scroll effect

### Added — Phase 2: Core Pages
- `about.html` — story grid, team cards (hover overlay bio), mission/vision icons
- `services.html` — filterable service grid with category pills
- `service-details.html` — 2/3 + 1/3 layout, sticky sidebar pricing, process timeline, FAQ accordion
- `pricing.html` — monthly/yearly toggle with animated price transition, comparison table, elevated middle card
- `contact.html` — form with real-time validation, contact info panel, map placeholder, toast notification

### Added — Phase 3: Content & Auth
- `blog.html` — search bar, category pills, 6-article grid, pagination
- `blog-details.html` — full article layout, sidebar with author bio, related posts, newsletter
- `login.html` — split-screen (no nav/footer), Google/Facebook social buttons, password toggle
- `register.html` — split-screen with onboarding steps, password strength meter
- `404.html` — creative "empty room" SVG illustration, outlined 404, floating animation
- `coming-soon.html` — animated mesh background, countdown timer, email notification form
- `assets/js/forms.js` — contact validation, auth submission, password strength indicator

### Added — Phase 4: Advanced Interfaces
- `home-2.html` — dark aesthetic hero with animated mesh, floating mockup cards, before/after slider, logo marquee, vertical timeline
- `dashboard.html` — collapsible sidebar, Admin/User role switcher, stat cards with animated counters, CSS bar/donut charts, orders table with status badges, project cards, message UI
- `maintenance.html` — animated progress bar, floating particles, social links
- `assets/css/dashboard.css` — complete dashboard layout system
- `assets/js/dashboard.js` — sidebar collapse, role switching, section routing, count-up animation

### Added — Phase 5: Polish
- `assets/css/dark-mode.css` — full dark theme with transition support
- `assets/css/rtl.css` — comprehensive right-to-left layout overrides
- `assets/css/responsive.css` — mobile-first breakpoints for all components
- `assets/js/theme-toggle.js` — dark/light + RTL toggle with localStorage persistence (runs before render)
- `assets/js/animations.js` — scroll-triggered animations, parallax, scroll progress bar, count-up
- `assets/js/utils.js` — debounce, throttle, localStorage helpers, formatters
- `site.webmanifest` — PWA manifest
- `robots.txt` — SEO crawler config
- `sitemap.xml` — XML sitemap for all public pages
- `documentation/README.md` — project overview and structure guide
- `documentation/customization-guide.md` — design token and feature customization recipes
- SEO meta tags, Open Graph tags, and PWA theme-color on `home-1.html`
