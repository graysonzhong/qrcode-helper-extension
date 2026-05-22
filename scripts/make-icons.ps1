Add-Type -AssemblyName System.Drawing
$sizes = 16, 32, 48, 128
$root = Split-Path -Parent $PSScriptRoot
$iconDir = Join-Path $root "icons"
New-Item -ItemType Directory -Force -Path $iconDir | Out-Null

foreach ($s in $sizes) {
  $bmp = New-Object System.Drawing.Bitmap $s, $s
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::FromArgb(255, 36, 36, 36))

  $fontSize = [Math]::Max(8, [int]([Math]::Floor($s * 0.42)))
  $font = New-Object System.Drawing.Font ("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold)
  $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)

  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

  $rect = New-Object System.Drawing.RectangleF (0, 0, $s, $s)
  $g.DrawString("QR", $font, $brush, $rect, $sf)

  $path = Join-Path $iconDir ("icon{0}.png" -f $s)
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

  $g.Dispose()
  $bmp.Dispose()
}

Write-Host "Wrote icons to $iconDir"
