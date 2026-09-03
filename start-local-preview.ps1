# start-local-preview.ps1
# Local preview for the blog: serves the repo root so that root-relative
# links (/styles/main.css, /archives, /posts/...) resolve correctly.
# Usage:  powershell -ExecutionPolicy Bypass -File start-local-preview.ps1 [-Port 8123]
param([int]$Port = 8123)
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
if (-not (Test-Path (Join-Path $root 'index.html'))) {
  throw 'start-local-preview.ps1 must stay in the site root'
}
$runner = $null
foreach ($cand in @('python', 'py', 'python3')) {
  if (Get-Command $cand -ErrorAction SilentlyContinue) { $runner = $cand; break }
}
if (-not $runner) {
  Write-Host 'No Python found. Install Python or run:  npx --yes serve .  (from the site root)'
  exit 1
}
Write-Host "Serving site at http://127.0.0.1:$Port/  (Ctrl+C to stop)"
Push-Location $root
try {
  if ($runner -eq 'py') {
    & py -m http.server $Port
  } else {
    & $runner -m http.server $Port
  }
} finally {
  Pop-Location
}
