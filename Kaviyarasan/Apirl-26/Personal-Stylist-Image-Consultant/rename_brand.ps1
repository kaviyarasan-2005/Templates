$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# All HTML, CSS, JS files
$files = Get-ChildItem -Path $root -Include *.html, *.css, *.js, *.json -Recurse |
         Where-Object { $_.FullName -notmatch '\\node_modules\\' }

$replacements = [ordered]@{
    # Longest / most specific first to avoid partial matches
    'Elise Laurent Image Consulting'  = 'Elise'
    'Elise Laurent Image Consultant'  = 'Elise'
    'Elise Laurent'                   = 'Elise'
    # Accented variants
    'Élise Laurent Image Consulting'  = 'Elise'
    'Élise Laurent Image Consultant'  = 'Elise'
    'Élise Laurent'                   = 'Elise'
    # Encoded variant that appeared in login.html
    'Ã‰lise Laurent'                  = 'Elise'
}

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content
    foreach ($kv in $replacements.GetEnumerator()) {
        $content = $content.Replace($kv.Key, $kv.Value)
    }
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "`nDone. Brand name changed to 'Elise' across all files."
