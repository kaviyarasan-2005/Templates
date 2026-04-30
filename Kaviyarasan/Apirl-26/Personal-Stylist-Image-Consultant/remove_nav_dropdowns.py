import os
import re

PAGES_DIR = "pages"

# Regex patterns for desktop dropdowns
# Matches both class="nav-link" and class="nav-link active"
desktop_services_pattern = re.compile(
    r'<li class="nav-item">\s*<button class="nav-link[^"]*">Services.*?</svg></button>\s*<div class="nav-dropdown">.*?</div>\s*</li>',
    re.DOTALL
)
desktop_blog_pattern = re.compile(
    r'<li class="nav-item">\s*<button class="nav-link[^"]*">Blog.*?</svg></button>\s*<div class="nav-dropdown">.*?</div>\s*</li>',
    re.DOTALL
)

# Regex patterns for mobile drawer dropdowns
# Matches both class="drawer-nav-link" and class="drawer-nav-link active"
mobile_services_pattern = re.compile(
    r'<div class="drawer-nav-item">\s*<div class="drawer-nav-link[^"]*" tabindex="0">Services.*?</svg></div>\s*<div class="drawer-sub">.*?</div>\s*</div>',
    re.DOTALL
)
mobile_blog_pattern = re.compile(
    r'<div class="drawer-nav-item">\s*<div class="drawer-nav-link[^"]*" tabindex="0">Blog.*?</svg></div>\s*<div class="drawer-sub">.*?</div>\s*</div>',
    re.DOTALL
)

count = 0

for filename in os.listdir(PAGES_DIR):
    if filename.endswith(".html"):
        filepath = os.path.join(PAGES_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        new_content = content
        
        # Replace desktop nav items
        # If it had 'active', we want to preserve 'active'
        def repl_desktop_services(match):
            active = ' active' if 'active' in match.group(0) else ''
            return f'<li class="nav-item"><a href="services.html" class="nav-link{active}">Services</a></li>'

        def repl_desktop_blog(match):
            active = ' active' if 'active' in match.group(0) else ''
            return f'<li class="nav-item"><a href="blog.html" class="nav-link{active}">Blog</a></li>'

        new_content = desktop_services_pattern.sub(repl_desktop_services, new_content)
        new_content = desktop_blog_pattern.sub(repl_desktop_blog, new_content)

        # Replace mobile drawer nav items
        def repl_mobile_services(match):
            active = ' active' if 'active' in match.group(0) else ''
            return f'<div class="drawer-nav-item"><a href="services.html" class="drawer-nav-link{active}">Services</a></div>'

        def repl_mobile_blog(match):
            active = ' active' if 'active' in match.group(0) else ''
            return f'<div class="drawer-nav-item"><a href="blog.html" class="drawer-nav-link{active}">Blog</a></div>'

        new_content = mobile_services_pattern.sub(repl_mobile_services, new_content)
        new_content = mobile_blog_pattern.sub(repl_mobile_blog, new_content)

        if new_content != content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {filename}")
            count += 1

print(f"Total files updated: {count}")
