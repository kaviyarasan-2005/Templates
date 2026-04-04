const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, 'pages');
const htmlFiles = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html')).map(f => path.join(PAGES_DIR, f));
htmlFiles.push(path.join(__dirname, 'index.html'));

const DESKTOP_NAV_HTML = `
      <div class="navbar__links">
        <div class="navbar__dropdown">
          <a href="#" class="navbar__link navbar__dropdown-trigger" aria-expanded="false">Home <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a>
          <div class="navbar__dropdown-menu" role="menu">
            <a href="home-main.html" class="navbar__dropdown-item" role="menuitem">Gallery Overview</a>
            <a href="home-exhibition.html" class="navbar__dropdown-item" role="menuitem">Current Exhibition</a>
          </div>
        </div>
        <a href="about.html" class="navbar__link">About Us</a>
        <a href="services.html" class="navbar__link">Services</a>
        <a href="blog.html" class="navbar__link">Blog</a>
        <a href="contact.html" class="navbar__link">Contact</a>
        <div class="navbar__dropdown">
          <a href="#" class="navbar__link navbar__dropdown-trigger" aria-expanded="false">Dashboard <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a>
          <div class="navbar__dropdown-menu" role="menu">
            <a href="dashboard.html#user" class="navbar__dropdown-item" role="menuitem">User View</a>
            <a href="dashboard.html#admin" class="navbar__dropdown-item" role="menuitem">Admin View</a>
          </div>
        </div>
      </div>`.trim();

const ACTIONS_HTML = `
      <div class="navbar__actions">
        <button class="navbar__icon-btn" id="rtl-toggle" aria-label="Toggle RTL/LTR">
          <svg style="pointer-events:none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </button>
        <button class="navbar__icon-btn" id="theme-toggle" aria-label="Toggle dark mode">
          <svg style="pointer-events:none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <a href="login.html" class="btn btn--primary btn--sm mobile-hidden">Login</a>
      </div>
      <button class="navbar__hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>`.trim();

const MOBILE_NAV_HTML = `
    <div class="navbar__mobile-menu" aria-hidden="true">
      <a href="home-main.html" class="navbar__link">Gallery Overview</a>
      <a href="home-exhibition.html" class="navbar__link">Current Exhibition</a>
      <a href="about.html" class="navbar__link">About Us</a>
      <a href="services.html" class="navbar__link">Services</a>
      <a href="blog.html" class="navbar__link">Blog</a>
      <a href="contact.html" class="navbar__link">Contact</a>
      <div style="border-top:1px solid var(--color-border); width:100%; margin:8px 0;"></div>
      <a href="dashboard.html#user" class="navbar__link">User Dashboard</a>
      <a href="dashboard.html#admin" class="navbar__link">Admin Dashboard</a>
      <div style="display:flex;gap:12px;margin-top:16px;">
        <button class="navbar__icon-btn" onclick="document.getElementById('rtl-toggle').click()"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></button>
        <button class="navbar__icon-btn" onclick="document.getElementById('theme-toggle').click()"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></button>
      </div>
      <a href="login.html" class="btn btn--primary" style="margin-top:8px;">Login</a>
    </div>`.trim();

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    if (file.includes('dashboard.html') || file.includes('maintenance.html') || file.includes('404.html')) return;

    const navRegex = /<nav class="navbar"[\s\S]*?<!-- NAVBAR END -->/g;
    
    const logoHtml = content.match(/<a href="home-main\.html" class="navbar__logo">[\s\S]*?<\/a>|<a href="index\.html" class="navbar__logo">[\s\S]*?<\/a>/)?.[0] || `<a href="home-main.html" class="navbar__logo"><svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="8" fill="#D4AF37"/><path d="M18 8L26 28H10L18 8Z" fill="white" opacity="0.9"/><circle cx="18" cy="20" r="4" fill="white" opacity="0.7"/></svg><span>Aurelia</span> <span class="navbar__logo-suffix">Gallery</span></a>`;

    const fullNavHtml = `
  <nav class="navbar" id="main-navbar" role="navigation" aria-label="Main navigation">
    <div class="navbar__inner">
      ${logoHtml}
      ${DESKTOP_NAV_HTML}
      ${ACTIONS_HTML}
    </div>
    ${MOBILE_NAV_HTML}
  </nav>
  <!-- NAVBAR END -->`.trim();

    content = content.replace(navRegex, fullNavHtml);
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Bulk header reconstruction (v2) complete.');
