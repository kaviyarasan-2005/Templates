# Customization Guide

## Changing Brand Colors

Open `assets/css/base.css` and update the CSS variables in `:root`:

```css
:root {
  --color-primary: #0D7377;       /* Main teal — change this */
  --color-secondary: #D4AF37;     /* Gold accent — change this */
  --color-primary-light: #14B8BE; /* Lighter tint */
  --color-primary-dark: #074345;  /* Darker shade */
}
```

Dark mode overrides are in `assets/css/dark-mode.css` under `[data-theme="dark"]`.

---

## Changing the Brand Name

Search and replace `Aura` across all HTML files with your brand name.

---

## Changing Typography

In `base.css`, update the font variables and add your Google Fonts link:

```css
:root {
  --font-heading: 'Your Heading Font', serif;
  --font-body: 'Your Body Font', sans-serif;
}
```

---

## Adding New Pages

1. Copy `home-1.html` as your starting template.
2. Update the `<title>`, `<meta description>`, and `class="active"` on the correct nav link.
3. Load the same CSS stack in `<head>`.
4. Load `utils.js`, `main.js`, `animations.js` before `</body>`.

---

## Adding a New Dashboard Section

1. Add a `<div id="my-section" class="dash-section" style="display:none;">` block in `dashboard.html`.
2. Add a nav link:
   ```html
   <a href="#" class="nav-link" onclick="switchSection('my-section', this)">
     My Section
   </a>
   ```
3. `dashboard.js` handles the rest automatically.

---

## Configuring the Countdown Timer

In `coming-soon.html`, update the launch date:

```js
const launchDate = new Date('2026-06-01T00:00:00');
```

---

## Disabling Dark Mode / RTL

To disable a feature, simply remove the corresponding icon button from the navbar HTML and the `<link>` to `dark-mode.css` or `rtl.css`.
