const fs = require('fs');
const path = require('path');

const pagesDir = 'd:/Projects/Templates/Kaviyarasan/Apirl-26/Personal Stylist Image Consultant/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const desktopDropdown = `<li class="nav-item">
        <button class="nav-link">Home <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
        <div class="nav-dropdown">
          <a href="index.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>Home 1</a>
          <a href="home-2.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>Home 2</a>
        </div>
      </li>`;

const mobileDropdown = `<div class="drawer-nav-item"><div class="drawer-nav-link" tabindex="0">Home <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></div><div class="drawer-sub"><a href="index.html">Home 1</a><a href="home-2.html">Home 2</a></div></div>`;

let count = 0;
for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  const originalContent = content;
  
  // Replace desktop simple home link
  content = content.replace(/<li class="nav-item">\s*<a href="index\.html" class="nav-link(\s+active)?">Home<\/a>\s*<\/li>/g, (match, p1) => {
      if (p1) {
          // If it was active, keep active
          return desktopDropdown.replace('class="nav-link"', 'class="nav-link active"');
      }
      return desktopDropdown;
  });

  // Replace mobile drawer simple home link
  content = content.replace(/<div class="drawer-nav-item">\s*<a href="index\.html" class="drawer-nav-link">Home<\/a>\s*<\/div>/g, () => {
      return mobileDropdown;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
    count++;
  }
}
console.log(`Finished updating ${count} files.`);
