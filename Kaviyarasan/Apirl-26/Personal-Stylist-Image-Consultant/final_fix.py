import os
import re

filepath = r'd:\Projects\Templates\Kaviyarasan\Apirl-26\personal-stylist-image-consultant\assets\css\dashboard.css'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix Sidebar Top and Height (more robust regex)
content = re.sub(r'(\.dashboard-sidebar\s*\{[^}]*top:\s*)var\(--nav-height\)(;[^}]*height:\s*)calc\(100vh\s*-\s*var\(--nav-height\)\)', r'\1 0\2 100vh', content)

# 2. Ensure dashboard-layout has no padding-top on tablet
content = re.sub(r'(\.dashboard-layout\s*\{\s*padding-top:\s*)[^;]+(;)', r'\1 0\2', content)

# 3. Ensure dashboard-main has no top padding on mobile
content = re.sub(r'(\.dashboard-main\s*\{\s*padding:\s*)\d+px(\s+var\(--space-2\)\s+var\(--space-3\)\s*!important;)', r'\1 0\2', content)
content = re.sub(r'(\.dashboard-main\s*\{\s*padding:\s*)\d+px(\s+8px\s+12px\s*!important;)', r'\1 0\2', content)

# 4. Explicitly add a global override just in case
if '/* Global Top Gap Fix */' not in content:
    content += '''
/* Global Top Gap Fix */
@media (max-width: 1024px) {
  .dashboard-layout, body { padding-top: 0 !important; margin-top: 0 !important; }
  .dashboard-sidebar { top: 0 !important; height: 100vh !important; }
  .dashboard-main { padding-top: 0 !important; }
  .admin-banner, .user-hero { margin-top: 0 !important; }
}
'''

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Sidebar and dashboard height fixed globally")
