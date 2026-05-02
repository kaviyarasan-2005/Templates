const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the footer logo blocks
  const regex = /<a href="index\.html" class="navbar__logo"[^>]*style="color:\s*#fff;"[^>]*>\s*<img src="\.\.\/assets\/images\/logo-white\.svg"[^>]*>\s*Smart<span[^>]*>Nest<\/span>\s*<\/a>/g;
  
  const replacement = <a href="index.html" class="navbar__logo" aria-label="SmartNest Home" style="color: #fff;">
          <img src="../assets/images/logo.svg" alt="SmartNest Logo" width="36" height="36" />
          Smart<span>Nest</span>
        </a>;
        
  if (regex.test(content)) {
      content = content.replace(regex, replacement);
      fs.writeFileSync(file, content);
      console.log('Updated ' + file);
  }
}
