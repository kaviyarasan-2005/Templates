const fs = require('fs');
const glob = require('fs').readdirSync('pages').filter(f => f.endsWith('.html')).map(f => 'pages/' + f);
glob.push('index.html');

glob.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // First clean up PREVIOUS mess
    const badDesktopRegex = /\n?\s*<div class="navbar__dropdown">\s*<a href="#" class="navbar__link navbar__dropdown-trigger" aria-expanded="false">Dashboard <svg[^>]+><polyline[^>]+><\/svg><\/a>\s*<div class="navbar__dropdown-menu" role="menu">\s*<a href="dashboard\.html" class="navbar__dropdown-item" role="menuitem">User Dashboard<\/a>\s*<a href="dashboard\.html#admin" class="navbar__dropdown-item" role="menuitem">Admin Dashboard<\/a>\s*<\/div>\s*<\/div>/g;
    
    content = content.replace(badDesktopRegex, '');
    
    const badMobileRegex = /\s*<a href="dashboard\.html" class="navbar__link" style="visibility:visible;opacity:1;transform:none;">User Dashboard<\/a>\s*<a href="dashboard\.html#admin" class="navbar__link" style="visibility:visible;opacity:1;transform:none;">Admin Dashboard<\/a>/g;
    
    content = content.replace(badMobileRegex, '');

    // NOW INSERT CORRECTLY
    const desktopDropdown = `        <div class="navbar__dropdown">
          <a href="#" class="navbar__link navbar__dropdown-trigger" aria-expanded="false">Dashboard <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a>
          <div class="navbar__dropdown-menu" role="menu">
            <a href="dashboard.html" class="navbar__dropdown-item" role="menuitem">User Dashboard</a>
            <a href="dashboard.html#admin" class="navbar__dropdown-item" role="menuitem">Admin Dashboard</a>
          </div>
        </div>
      </div>`;

    const mobileLinks = `      <a href="dashboard.html" class="navbar__link" style="visibility:visible;opacity:1;transform:none;">User Dashboard</a>
      <a href="dashboard.html#admin" class="navbar__link" style="visibility:visible;opacity:1;transform:none;">Admin Dashboard</a>
      <div class="navbar__mobile-toggles" style="display:flex;gap:12px;margin-top:16px;">`;

    // 1. Insert desktop: Look for `navbar__links` closing div. We can split.
    if (content.includes('navbar__links') && !content.includes('User Dashboard')) {
       // Replace the </div> that closes navbar__links
       // We know the last link before </div> is contact
       content = content.replace(/(<a href="contact\.html" class="navbar__link[^>]*>Contact<\/a>\s*)<\/div>/g, '$1' + desktopDropdown);
       
       // 2. Insert mobile: we want it before the toggles in mobile menu, or before Login button.
       content = content.replace(/(<div style="display:flex;gap:12px;margin-top:16px;">)/g, mobileLinks);
       
        // Some pages don't have toggler, just login button in mobile
        content = content.replace(/(<a href="login\.html" class="btn btn--primary"[^>]*>Login<\/a>\s*<\/div>\s*<\/nav>)/g, '      <a href="dashboard.html" class="navbar__link">User Dashboard</a>\n      <a href="dashboard.html#admin" class="navbar__link">Admin Dashboard</a>\n$1');
    }
    
    fs.writeFileSync(file, content, 'utf8');
});
console.log('Cleaned and Fixed');
