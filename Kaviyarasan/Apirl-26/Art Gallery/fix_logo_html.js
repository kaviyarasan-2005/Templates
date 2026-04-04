const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, 'pages');
const htmlFiles = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html')).map(f => path.join(PAGES_DIR, f));
htmlFiles.push(path.join(__dirname, 'index.html'));

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Wrap 'Gallery' in a span for easy hiding on mobile
    content = content.replace(/<span>Aurelia<\/span>\s*Gallery/g, '<span>Aurelia</span> <span class="navbar__logo-suffix">Gallery</span>');
    
    // Also fix the mobile menu links if they were messy
    // Keep it simple for now
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Logo structure updated in all HTML files.');
