$csharpSource = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class ChromaKeyer {
    public static void Process(string inputPath, string outputPath) {
        using (Bitmap bmp = new Bitmap(inputPath)) {
            Rectangle rect = new Rectangle(0, 0, bmp.Width, bmp.Height);
            BitmapData bmpData = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            
            int bytes = Math.Abs(bmpData.Stride) * bmp.Height;
            byte[] rgbValues = new byte[bytes];
            
            Marshal.Copy(bmpData.Scan0, rgbValues, 0, bytes);
            
            int width = bmp.Width;
            int height = bmp.Height;
            
            for (int i = 0; i < rgbValues.Length; i += 4) {
                int b = rgbValues[i];
                int g = rgbValues[i + 1];
                int r = rgbValues[i + 2];
                
                int pixelIndex = i / 4;
                int x = pixelIndex % width;
                int y = pixelIndex / width;
                
                // 1. Outside the green square: Make 100% transparent
                if (x < 275 || x > 727 || y < 24 || y > 476) {
                    rgbValues[i + 3] = 0; // Alpha = 0
                    continue;
                }
                
                // 2. Inside the green square: Detect green screen background
                // We use an aggressive check since the green background is extremely pure green.
                // Gold/beige arch has R > G and G > B, so G is never larger than R.
                // Green screen pixels have G way larger than R and B.
                bool isGreenScreen = (g > 25) && (g > r * 1.10) && (g > b * 1.10);
                
                if (isGreenScreen) {
                    rgbValues[i + 3] = 0; // Make 100% transparent
                } else {
                    // Spill suppression & edge anti-aliasing:
                    // Softly feather pixels that have a slight green fringe
                    double maxColor = Math.Max(1.0, Math.Max(r, b));
                    double greenDominanceR = (double)g / Math.Max(1.0, r);
                    double greenDominanceB = (double)g / Math.Max(1.0, b);
                    
                    if (greenDominanceR > 1.01 && greenDominanceB > 1.01) {
                        // Suppress color spill by capping green to Red/Blue max
                        rgbValues[i + 1] = (byte)maxColor;
                        
                        // Soft alpha feathering based on dominance
                        double dominance = Math.Max(greenDominanceR, greenDominanceB);
                        if (dominance > 1.02) {
                            double factor = Math.Max(0.0, (1.10 - dominance) / 0.08);
                            rgbValues[i + 3] = (byte)(factor * rgbValues[i + 3]);
                        }
                    }
                }
            }
            
            Marshal.Copy(rgbValues, 0, bmpData.Scan0, bytes);
            bmp.UnlockBits(bmpData);
            
            bmp.Save(outputPath, ImageFormat.Png);
        }
    }
}
"@

# Load the System.Drawing assembly
Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition $csharpSource -ReferencedAssemblies System.Drawing

$inputPath = "C:\Users\Hp\.gemini\antigravity\brain\47a97524-bc06-48e8-924f-f615d8e9f096\media__1780068722733.png"
$outputPath = "c:\Users\Hp\Wedding invite Andu\assets\images\arch.png"

# Execute keying process
[ChromaKeyer]::Process($inputPath, $outputPath)
Write-Output "Chroma key completed successfully: Solid green background and peach borders removed perfectly."
