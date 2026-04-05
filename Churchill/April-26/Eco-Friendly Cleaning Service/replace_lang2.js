const fs = require('fs');
const path = require('path');

const dir = 'd:/Eco-Friendly Cleaning Service';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const replacement = `<button class="lang-toggle btn btn-ghost btn-icon" id="dir-toggle" aria-label="Toggle RTL/LTR" title="Toggle RTL/LTR" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;color:var(--text-primary);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          </button>`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('id="lang-dropdown"')) {
    // Regex to match the entire language dropdown div
    const blockRegex = /<div class="lang-dropdown nav-dropdown" id="lang-dropdown">[\s\S]*?<\/div>\s*<\/div>/g;
    
    // Check if it matches
    if (content.match(blockRegex)) {
        content = content.replace(blockRegex, replacement);
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Failed to match regex in ${file}`);
    }
  }
}
