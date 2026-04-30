import os
import re

PAGES_DIR = "pages"

admin_svg_pattern = re.compile(
    r'<a href="dashboard-admin\.html">\s*<svg.*?</svg>Admin Dashboard</a>',
    re.DOTALL
)
user_svg_pattern = re.compile(
    r'<a href="dashboard-user\.html">\s*<svg.*?</svg>User Dashboard</a>',
    re.DOTALL
)

count = 0

for filename in os.listdir(PAGES_DIR):
    if filename.endswith(".html"):
        filepath = os.path.join(PAGES_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        new_content = content
        
        new_content = admin_svg_pattern.sub('<a href="dashboard-admin.html">Admin Dashboard</a>', new_content)
        new_content = user_svg_pattern.sub('<a href="dashboard-user.html">User Dashboard</a>', new_content)

        if new_content != content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {filename}")
            count += 1

print(f"Total files updated: {count}")
