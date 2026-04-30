import os
import re

PAGES_DIR = "pages"
target_files = ["dashboard-admin.html", "dashboard-user.html"]

header_pattern = re.compile(r'<!-- NAV \(minimal - no menu items\) -->\s*<header class="site-nav".*?</header>\s*', re.DOTALL)
main_pattern = re.compile(r'(<main class="dashboard-main"[^>]*>)')

toggles_html = """\\1
    <!-- TOGGLES -->
    <div class="dashboard-top-actions">
      <button class="nav-action-btn hide-desktop" data-sidebar-toggle aria-label="Toggle sidebar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
      <button class="nav-action-btn" data-dir-toggle aria-label="Toggle direction">RTL</button>
      <button class="nav-action-btn" data-theme-toggle aria-label="Toggle theme">
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      </button>
    </div>"""

for filename in target_files:
    filepath = os.path.join(PAGES_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # Remove header
        new_content = header_pattern.sub('', content)
        
        # We need to insert the toggles right after <main class="dashboard-main"...>
        # but only if not already inserted
        if "dashboard-top-actions" not in new_content:
            new_content = main_pattern.sub(toggles_html, new_content)

        if new_content != content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"No changes made to {filename} (maybe already done or pattern mismatch)")
