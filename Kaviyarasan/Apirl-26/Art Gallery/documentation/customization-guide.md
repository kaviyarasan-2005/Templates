# Customization Guide

This guide details how to modify the Aurelia Gallery template to match your brand requirements.

## 1. Changing Colors (Theme)
All primary colors are managed by CSS Custom Properties (Variables) inside `assets/css/style.css`.
To change the brand color from Gold/Burgundy to your own palette:

1. Open `assets/css/style.css`
2. Locate the `:root` block at the top.
3. Modify the HSL or HEX values:
```css
:root {
  /* Brand Colors */
  --color-primary: #D4AF37; /* Change this */
  --color-secondary: #722F37; /* Change this */
  --color-accent: #B87333; /* Change this */
}
```

Because we use Tailwind CSS via script tag in the HTML files, you also need to ensure the custom configuration injected via the `<script>` tag in the `<head>` of HTML files matches your new colors if you intend to use Tailwind utility classes (`text-gold`, `bg-primary`, etc).

## 2. Changing Typography
We use Google Fonts (Playfair Display for headings, Inter for body).
To change fonts:
1. Update the `<link href="...fonts.googleapis.com...">` in the `<head>` of HTML files.
2. Update `style.css` `:root` variables:
```css
:root {
  --font-heading: 'Your New Heading Font', serif;
  --font-body: 'Your New Body Font', sans-serif;
}
```

## 3. Dark Mode Customization
Dark mode overrides are located purely in `assets/css/dark-mode.css`. 
When `data-theme="dark"` is applied to the HTML tag, the variables in this file override the `:root` variables in `style.css`. Adjust the background and text color variables in this file to tweak the dark theme.

## 4. Disabling The Custom Cursor
If you prefer a native browser cursor over the custom circle follower:
1. Open `assets/js/main.js`
2. Comment out or delete the lines related to `cursor` and `cursorFollower`.
3. In `style.css`, remote `cursor: none;` from the `body` tag if it exists.

## 5. Modifying Animations
Scroll reveal animations are handled by an `IntersectionObserver` in `assets/js/animations.js`.
Elements with the `.reveal`, `.reveal-left`, or `.reveal-right` classes automatically animate when scrolled into view.

To adjust animation speed or distance, find these classes in `style.css` and modify their `transition` properties.

## 6. Updating the Imagery
Replace the images in `assets/images/artworks/` with your own assets.
For optimal performance, we recommend:
- Converting hero backgrounds to WebP format.
- Keeping large images under 500KB.
- Maintaining the current aspect ratios (usually 3:2 or Square) to avoid layout shifts.

## 7. Configuring the Dashboard Chart
The dashboard uses Chart.js.
To update data points:
1. Open `assets/js/dashboard.js`.
2. Locate the `Chart` instantiations.
3. Update the `labels` and `data` arrays within the config objects.
