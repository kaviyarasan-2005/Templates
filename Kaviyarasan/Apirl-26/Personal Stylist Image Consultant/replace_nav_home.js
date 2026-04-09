const fs = require('fs');
const path = require('path');

const pagesDir = 'd:/Projects/Templates/Kaviyarasan/Apirl-26/Personal Stylist Image Consultant/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

let count = 0;
for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const originalContent = content;
  
  // Replace in Desktop nav dropdown
  content = content.replace(
    /<a href="index\.html">([^<]+)?<svg[^>]*>.*?<\/svg>\s*General Services\s*<\/a>/g,
    (match) => match.replace('General Services', 'Home 1')
  );
  content = content.replace(
    /<a href="home-2\.html">([^<]+)?<svg[^>]*>.*?<\/svg>\s*Niche Specialist\s*<\/a>/g,
    (match) => match.replace('Niche Specialist', 'Home 2')
  );

  // Replace in Mobile Drawer
  content = content.replace(
    /<div class="drawer-sub">.*?<\/div>/gs, 
    (drawerMatch) => {
       // Only process the Home drawer which has index.html and home-2.html
       if (drawerMatch.includes('"index.html"') && drawerMatch.includes('"home-2.html"')) {
           return drawerMatch.replace(/>\s*General Services\s*</g, '>Home 1<').replace(/>\s*Niche Specialist\s*</g, '>Home 2<');
       }
       return drawerMatch;
    }
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
    count++;
  }
}
console.log(`Finished updating ${count} files.`);
