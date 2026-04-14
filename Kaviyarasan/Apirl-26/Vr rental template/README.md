# ðŸ•ï¸ RV adven Rentals â€” Website Template

A comprehensive, modern, SEO-optimized RV/Campervan rental platform built with pure HTML, CSS, and vanilla JavaScript. Zero framework dependencies. Production-ready template.

---

## ðŸ“ Project Structure

```
rv-rental-template/
â”œâ”€â”€ assets/
â”‚   â”œâ”€â”€ css/
â”‚   â”‚   â”œâ”€â”€ style.css          # Main design system & components
â”‚   â”‚   â”œâ”€â”€ dark-mode.css      # Dark theme overrides
â”‚   â”‚   â””â”€â”€ rtl.css            # Right-to-left layout support
â”‚   â”œâ”€â”€ js/
â”‚   â”‚   â”œâ”€â”€ main.js            # Core interactions, animations, utilities
â”‚   â”‚   â””â”€â”€ dashboard.js       # Dashboard charts, tables, role management
â”‚   â””â”€â”€ images/
â”‚       â””â”€â”€ favicons/          # Place your favicon files here
â”‚           â”œâ”€â”€ favicon.svg    # SVG favicon (primary)
â”‚           â”œâ”€â”€ favicon.ico    # ICO fallback
â”‚           â””â”€â”€ apple-touch-icon.png
â”œâ”€â”€ pages/
â”‚   â”œâ”€â”€ index.html             # Home Page 1 â€” Services Landing
â”‚   â”œâ”€â”€ home-adventure.html    # Home Page 2 â€” Adventure Edition
â”‚   â”œâ”€â”€ about.html             # About Us
â”‚   â”œâ”€â”€ services.html          # Fleet / Services Listing
â”‚   â”œâ”€â”€ service-detail.html    # Individual RV Detail Page
â”‚   â”œâ”€â”€ blog.html              # Blog / Adventure Guides Listing
â”‚   â”œâ”€â”€ blog-detail.html       # Single Blog Post
â”‚   â”œâ”€â”€ contact.html           # Contact Page
â”‚   â”œâ”€â”€ pricing.html           # Pricing Plans
â”‚   â”œâ”€â”€ login.html             # Sign In (stripped layout)
â”‚   â”œâ”€â”€ register.html          # Create Account (stripped layout)
â”‚   â”œâ”€â”€ 404.html               # Not Found Page
â”‚   â”œâ”€â”€ coming-soon.html       # Coming Soon / Maintenance
â”‚   â””â”€â”€ dashboard/
â”‚       â”œâ”€â”€ index.html         # Dashboard Overview
â”‚       â”œâ”€â”€ fleet.html         # Fleet Management
â”‚       â”œâ”€â”€ bookings.html      # Bookings Management
â”‚       â”œâ”€â”€ users.html         # User Management (Admin)
â”‚       â””â”€â”€ settings.html      # Account Settings
â””â”€â”€ README.md
```

---

## ðŸš€ Quick Start

### Option 1 â€” VS Code Live Server (Recommended)
1. Open the `rv-rental-template/` folder in VS Code
2. Install the **Live Server** extension (Ritwick Dey)
3. Right-click `pages/index.html` â†’ **Open with Live Server**

### Option 2 â€” Node.js serve
```bash
npx serve rv-rental-template/pages
```

### Option 3 â€” Python
```bash
# Python 3
cd rv-rental-template/pages
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

---

## ðŸŽ¨ Design System

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#2E5C47` | Forest green â€” brand primary |
| `--color-primary-dark` | `#1E3D2F` | Hover states, dark elements |
| `--color-primary-light` | `#3D7A61` | Gradients, accents |
| `--color-secondary` | `#E67E22` | Orange â€” CTAs, highlights |
| `--color-accent` | `#F1C40F` | Gold â€” badges, stars |
| `--color-success` | `#27AE60` | Confirmed status |
| `--color-error` | `#E74C3C` | Cancelled, danger |

### Typography
| Font | Usage |
|------|-------|
| **Playfair Display** | H1 headings (serif elegance) |
| **Montserrat** | H2â€“H4, brand names (geometric authority) |
| **Inter** | Body text, UI labels (legibility) |

---

## âœ¨ Features

### ðŸŒ Public Pages
- **Dual Homepage Architecture** â€” Services-focused + Adventure-immersive
- **Hero Section** with search/filter and animated statistics
- **Fleet Grid** with wishlist, filter tabs, sorting, and lazy-loaded images
- **Service Detail** page with interactive gallery, booking card, FAQ accordion
- **Blog System** â€” listing with search/filter + full article with reading progress bar
- **Contact Page** with form validation, location grid, map placeholder
- **Pricing Page** with daily/weekly toggle, comparison table, add-on selector
- **404 & Coming Soon** utility pages

### ðŸ” Authentication Pages
- **Login** â€” Split layout, Google/Facebook/Apple OAuth placeholders, show/hide password
- **Register** â€” Password strength meter, terms checkbox, social sign-up

