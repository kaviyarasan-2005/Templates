const fs = require('fs');
const glob = require('fs').readdirSync('pages').filter(f => f.endsWith('.html')).map(f => 'pages/' + f);
glob.push('index.html');

glob.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace User Dashboard link
    content = content.replace(/<a href="dashboard\.html" class="navbar__dropdown-item" role="menuitem">User Dashboard<\/a>/g, '<a href="dashboard.html#user" class="navbar__dropdown-item" role="menuitem">User Dashboard</a>');
    content = content.replace(/<a href="dashboard\.html" class="navbar__link"[^>]*>User Dashboard<\/a>/g, '<a href="dashboard.html#user" class="navbar__link">User Dashboard</a>');
    
    // Ensure Admin Dashboard link has #admin
    content = content.replace(/<a href="dashboard\.html#admin" class="navbar__dropdown-item" role="menuitem">Admin Dashboard<\/a>/g, '<a href="dashboard.html#admin" class="navbar__dropdown-item" role="menuitem">Admin Dashboard</a>');
    content = content.replace(/<a href="dashboard\.html#admin" class="navbar__link"[^>]*>Admin Dashboard<\/a>/g, '<a href="dashboard.html#admin" class="navbar__link">Admin Dashboard</a>');

    // Also fix any potential duplicates from previous runs if they aren't caught
    // Clean up visibility styles that might have been hardcoded
    content = content.replace(/style="visibility:visible;opacity:1;transform:none;"/g, '');

    fs.writeFileSync(file, content, 'utf8');
});
console.log("Updated all HTML files with hash links");
