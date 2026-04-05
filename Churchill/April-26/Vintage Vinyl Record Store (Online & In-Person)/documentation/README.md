# 🎵 Vintage Vinyl Record Store — Website

A modern, immersive e-commerce website for a vintage vinyl record store built with HTML5, CSS3 (Custom Properties), and Vanilla JavaScript (ES6+).

## 📂 File Structure

```
vinyl-record-store/
├── index.html                 ← Home Page 1 (General Landing)
├── sitemap.xml                ← XML Sitemap for SEO
├── robots.txt                 ← Crawler directives
├── assets/
│   ├── css/
│   │   ├── style.css          ← Main design system (variables, components, responsive)
│   │   ├── dark-mode.css      ← Dark theme overrides
│   │   └── rtl.css            ← RTL layout adjustments
│   ├── js/
│   │   ├── main.js            ← Core functionality (navbar, scroll reveals, mobile menu)
│   │   └── theme-switcher.js  ← Dark/Light toggle + RTL direction management
│   └── images/
│       ├── hero/              ← Hero background images
│       ├── products/          ← Product/vinyl images
│       └── team/              ← Team member headshots
├── pages/
│   ├── home-2.html            ← Home Page 2 (Niche/Audiophile Experience)
│   ├── about.html             ← About Us (Team, Mission, Timeline)
│   ├── services.html          ← Services Grid
│   ├── service-detail.html    ← Service Detail (Record Cleaning)
│   ├── blog.html              ← Blog Listing (Filterable)
│   ├── blog-detail.html       ← Blog Post (Full Article + Sidebar)
│   ├── contact.html           ← Contact (Form, Map, Hours)
│   ├── pricing.html           ← Pricing (Tiers + Service Table)
│   ├── login.html             ← Login (No Nav/Footer, Single Viewport)
│   ├── register.html          ← Register (Social Login Options)
│   ├── dashboard-admin.html   ← Admin Dashboard (Analytics, Orders)
│   ├── 404.html               ← Custom Error Page
│   └── coming-soon.html       ← Maintenance/Coming Soon
└── documentation/
    └── README.md
```

## 🚀 Getting Started

1. **Clone or download** the project
2. **Serve locally** with any HTTP server:
   ```bash
   # Python
   python -m http.server 8080

   # Node.js
   npx serve .

   # VS Code
   # Use "Live Server" extension
   ```
3. Open `http://localhost:8080` in your browser

## 🎨 Customization Guide

### Colors
All colors are defined as CSS custom properties in `assets/css/style.css`:
```css
--color-primary: #8B4513;     /* Change main brand color */
--color-accent: #FFD700;      /* Change accent/CTA color */
--color-secondary: #1A1A2E;   /* Change dark background color */
```

### Fonts
Change font families in the `:root` block:
```css
--font-heading: 'Playfair Display', serif;
--font-body: 'Inter', sans-serif;
--font-accent: 'Space Grotesk', sans-serif;
```

### Logo
Replace the logo icon class `.navbar__logo-icon` content or swap with an `<img>` tag.

## ✨ Features

- **14 fully designed pages** — home (×2), about, services, service detail, blog, blog detail, contact, pricing, login, register, admin dashboard, 404, coming soon
- **Dark/Light mode** — toggle with localStorage persistence + system preference detection
- **RTL support** — full right-to-left layout for Arabic/Hebrew
- **Responsive design** — mobile-first approach with breakpoints at 640px, 768px, 1024px
- **Scroll animations** — Intersection Observer-based reveal effects
- **Accessibility** — ARIA labels, focus indicators, skip links, keyboard navigation, reduced motion support
- **SEO optimized** — meta tags, JSON-LD structured data, semantic HTML, sitemap

## 🖥 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

## 📦 Third-Party Credits

- **Fonts:** [Google Fonts](https://fonts.google.com/) — Playfair Display, Inter, Space Grotesk
- **Images:** [Unsplash](https://unsplash.com/) — Free high-quality photography
- **Icons:** Unicode Emoji (no external icon library required)

## 📄 License

This project is provided as a template for educational and commercial use.