### ðŸ“Š Dashboard
- **Overview** â€” Stats cards, revenue/fleet charts (Chart.js), recent bookings table
- **Fleet Management** â€” Sortable table with search, filter, pagination, bulk select
- **Bookings** â€” Status tabs (Confirmed/Pending/In Progress/Cancelled), CRUD actions
- **Users** â€” Role-based admin table with user avatars and status management
- **Settings** â€” 7-tab settings panel (Profile, Security, Notifications, Appearance, Billing, Integrations, Danger Zone)
- **Role Toggle** â€” Switch between Admin and User view to see role-based visibility

### ðŸŒ™ Dark Mode & RTL
- Click the ðŸŒ™ moon icon â†’ toggles dark mode (persisted in `localStorage`)
- Click the ðŸŒ globe icon â†’ toggles RTL layout (for Arabic/Hebrew support)

---

## ðŸ“± Responsive Breakpoints

| Breakpoint | Width | Layout Adjustments |
|-----------|-------|-------------------|
| Mobile | < 640px | Single column, mobile nav drawer |
| Tablet | 640â€“1024px | 2-column grids, collapsed sidebar |
| Desktop | > 1024px | Full layouts, sticky sidebars |

---

## âš™ï¸ JavaScript Features (`main.js`)

| Feature | Trigger |
|---------|---------|
| Dark Mode Toggle | `data-theme-toggle` attribute |
| RTL Toggle | `data-dir-toggle` attribute |
| Navbar Scroll Behavior | Auto â€” shadow + blur on scroll |
| Mobile Menu | `.hamburger` button |
| Scroll Animations | `animate-fade-up`, `animate-slide-*` classes |
| Animated Counters | `data-counter` attribute |
| Accordion | `.accordion-item` + `.accordion-header` |
| Lightbox | `data-lightbox` attribute on `<img>` |
| Search Filter | `data-search-input` + `data-search-item` |
| Pricing Toggle | `data-pricing-toggle` â€” switches `data-price-base/alt` |
| Countdown | `data-countdown="ISO date"` |
| Form Validation | `data-validate` on `<form>` |
| Toast Notifications | `window.showToast(msg, type)` |
| Scroll-to-Top | `.scroll-top` button |

---

## ðŸ“Š Dashboard Features (`dashboard.js`)

| Feature | Description |
|---------|-------------|
| Revenue Chart | Line chart â€” 12-month revenue via Chart.js |
| Fleet Distribution | Doughnut chart â€” vehicle classes |
| Fleet Status | Bar chart â€” available/on-trip/maintenance |
| Role Switcher | `data-role="admin/user"` toggle controls admin-only visibility |
| Data Tables | Sort by column, search, paginate |
| Stat Counters | Animated count-up on page load |

---

## ðŸ”— Third-Party Dependencies (CDN)

| Library | Version | Usage |
|---------|---------|-------|
| Font Awesome | 6.5.0 | Icons throughout |
| Google Fonts | Latest | Inter, Playfair Display, Montserrat |
| Chart.js | 4.4.0 | Dashboard analytics charts |

All CDN links use `crossorigin="anonymous"` for security.

---

## ðŸ”Œ Integration Placeholders

| Feature | How to Connect |
|---------|---------------|
| Contact Form | Add `action="https://formspree.io/f/YOUR_ID"` to `#contact-form` |
| Newsletter | Add `action` to newsletter forms or connect Mailchimp API |
| Google Maps | Replace map placeholder with `<iframe>` embed URL |
| Payment (Stripe) | Add Stripe.js and publishable key to booking forms |
| Google Analytics | Add GA4 `gtag.js` script to `<head>` of all pages |
| Social OAuth | Implement Firebase Auth or Auth0 for real social login |

---

## ðŸ› ï¸ Customization Guide

### Change Brand Colors
Edit `:root` in `assets/css/style.css`:
```css
:root {
  --color-primary: #YOUR_COLOR;
  --color-secondary: #YOUR_ACCENT;
}
```

### Add a New Page
1. Copy `pages/services.html` as a starting template
2. Update `<title>`, `<meta name="description">`, and `<h1>`
3. Set the correct `.active` class on the matching nav link
4. Link to it from other pages

### Add Dark Mode Support to New Styles
Add overrides in `assets/css/dark-mode.css`:
```css
[data-theme="dark"] .your-element {
  background: #your-dark-bg;
  color: #your-dark-text;
}
```

---

## âœ… Quality Checklist

- [x] Semantic HTML5 throughout
- [x] ARIA labels on all interactive elements
- [x] Skip-to-content link on all pages
- [x] Keyboard navigable
- [x] All images have descriptive `alt` text
- [x] `loading="lazy"` on below-fold images
- [x] `defer` on all JavaScript
- [x] SEO: title, meta description, structured data on key pages
- [x] Mobile-first responsive layout
- [x] No horizontal scroll at any breakpoint
- [x] Dark mode fully functional
- [x] RTL layout functional
- [x] Form validation (client-side)
- [x] 404 page linked
- [x] Login/Register have no navbar or footer

---

## ðŸ“„ License

This template is provided for commercial and personal use. Attribution appreciated but not required.

---

*Built with â¤ï¸ for the open road. Happy adventuring! ðŸš*
