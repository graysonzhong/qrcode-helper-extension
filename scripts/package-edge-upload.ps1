# Package Edge upload zip (fixed name). Run from repo root bat or cd extension then run this.
$ErrorActionPreference = 'Stop'

# extension/ (parent of scripts/)
$ExtensionRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$RepoRoot      = (Resolve-Path (Join-Path $ExtensionRoot '..')).Path
Set-Location -LiteralPath $ExtensionRoot

$zipName = 'xinyi-qrcode-edge-upload.zip'
$zipPath = Join-Path $RepoRoot $zipName

Write-Host "Extension root: $ExtensionRoot"
Write-Host "Zip output:       $zipPath"
Write-Host "Running npm run build (esbuild minify)..."
npm run build
if ($LASTEXITCODE -ne 0) { throw "npm run build failed, exit code $LASTEXITCODE" }

$need = @(
  (Join-Path $ExtensionRoot 'manifest.json'),
  (Join-Path $ExtensionRoot 'popup.html'),
  (Join-Path $ExtensionRoot 'popup.css'),
  (Join-Path $ExtensionRoot 'dist\popup.js')
)
foreach ($p in $need) {
  if (-not (Test-Path -LiteralPath $p)) { throw "Missing file: $p" }
}
$iconsDir = Join-Path $ExtensionRoot 'icons'
if (-not (Test-Path -LiteralPath $iconsDir)) { throw "Missing folder: icons" }
$localesDir = Join-Path $ExtensionRoot '_locales'
if (-not (Test-Path -LiteralPath $localesDir)) { throw "Missing folder: _locales" }
$extAssetsDir = Join-Path $ExtensionRoot 'extension-assets'
if (-not (Test-Path -LiteralPath $extAssetsDir)) { throw "Missing folder: extension-assets (contact QR SVGs)" }

$licenseFile = Join-Path $ExtensionRoot 'LICENSE'
if (-not (Test-Path -LiteralPath $licenseFile)) { throw "Missing file: LICENSE" }

if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }

Compress-Archive -Path @(
  (Join-Path $ExtensionRoot 'manifest.json'),
  (Join-Path $ExtensionRoot 'popup.html'),
  (Join-Path $ExtensionRoot 'popup.css'),
  (Join-Path $ExtensionRoot 'LICENSE'),
  (Join-Path $ExtensionRoot 'dist'),
  (Join-Path $ExtensionRoot 'icons'),
  (Join-Path $ExtensionRoot '_locales'),
  (Join-Path $ExtensionRoot 'extension-assets')
) -DestinationPath $zipPath -CompressionLevel Optimal -Force

Write-Host ""
Write-Host "Done: $zipPath"
Write-Host "Upload this zip to Partner Center."
