$ErrorActionPreference = 'Stop'

function Fix-File($filePath) {
    Write-Host "Fixing $filePath"
    $content = Get-Content $filePath -Raw
    
    # Use regex to find the button and replace its inner content
    # This regex is more specific to avoid matching other things
    $regex = '(<button[^>]*data-dir-toggle[^>]*>).*?(</button>)'
    if ($content -match $regex) {
        $newContent = [regex]::Replace($content, $regex, '$1RTL$2', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        [System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "Updated RTL toggle in $filePath"
    } else {
        Write-Host "No RTL toggle found in $filePath"
    }
}

# List of files to fix (excluding index.html which I'll handle separately or just run on all)
$files = Get-ChildItem -Path pages -Filter *.html -Recurse

foreach ($file in $files) {
    try {
        Fix-File $file.FullName
    } catch {
        Write-Error "Failed to fix $($file.FullName): $($_.Exception.Message)"
    }
}
