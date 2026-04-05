# Ember & Brew — Specialty Coffee Roaster Website

A complete, production-ready specialty coffee roaster website featuring an online store and cafe presence. Built with pure HTML5, CSS3, and Vanilla JavaScript — no frameworks.

## 🏗 Project Structure

```
coffee-roaster/
├── index.html                    # Redirector → home-classic.html
├── assets/
│   ├── css/
│   │   ├── style.css             # Main stylesheet (design system + components)
│   │   ├── dark-mode.css         # Dark theme overrides
│   │   ├── rtl.css               # RTL (right-to-left) layout support
│   │   └── animations.css        # Keyframes + scroll reveal classes
│   ├── js/
│   │   ├── main.js               # Core functionality (nav, theme, forms, cart)
│   │   ├── dashboard.js          # Dashboard panels, charts, role switching
│   │   ├── animations.js         # IntersectionObserver scroll animations
│   │   └── plugins/              # Utility scripts
│   ├── images/
│   │   ├── favicons/             # Multi-size favicon set
│   │   ├── products/             # Product photography
│   │   ├── cafe/                 # Cafe & interior shots
│   │   ├── team/                 # Team portraits
│   │   ├── blog/                 # Article images
│   │   └── backgrounds/          # Hero & texture images
│   └── fonts/                    # Custom webfonts (if needed)
├── pages/
│   ├── home-classic.html         # Homepage 1 — Classic coffee experience
│   ├── home-modern.html          # Homepage 2 — Modern SaaS-style experience
│   ├── about.html                # About Us — team, values, timeline
│   ├── services.html             # Services overview + product grid
│   ├── service-details.html      # In-depth service page with FAQ
│   ├── blog.html                 # Blog listing with filters & sidebar
│   ├── blog-details.html         # Full article with related posts
│   ├── contact.html              # Contact form, map, social buttons
│   ├── pricing.html              # 3-tier plans with comparison table
│   ├── login.html                # Login (no nav/footer, split layout)
│   ├── register.html             # Registration (no nav/footer)
│   ├── dashboard.html            # Dual-role admin/user dashboard
│   ├── 404.html                  # Custom error page
│   └── coming-soon.html          # Maintenance/launch countdown
└── documentation/                # Project docs
```

## 🎨 Design System

### Colors
- **Primary:** `#6F4E37` (Coffee brown)
- **Secondary:** `#D4A574` (Caramel)
- **Accent:** `#E85D04` (Vibrant orange)
- **Background:** `#FDFBF7` (Warm white)

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)

### Breakpoints
- Mobile: < 640px
- Tablet: 640–1024px
- Desktop: 1024–1280px
- Large: > 1280px

## ✨ Features

### Dual Homepages
- **Classic:** Traditional coffee brand with hero, products, process timeline
- **Modern:** SaaS-style with subscription calculator, coffee quiz, carousel

### Navigation
- Fixed navbar with glassmorphism effect
- Home dropdown with homepage switcher
- Mobile hamburger menu with full-screen overlay
- Cart badge, RTL toggle (🌐), theme toggle (🌙/☀️)
- Active page highlighting

### Dark/Light Mode
- Toggle via sun/moon icon
- System preference detection (`prefers-color-scheme`)
- LocalStorage persistence
- Smooth 300ms transitions

### RTL/LTR Support
- Globe icon toggle
- CSS logical properties throughout
- Arabic font (Cairo) loaded for RTL
- Mirrored layouts for timeline, cards, nav

### Dashboard
- Dual-role: Admin and User views
- Role switcher in sidebar
- **Admin:** Revenue charts, user management, order tracking, product management
- **User:** Order history, wishlist, subscription management, profile settings
- Messages panel with reply functionality
- Canvas-based charts (bar + line)

### Other Features
- Blog with category filtering
- Interactive subscription calculator
- Coffee flavor quiz
- Pricing with monthly/yearly toggle
- FAQ accordions
- Contact form with validation
- Social login buttons (Google, Facebook, Instagram)
- Newsletter subscription
- Back-to-top button
- Toast notifications
- Animated counters

## 🚀 Getting Started

1. Clone or download this repository
2. Open `index.html` in a browser (or use a local server)
3. The index page automatically redirects to `pages/home-classic.html`

### Running Locally
```bash
# Using Python's built-in server
python -m http.server 8000

# Using Node's npx serve
npx serve .

# Using PHP's built-in server
php -S localhost:8000
```

## 🎯 Customization

### Changing Colors
Edit the CSS variables in `assets/css/style.css` under `:root`:
```css
:root {
  --color-primary: #YOUR_COLOR;
  --color-accent: #YOUR_ACCENT;
  /* etc. */
}
```

### Changing Fonts
Update the Google Fonts import in each HTML file and the `--font-heading` / `--font-body` variables.

### Adding Pages
1. Copy any existing page as a template
2. Update the `<title>`, `<meta>`, and content
3. Ensure the navbar link is active for the correct page

## 📋 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 Third-Party Credits
- **Fonts:** [Google Fonts](https://fonts.google.com/) — Playfair Display, Inter, Cairo
- **Images:** [Unsplash](https://unsplash.com/) — Free high-quality photography
- **Icons:** Unicode emoji (no icon library dependency)

## 📝 Changelog

### v1.0.0 (April 2026)
- Initial release
- 15 pages complete
- Dual homepage system
- Full dashboard with role switching
- Dark mode + RTL support
- Complete responsive design
- All animations and micro-interactions

---

© 2026 Ember & Brew. All rights reserved.
