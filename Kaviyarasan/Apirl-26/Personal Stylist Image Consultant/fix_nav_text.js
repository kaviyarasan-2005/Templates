const fs = require('fs');
const path = require('path');

const pagesDir = 'd:/Projects/Templates/Kaviyarasan/Apirl-26/Personal Stylist Image Consultant/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

let count = 0;
for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Find all nav-dropdowns and replace text
  content = content.replace(/<div class="nav-dropdown">([\s\S]*?)<\/div>/g, (match, inner) => {
    let newInner = inner;
    newInner = newInner.replace(/>\s*General Services\s*</g, '>Home 1<');
    newInner = newInner.replace(/>\s*Niche Specialist\s*</g, '>Home 2<');
    newInner = newInner.replace(/(<\/svg>)\s*General Services\s*(<\/a>)/g, '$1Home 1$2');
    newInner = newInner.replace(/(<\/svg>)\s*Niche Specialist\s*(<\/a>)/g, '$1Home 2$2');
    // Also handle case where there is no space or tags
    newInner = newInner.replace(/General Services/g, 'Home 1');
    newInner = newInner.replace(/Niche Specialist/g, 'Home 2');
    return `<div class="nav-dropdown">${newInner}</div>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
    count++;
  }
}

console.log(`Fixed ${count} files.`);
