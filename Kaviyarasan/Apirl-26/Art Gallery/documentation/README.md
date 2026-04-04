# Aurelia Gallery - Premium HTML Template
**Version:** 1.0.0  
**Author:** Kaviyarasan  
**Technology Stack:** Vanilla HTML5, CSS3 (Tailwind v3.x CDN via Script), Vanilla ES6 JavaScript  

## Overview
Aurelia Gallery is a high-performance, strictly vanilla HTML/CSS/JS template designed for premium art galleries and exhibition spaces. It eschews heavy frameworks in favor of clean, semantic code, offering native dark/light mode and RTL (Right-to-Left) support out of the box.

## Directory Structure
```
art-gallery-template/
├── index.html                    # Root redirect to main home
├── assets/
│   ├── css/                      # Core stylesheets (BEM methodology)
│   │   ├── style.css             # Main design system & layout
│   │   ├── dark-mode.css         # Dark theme overrides
│   │   └── rtl.css               # RTL layout overrides
│   ├── js/                       # ES6 Modules
│   │   ├── main.js               # Core logic (Nav, theme, cursor)
│   │   ├── animations.js         # Scroll reveals, lightbox, parallax
│   │   ├── utils.js              # Helpers (throttle, helpers)
│   │   ├── forms.js              # Real-time form validation
│   │   └── dashboard.js          # Chart.js & table logic
│   └── images/
│       ├── artworks/             # Demo artworks & hero images
│       └── favicons/             # Standard & generated icons
├── pages/                        # All 15+ HTML Templates
│   ├── home-main.html            # Primary landing page
│   ├── home-exhibition.html      # Exhibition specific landing
│   ├── about.html                # Gallery history & team
│   ├── services.html             # Gallery services
│   ├── service-detail.html       # Individual service
│   ├── blog.html                 # News/Journal listing
│   ├── blog-detail.html          # Individual article
│   ├── contact.html              # Contact form & map
│   ├── pricing.html              # Memberships & guided tours
│   ├── login.html                # Auth (no navbar)
│   ├── register.html             # Auth (no navbar)
│   ├── dashboard.html            # User/Admin portal
│   ├── 404.html                  # Error page
│   └── maintenance.html          # Under construction
└── documentation/
    ├── README.md                 # This file
    └── customization-guide.md    # Guide to modifying the template
```

## Core Features
1. **Zero-Framework Architecture:** No React/Vue/jQuery. Blazing fast load times.
2. **Tailwind via Script:** Utilizes Tailwind CSS via CDN script tag for rapid development without Node build steps. `tailwind.config` is injected in the `<head>`.
3. **Native Dark Mode:** Toggleable via UI, controlled by `[data-theme="dark"]` on `<html>`. Saves preference to `localStorage`.
4. **RTL Support:** Complete Right-to-Left support for Arabic/Hebrew out of the box. Toggled via UI or `dir="rtl"` attribute.
5. **Dynamic Dashboard:** Includes a fully functional UI dashboard with **Chart.js** integration and sortable data tables.
6. **Custom Animations:** Built-in Intersection Observer scripts for scroll reveals (`reveal`, `stagger-child`), parallax headers, and a custom interactive cursor.

## Quick Start
1. Clone or download the repository.
2. Open `index.html` in any modern browser (or serve via a simple local server like VSCode Live Server).
3. No build steps (`npm install` or `build`) are required to run the template.

## CSS Architecture
We use a hybrid approach: Custom CSS classes written in BEM methodology for complex, reusable components (Navbars, Lightboxes), combined with Tailwind utility classes parsed via CDN for layout scaffolding.

All global variables (colors, spacing, fonts) are defined in `:root` inside `style.css`.

## JavaScript Modules
Scripts are loaded as ES6 modules (`type="module"`).
- Ensure you run the files via a local server (e.g., `http://localhost:5500`) when developing locally to avoid CORS issues with module importing.

## Browser Support
- Chrome, Firefox, Safari, Edge (last 2 versions)
- iOS Safari, Chrome for Android

## SEO & Accessibility
- Semantic HTML5 structure (`<nav>`, `<main>`, `<article>`, `<aside>`).
- ARIA labels on interactive elements (buttons, toggles, menus).
- Basic JSON-LD Schema markup injected into page HEAD tags.
