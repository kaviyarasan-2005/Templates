const fs = require('fs');
const path = require('path');

const pagesDir = 'd:/Projects/Templates/Kaviyarasan/Apirl-26/Personal Stylist Image Consultant/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

let count = 0;
for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  const isContactPage = file === 'contact.html';
  const desktopItem = isContactPage ? 
    '<li class="nav-item"><a href="contact.html" class="nav-link active">Contact</a></li>' : 
    '<li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>';
  
  const mobileItem = isContactPage ? 
    '<div class="drawer-nav-item"><a href="contact.html" class="drawer-nav-link active">Contact</a></div>' : 
    '<div class="drawer-nav-item"><a href="contact.html" class="drawer-nav-link">Contact</a></div>';

  // Desktop Nav check
  content = content.replace(/<ul class="nav-menu">([\s\S]*?)<\/ul>/g, (match, inner) => {
    if (!inner.includes('href="contact.html"')) {
      // Missing! Let's insert before Dashboard if exists, else before </ul>
      if (inner.includes('Dashboard')) {
        let newInner = inner.replace(/<li class="nav-item">\s*<button class="nav-link[^>]*>Dashboard/i, desktopItem + '\n      <li class="nav-item">\n        <button class="nav-link">Dashboard');
        return `<ul class="nav-menu">${newInner}</ul>`;
      } else {
        return `<ul class="nav-menu">${inner}\n      ${desktopItem}\n    </ul>`;
      }
    }
    return match;
  });

  // Mobile Drawer check
  content = content.replace(/<nav class="drawer-nav">([\s\S]*?)<\/nav>/g, (match, inner) => {
    if (!inner.includes('href="contact.html"')) {
      if (inner.includes('Dashboard')) {
        let newInner = inner.replace(/<div class="drawer-nav-item">\s*<div class="drawer-nav-link[^>]*>Dashboard/i, mobileItem + '\n    <div class="drawer-nav-item"><div class="drawer-nav-link" tabindex="0">Dashboard');
        return `<nav class="drawer-nav">${newInner}</nav>`;
      } else {
        return `<nav class="drawer-nav">${inner}\n    ${mobileItem}\n  </nav>`;
      }
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated missing Contact link in ${file}`);
    count++;
  }
}

console.log(`Fixed ${count} files.`);
