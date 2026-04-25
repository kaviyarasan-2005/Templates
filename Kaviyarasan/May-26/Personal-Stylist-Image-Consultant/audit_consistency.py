import os
import re

directory = r'd:\Projects\Templates\Kaviyarasan\May-26\Personal-Stylist-Image-Consultant'
html_files = [f for f in os.listdir(directory) if f.endswith('.html') and f != 'login.html'] # login.html has different structure

logo_pattern = re.compile(r'<a href="index.html" class="site-logo".*?>')
footer_copyright_pattern = re.compile(r'© 2025 Lumière Gallery & Exhibition Space. All rights reserved.')
dropdown_home_pattern = re.compile(r'Home Page 1.*Home Page 2', re.DOTALL)

for filename in html_files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
        print(f"Checking {filename}...")
        
        # Check logo link
        if 'class="site-logo"' in content and 'href="index.html"' not in content:
            print(f"  [!] Logo link might be wrong in {filename}")
        
        # Check dropdowns (rough check)
        if 'Home Page 1' not in content:
            print(f"  [!] Home dropdown missing in {filename}")
        if 'Service Details' not in content:
            print(f"  [!] Services dropdown missing in {filename}")
        if 'Blog Details' not in content:
            print(f"  [!] Blog dropdown missing in {filename}")

        # Check footer copyright
        if '© 2025 Lumière Gallery' not in content:
            print(f"  [!] Footer copyright missing or wrong in {filename}")
        
        # Check for removed policies
        if 'Privacy Policy' in content and '<footer>' in content.split('<footer>')[-1]:
             print(f"  [!] Privacy Policy still in footer of {filename}")
