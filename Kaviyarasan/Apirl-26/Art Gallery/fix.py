import os
import glob
import re

html_files = glob.glob('pages/*.html') + ['index.html']
css_file = 'assets/css/style.css'

# Update CSS
with open(css_file, 'r', encoding='utf-8') as f:
    css_content = f.read()

css_content = css_content.replace('animation: kenBurns 20s ease infinite alternate;', '/* animation removed */')
css_content = css_content.replace('.hero-slider__slide.active { opacity: 1; position: relative; }', '.hero-slider__slide.active { opacity: 1; z-index: 1; position: absolute; }')
css_content = css_content.replace('.hero-slider { position: relative; }', '.hero-slider { position: relative; min-height: 100vh; }')

if '.h-scroll' not in css_content:
    css_content += '''
/* --- HORIZONTAL SCROLL FIX --- */
.h-scroll {
  display: flex;
  overflow-x: auto;
  gap: var(--space-4);
  padding-bottom: var(--space-2);
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}
.h-scroll > * {
  scroll-snap-align: start;
  flex-shrink: 0;
}
@media (max-width: 768px) {
  .section { padding-block: 3rem; }
  .grid { gap: var(--space-3); }
  .navbar__inner { padding-inline: var(--space-2); }
  .container { padding-inline: var(--space-2); overflow-x: hidden; }
}
'''
with open(css_file, 'w', encoding='utf-8') as f:
    f.write(css_content)

# Regex to find contact link and insert dashboard dropdown
desktop_repl = r'\1\n        <div class="navbar__dropdown"><a href="#" class="navbar__link navbar__dropdown-trigger" aria-expanded="false">Dashboard <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a><div class="navbar__dropdown-menu" role="menu"><a href="dashboard.html" class="navbar__dropdown-item" role="menuitem">User Dashboard</a><a href="dashboard.html#admin" class="navbar__dropdown-item" role="menuitem">Admin Dashboard</a></div></div>'
mobile_repl = r'<a href="dashboard.html" class="navbar__link">User Dashboard</a>\n      <a href="dashboard.html#admin" class="navbar__link">Admin Dashboard</a>\n      \1'

for file in html_files:
    if not os.path.isfile(file):
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove inline kenBurns
    content = content.replace('style="animation:kenBurns 25s ease infinite alternate;"', '')

    # Insert Desktop Dashboard Dropdown after Contact
    if 'Admin Dashboard' not in content and 'navbar__links' in content:
        content = re.sub(r'(<a href="contact\.html" class="navbar__link[^"]*">Contact</a>)', desktop_repl, content)

    # Insert Mobile Dashboard Dropdown before <div style="display:flex;gap:12px;margin-top:16px;">
    if 'Admin Dashboard' not in content and 'navbar__mobile-menu' in content:
        content = re.sub(r'(<div style="display:flex;gap:12px;margin-top:16px;">)', mobile_repl, content)

    # Also for auth pages (no theme/rtl toggler, but has login button)
    if 'Admin Dashboard' not in content and 'navbar__mobile-menu' in content:
        content = re.sub(r'(<a href="login\.html" class="btn btn--primary"[^>]*>Login</a>)', mobile_repl, content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("Done Phase 3")
