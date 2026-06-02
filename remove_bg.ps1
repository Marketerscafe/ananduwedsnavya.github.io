$csharpSource = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class ImageProcessor {
    public static void RemoveBackground(string inputPath, string outputPath, int threshold) {
        using (Bitmap bmp = new Bitmap(inputPath)) {
            Rectangle rect = new Rectangle(0, 0, bmp.Width, bmp.Height);
            BitmapData bmpData = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            
            int bytes = Math.Abs(bmpData.Stride) * bmp.Height;
            byte[] rgbValues = new byte[bytes];
            
            Marshal.Copy(bmpData.Scan0, rgbValues, 0, bytes);
            
            // Sample background color from top-left corner pixel (0, 0)
            int bgB = rgbValues[0];
            int bgG = rgbValues[1];
            int bgR = rgbValues[2];
            
            for (int i = 0; i < rgbValues.Length; i += 4) {
                int b = rgbValues[i];
                int g = rgbValues[i + 1];
                int r = rgbValues[i + 2];
                
                // Calculate distance in RGB space
                double dist = Math.Sqrt((r - bgR) * (r - bgR) + (g - bgG) * (g - bgG) + (b - bgB) * (b - bgB));
                
                if (dist < threshold) {
                    rgbValues[i + 3] = 0; // Transparent
                } else if (dist < threshold + 20) {
                    // Soft feathering edge for clean borders
                    double factor = (dist - threshold) / 20.0;
                    rgbValues[i + 3] = (byte)(factor * 255);
                }
            }
            
            Marshal.Copy(rgbValues, 0, bmpData.Scan0, bytes);
            bmp.UnlockBits(bmpData);
            
            bmp.Save(outputPath, ImageFormat.Png);
        }
    }
}
"@

# Load the required System.Drawing assembly
Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition $csharpSource -ReferencedAssemblies System.Drawing

$inputPath = "C:\Users\Hp\.gemini\antigravity\brain\47a97524-bc06-48e8-924f-f615d8e9f096\media__1780066618803.png"
$outputPath = "c:\Users\Hp\Wedding invite Andu\assets\images\arch.png"

# Ensure assets/images directory exists
New-Item -ItemType Directory -Force -Path "c:\Users\Hp\Wedding invite Andu\assets\images" | Out-Null

# Run the high-speed background remover with a distance threshold of 28
[ImageProcessor]::RemoveBackground($inputPath, $outputPath, 28)
Write-Output "Background removed successfully and saved to assets/images/arch.png"
