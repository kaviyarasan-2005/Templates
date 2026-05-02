import os
import re

directory = '.'
count = 0

pattern = re.compile(r'<a href="index\.html" class="navbar__logo"[^>]*style="color:\s*#fff;"[^>]*>\s*<img src="\.\./assets/images/logo-white\.svg"[^>]*>\s*Smart<span[^>]*>Nest</span>\s*</a>', re.DOTALL)

replacement = '''<a href="index.html" class="navbar__logo" aria-label="SmartNest Home" style="color: #fff;">
          <img src="../assets/images/logo.svg" alt="SmartNest Logo" width="36" height="36" />
          Smart<span>Nest</span>
        </a>'''

for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if pattern.search(content):
            new_content = pattern.sub(replacement, content)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {filename}')
            count += 1

print(f'Total updated: {count}')
