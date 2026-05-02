import os

filepath = r'd:\Projects\Templates\Kaviyarasan\Apirl-26\personal-stylist-image-consultant\assets\css\dashboard.css'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the mobile sidebar top offset and height
old_sidebar = '''    .dashboard-sidebar {
      position: fixed;
      inset-inline-start: -260px;
      top: var(--nav-height);
      z-index: var(--z-fixed);
      transition: inset-inline-start var(--transition-slow);
      height: calc(100vh - var(--nav-height));'''

new_sidebar = '''    .dashboard-sidebar {
      position: fixed;
      inset-inline-start: -260px;
      top: 0;
      z-index: var(--z-fixed);
      transition: inset-inline-start var(--transition-slow);
      height: 100vh;'''

content = content.replace(old_sidebar, new_sidebar)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Sidebar fixed")
