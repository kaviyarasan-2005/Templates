const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, 'pages');
const htmlFiles = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html')).map(f => path.join(PAGES_DIR, f));
htmlFiles.push(path.join(__dirname, 'index.html'));

const MOBILE_FIX_STYLE = `
  <style>
    /* Critical Mobile Fixes */
    @media (max-width: 640px) {
      .navbar__logo-suffix { display: none !important; }
      .navbar__actions .btn--primary { display: none !important; }
      .navbar__icon-btn { width: 34px !important; height: 34px !important; }
      .navbar__icon-btn svg { width: 16px !important; height: 16px !important; }
      .navbar__inner { padding-inline: 12px !important; }
      .navbar__logo { font-size: 1.05rem !important; }
      .navbar__actions { gap: 4px !important; }
      html, body { overflow-x: hidden !important; width: 100% !important; position: relative !important; }
      * { max-width: 100vw !important; }
    }
  </style>`.trim();

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Inject mobile fix style before </head>
    if (!content.includes('/* Critical Mobile Fixes */')) {
        content = content.replace('</head>', `  ${MOBILE_FIX_STYLE}\n</head>`);
    }

    // Ensure Logo structure is correct (Gallery wrapped in suffix)
    if (!content.includes('navbar__logo-suffix')) {
        content = content.replace(/<span>Aurelia<\/span>\s*Gallery/g, '<span>Aurelia</span> <span class="navbar__logo-suffix">Gallery</span>');
    }

    fs.writeFileSync(file, content, 'utf8');
});

console.log('Inlined mobile fixes and updated logo structure in all HTML files.');
