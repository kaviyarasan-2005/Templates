const fs = require('fs');
const path = require('path');

const dir = 'd:/Eco-Friendly Cleaning Service';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const regex = /<div class="lang-dropdown nav-dropdown" id="lang-dropdown">[\s\S]*?<\/button><\/div><\/div>/;

const replacement = `<button class="lang-toggle btn btn-ghost btn-icon" id="dir-toggle" aria-label="Toggle RTL/LTR" title="Toggle RTL/LTR" style="padding:4px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></button>`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('id="lang-dropdown"')) {
    const startIdx = content.indexOf('<div class="lang-dropdown');
    // find the closing </div></div>, but wait. To avoid issues, let's use exact string if possible.
    const searchString = `<div class="lang-dropdown nav-dropdown" id="lang-dropdown"><button class="lang-toggle nav-dropdown-toggle" aria-label="Change language"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></button><div class="nav-dropdown-menu lang-dropdown-menu" role="menu"><button class="lang-option active" data-lang="en" role="menuitem"><span class="flag">🇺🇸</span> English</button><button class="lang-option" data-lang="ar" role="menuitem"><span class="flag">🇸🇦</span> العربية</button><button class="lang-option" data-lang="he" role="menuitem"><span class="flag">🇮🇱</span> עברית</button></div></div>`;
    
    if (content.includes(searchString)) {
      content = content.replace(searchString, replacement);
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file}`);
    } else {
        console.log(`File ${file} has id="lang-dropdown" but string didn't match perfectly. Using regex...`);
        // using a lazy match to get the div
        const replaced = content.replace(/<div class="lang-dropdown nav-dropdown" id="lang-dropdown">[\s\S]*?<\/div><\/div>/, replacement);
        fs.writeFileSync(filePath, replaced);
    }
  }
}
console.log('Done');
