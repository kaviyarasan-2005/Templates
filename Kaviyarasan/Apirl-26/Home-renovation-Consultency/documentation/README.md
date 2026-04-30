# RenovoPro — Premium Home Renovation Template

A complete 15-page static website template built with HTML5, CSS3, and Vanilla JavaScript.
No frameworks or build tools required — fully deployable as static files.

## Features
- **Pure Vanilla**: Built entirely without frameworks (No React/Vue/Bootstrap).
- **Responsive System**: Mobile-first architecture with custom grid and 8px spacing system.
- **Theme Support**: Built-in Dark/Light mode with local storage persistence.
- **RTL Support**: Full LTR/RTL toggle built-in for internationalization.
- **WCAG Ready**: Proper semantic HTML structure, ARIA labels, and focus states.

## File Structure
- `index.html` — General services landing
- `home-2.html` — Niche-specific agency landing
- `about.html` — Company story, team, timeline
- `services.html` — Main services overview
- `service-details.html` — Specific service details with pricing & FAQ
- `pricing.html` — Multi-tiered pricing cards with toggle
- `blog.html` — Articles grid with JS-driven filtering
- `blog-details.html` — Full blog article with sidebar
- `contact.html` — Form, map, office hours
- `login.html` & `signup.html` — Split-screen authentication pages
- `admin-dashboard.html` & `user-dashboard.html` — App-style dashboards
- `404.html` — Custom error page
- `coming-soon.html` — Countdown and newsletter form

## CSS Architecture
Found in `assets/css/`:
- `style.css`: Contains CSS variables (colors, fonts, spacing), resets, grid system, components, and all page-specific styles.
- `dark-mode.css`: Overrides CSS variables and component backgrounds for `[data-theme="dark"]`.
- `rtl.css`: Mirrors layouts, margins, and flex-directions for `[dir="rtl"]`.

## JS Functionality
Found in `assets/js/`:
- `main.js`: Handles theme/RTL toggles, mobile menu, scroll reveals, counters, accordion, filtering, and form validation.
- `dashboard.js`: Sidebar collapse, chart animations, and tab switching for dashboard pages.

## Customization
To change the brand colors, simply edit the `:root` variables at the top of `assets/css/style.css`.
```css
:root {
  --primary: #YourHexCode;
  --secondary: #YourHexCode;
}
```
