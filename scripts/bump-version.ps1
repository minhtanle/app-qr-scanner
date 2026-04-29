$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$appJsPath = Join-Path $root 'assets/js/app.js'
$swPath = Join-Path $root 'sw.js'

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

$appJsContent = [regex]::Replace(
    $appJsContent,
    "const buildVersion = '[^']*';",
    "const buildVersion = '$version';"
)
Set-Content -Path $appJsPath -Value $appJsContent -NoNewline

$swContent = Get-Content -Path $swPath -Raw
$swContent = [regex]::Replace(
    $swContent,
    "const CACHE_VERSION = '[^']*';",
    "const CACHE_VERSION = '$version';"
)
Set-Content -Path $swPath -Value $swContent -NoNewline

Write-Output "Version bumped to $version"
