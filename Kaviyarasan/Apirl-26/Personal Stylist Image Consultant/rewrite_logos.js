const fs = require('fs');
const path = require('path');

const pagesDir = 'd:/Projects/Templates/Kaviyarasan/Apirl-26/Personal Stylist Image Consultant/pages';

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace header and drawer nav logo
  content = content.replace(
    /<div class="nav-logo-mark">É<\/div>/g,
    '<img src="../assets/images/icons/logo.svg" class="nav-logo-mark-img" alt="Logo" width="36" height="36" style="margin-right: 8px; flex-shrink: 0;" />'
  );

  // Replace footer brand logo
  content = content.replace(
    /<div class="footer-brand-logo-mark">É<\/div>/g,
    '<img src="../assets/images/icons/logo.svg" class="footer-brand-logo-mark-img" alt="Logo" width="48" height="48" style="margin-right: 12px; flex-shrink: 0;" />'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
