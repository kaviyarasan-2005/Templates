import os
import re

pages_dir = r'd:\Projects\Templates\Kaviyarasan\Apirl-26\personal-stylist-image-consultant\pages'

# Update components.css
css_file = r'd:\Projects\Templates\Kaviyarasan\Apirl-26\personal-stylist-image-consultant\assets\css\components.css'
with open(css_file, 'r', encoding='utf-8') as f:
    css_content = f.read()

old_css = '''.footer-brand-name {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-white);
}'''
new_css = '''.footer-brand-name {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-white);
  letter-spacing: -0.01em;
}'''

if old_css in css_content:
    css_content = css_content.replace(old_css, new_css)
    with open(css_file, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print('components.css updated')
else:
    print('Could not find exact CSS match. Searching with regex...')
    css_content = re.sub(r'\.footer-brand-name\s*\{\s*font-family:\s*var\(--font-heading\);\s*font-size:\s*var\(--text-xl\);\s*color:\s*var\(--color-white\);\s*\}', new_css, css_content)
    with open(css_file, 'w', encoding='utf-8') as f:
        f.write(css_content)

auth_pattern = re.compile(r'<div style="font-weight:700;font-size:var\(--text-base\);color:var\(--text-primary\)">Elise</div>\s*<div style="font-size:var\(--text-xs\);color:var\(--text-muted\)">Image Consultant</div>')
footer_pattern = re.compile(r'<div class="footer-brand-name">Elise</div>\s*<div class="footer-tagline">Image Consultant</div>')

for filename in os.listdir(pages_dir):
    if not filename.endswith('.html'): continue
    filepath = os.path.join(pages_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    if footer_pattern.search(content):
        content = footer_pattern.sub('<div class="footer-brand-name">Elise</div>', content)
        modified = True
    
    if auth_pattern.search(content):
        content = auth_pattern.sub('<div class="nav-logo-name">Elise</div>', content)
        modified = True
        
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filename}')

