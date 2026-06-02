Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("assets\images\chandelier\frame_001.jpg")
$w = $bmp.Width
$h = $bmp.Height
Write-Host "Image size: ${w}x${h}"

# Sample corners and edges (background areas)
$positions = @(
    @(2, 2),
    @(($w-3), 2),
    @(2, ($h-3)),
    @(($w-3), ($h-3)),
    @([int]($w/2), 2),
    @(2, [int]($h/2))
)

foreach ($pos in $positions) {
    $px = $bmp.GetPixel($pos[0], $pos[1])
    $hex = '#' + $px.R.ToString('X2') + $px.G.ToString('X2') + $px.B.ToString('X2')
    Write-Host "Pixel ($($pos[0]),$($pos[1])): $hex  R=$($px.R) G=$($px.G) B=$($px.B)"
}

$bmp.Dispose()
