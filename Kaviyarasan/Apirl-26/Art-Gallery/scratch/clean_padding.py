import os
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match the specific padding-inline override for .navbar__inner
    # This covers cases with 12px, 16px etc.
    pattern = r'\.navbar__inner\s*{\s*padding-inline:\s*\d+px\s*!important;\s*}'
    
    new_content = re.sub(pattern, '', content)
    
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned: {filepath}")
    else:
        print(f"No changes: {filepath}")

# Clean index.html
clean_file('index.html')

# Clean files in pages directory
pages_dir = 'pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.html'):
        clean_file(os.path.join(pages_dir, filename))
