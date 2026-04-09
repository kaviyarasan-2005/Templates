const fs = require('fs');
const path = require('path');

const dir = 'd:/Projects/Templates/Kaviyarasan/Apirl-26/Personal Stylist Image Consultant/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove "Back to Site" links
  // <a href="index.html" class="btn btn-ghost btn-sm">← <span class="hide-mobile">Back to Site</span></a>
  // Also variants like <a href="index.html">Back to Site</a>
  content = content.replace(/<a[^>]*href=["']index\.html["'][^>]*>.*?Back to Site.*?<\/a>/gs, '');

  // Ensure logo links target index.html
  // Usually <a href="..." class="nav-logo">
  // We want to make sure it always goes to index.html
  // For dashboard pages it might have been different? No, usually it's index.html
  content = content.replace(/(class=["']nav-logo["'][^>]*href=["'])([^"']*)/g, '$1index.html');
  content = content.replace(/(href=["'])([^"']*)(["'][^>]*class=["']nav-logo)/g, '$1index.html$3');
  
  // Footer logo
  content = content.replace(/(class=["']footer-brand-logo["'][^>]*href=["'])([^"']*)/g, '$1index.html');
  content = content.replace(/(href=["'])([^"']*)(["'][^>]*class=["']footer-brand-logo)/g, '$1index.html$3');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned up ${file}`);
  }
});
