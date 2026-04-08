const fs = require('fs');
const path = require('path');

const pagesDir = 'd:/Projects/Templates/Kaviyarasan/Apirl-26/Personal Stylist Image Consultant/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const standardizedSVG = `
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      `.trim();

let count = 0;
for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We find any button with data-theme-toggle and replace everything inside it.
  const regex = /(<button[^>]*data-theme-toggle[^>]*>)([\s\S]*?)(<\/button>)/g;
  
  const originalContent = content;
  content = content.replace(regex, (match, openTag, inner, closeTag) => {
    // If the open tag has special spacing we preserve it, but we can just drop it directly inside.
    return `${openTag}\n        ${standardizedSVG}\n      ${closeTag.trim()}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
    count++;
  }
}
console.log(`Finished updating ${count} files.`);
