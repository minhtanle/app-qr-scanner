$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$appJsPath = Join-Path $root 'assets/js/app.js'
$swPath = Join-Path $root 'sw.js'
$indexPath = Join-Path $root 'index.html'

# Lấy version hiện tại từ app.js
$appJsContent = Get-Content -Path $appJsPath -Raw
$currentVersionMatch = [regex]::Match($appJsContent, "const buildVersion = '(\d+)\.(\d+)\.(\d+)';")

if ($currentVersionMatch.Success) {
    $major = [int]$currentVersionMatch.Groups[1].Value
    $minor = [int]$currentVersionMatch.Groups[2].Value
    $patch = [int]$currentVersionMatch.Groups[3].Value + 1
    $version = "$major.$minor.$patch"
} else {
    $version = '1.1.0'
}

# Update version trong app.js
$appJsContent = [regex]::Replace(
    $appJsContent,
    "const buildVersion = '[^']*';",
    "const buildVersion = '$version';"
)
Set-Content -Path $appJsPath -Value $appJsContent -NoNewline

# Update version trong sw.js
$swContent = Get-Content -Path $swPath -Raw
$swContent = [regex]::Replace(
    $swContent,
    "const CACHE_VERSION = '[^']*';",
    "const CACHE_VERSION = '$version';"
)
Set-Content -Path $swPath -Value $swContent -NoNewline

# Update version trong đường dẫn CSS/JS của index.html (cache busting)
$indexContent = Get-Content -Path $indexPath -Raw

# Thay thế version trong href và src
$indexContent = $indexContent -replace "(href=""./assets/css/style\.css)\?v=[^""]*", "`$1?v=$version"
$indexContent = $indexContent -replace "(src=""./assets/js/app\.js)\?v=[^""]*", "`$1?v=$version"

Set-Content -Path $indexPath -Value $indexContent -NoNewline

Write-Output "Version bumped to $version"
