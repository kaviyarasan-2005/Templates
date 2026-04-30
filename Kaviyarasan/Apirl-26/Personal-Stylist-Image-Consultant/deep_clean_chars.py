import os

PAGES_DIR = "pages"

# Define common artifacts found in the HTML files and their correct replacements
REPLACEMENTS = {
    '€-': '-',
    '€"': '-',
    '€“': '—',
    '€œ§': '✦',
    '| Œ §': '✦',
    '‰Elise': 'Élise',
    '‰': 'É',
    'Â·': '·',
    'Â©': '©',
    'ðŸ"...': '📅',
    'ðŸ ‚': '🍂',
    'ðŸ\'': '👗',
    '€œ¨': '✨',
    'ðŸ"€': '📍',
    'Ã©': 'é',
    'Ã‰': 'É',
    'Â ': ' ',
    '??': '...',
    'A ': '- ',
    '?"??"?': '—',
    '€ °': '📅',
    'ðŸ"...': '📅',
    'ðŸ"...': '📅',
    'ðŸ"...': '📅'
}

# Special case for the "Vogue Harper's Bazaa Elle" line which might be missing separators
# and other decorative separators
SPECIFIC_CLEANUPS = {
    'Vogue Harper\'s Bazaa Elle ForbesWGSN': 'Vogue · Harper\'s Bazaar · Elle · Forbes · WGSN',
    '© 2026 Elise.': '© 2026 Elise Laurent.',
    'Â© 2026': '© 2026'
}

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original = content
    
    # 1. Standard replacements
    for art, fix in REPLACEMENTS.items():
        content = content.replace(art, fix)
    
    # 2. Specific cleanups
    for art, fix in SPECIFIC_CLEANUPS.items():
        content = content.replace(art, fix)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

if __name__ == "__main__":
    count = 0
    for filename in os.listdir(PAGES_DIR):
        if filename.endswith(".html"):
            if clean_file(os.path.join(PAGES_DIR, filename)):
                print(f"Cleaned {filename}")
                count += 1
    print(f"Total files cleaned: {count}")
