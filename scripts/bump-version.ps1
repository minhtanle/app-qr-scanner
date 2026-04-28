$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$indexPath = Join-Path $root 'index.html'
$swPath = Join-Path $root 'sw.js'

$indexContent = Get-Content -Path $indexPath -Raw

$currentVersionMatch = [regex]::Match($indexContent, "const buildVersion = '(\d+)\.(\d+)\.(\d+)';")
if ($currentVersionMatch.Success) {
    $major = [int]$currentVersionMatch.Groups[1].Value
    $minor = [int]$currentVersionMatch.Groups[2].Value
    $patch = [int]$currentVersionMatch.Groups[3].Value + 1
    $version = "$major.$minor.$patch"
} else {
    $version = '1.0.1'
}

$indexContent = [regex]::Replace(
    $indexContent,
    "const buildVersion = '[^']*';",
    "const buildVersion = '$version';"
)
Set-Content -Path $indexPath -Value $indexContent -NoNewline

$swContent = Get-Content -Path $swPath -Raw
$swContent = [regex]::Replace(
    $swContent,
    "const CACHE_NAME = 'qr-scan-pro-v[^']*';",
    "const CACHE_NAME = 'qr-scan-pro-v$version';"
)
Set-Content -Path $swPath -Value $swContent -NoNewline

Write-Output "Version bumped to $version"
