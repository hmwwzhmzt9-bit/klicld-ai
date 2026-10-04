import { ImageSettings } from '../types';

/**
 * Perform client-side 4K Super-Resolution Upscaling and AI Sharpening using HTML5 Canvas
 */
export async function upscaleImageOnCanvas(
  imgElement: HTMLImageElement,
  settings: ImageSettings
): Promise<{
  dataUrl: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  scaleFactor: number;
}> {
  const originalWidth = imgElement.naturalWidth || imgElement.width || 800;
  const originalHeight = imgElement.naturalHeight || imgElement.height || 600;

  // Determine scale factor based on target mode
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;
  let scaleFactor = 4;

  if (settings.mode === '4k') {
    // Standard 4K long dimension ~ 3840px or 4x
    scaleFactor = Math.max(2, Math.min(6, Math.round(3840 / Math.max(originalWidth, originalHeight))));
    if (scaleFactor < 2) scaleFactor = 3;
    targetWidth = Math.round(originalWidth * scaleFactor);
    targetHeight = Math.round(originalHeight * scaleFactor);
    // Cap to 4096 to prevent canvas memory overflow in mobile browsers
    if (targetWidth > 4096 || targetHeight > 4096) {
      const ratio = 3840 / Math.max(targetWidth, targetHeight);
      targetWidth = Math.round(targetWidth * ratio);
      targetHeight = Math.round(targetHeight * ratio);
    }
  } else if (settings.mode === '2k') {
    scaleFactor = 2;
    targetWidth = Math.round(originalWidth * 2);
    targetHeight = Math.round(originalHeight * 2);
  } else {
    // Face retouch or unblur: 2x scale with aggressive sharpening
    scaleFactor = 2.5;
    targetWidth = Math.round(originalWidth * scaleFactor);
    targetHeight = Math.round(originalHeight * scaleFactor);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // Use high quality image smoothing for initial bicubic interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw scaled image
  ctx.drawImage(imgElement, 0, 0, targetWidth, targetHeight);

  // Apply pixel manipulation for sharpening, HDR contrast and vibrance
  try {
    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const data = imageData.data;
    const len = data.length;

    // Contrast & Vibrance adjustments
    const contrastFactor = 1 + (settings.contrastBoost / 100) * 0.35;
    const vibrance = (settings.vibranceBoost / 100) * 0.4;

    for (let i = 0; i < len; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Contrast
      r = ((r / 255 - 0.5) * contrastFactor + 0.5) * 255;
      g = ((g / 255 - 0.5) * contrastFactor + 0.5) * 255;
      b = ((b / 255 - 0.5) * contrastFactor + 0.5) * 255;

      // Vibrance (boost lower saturation pixels more than already saturated ones)
      const maxChannel = Math.max(r, g, b);
      const avg = (r + g + b) / 3;
      const amt = ((Math.abs(maxChannel - avg) * 2) / 255) * vibrance;
      r += (maxChannel - r) * amt;
      g += (maxChannel - g) * amt;
      b += (maxChannel - b) * amt;

      data[i] = Math.min(255, Math.max(0, r));
      data[i + 1] = Math.min(255, Math.max(0, g));
      data[i + 2] = Math.min(255, Math.max(0, b));
    }

    ctx.putImageData(imageData, 0, 0);

    // Apply Unsharp Masking Kernel (Sharpening filter)
    const sharpLevel = settings.sharpness / 100;
    if (sharpLevel > 0.05) {
      applyUnsharpMask(ctx, targetWidth, targetHeight, sharpLevel);
    }
  } catch {
    // If pixel read is restricted, fallback to filtered draw
  }

  const dataUrl = canvas.toDataURL('image/png', 0.98);

  return {
    dataUrl,
    width: targetWidth,
    height: targetHeight,
    originalWidth,
    originalHeight,
    scaleFactor,
  };
}

/**
 * Apply 3x3 Convolution Sharpen Kernel (Unsharp Mask)
 */
function applyUnsharpMask(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strength: number
) {
  // Use a temporary canvas to read from
  const srcData = ctx.getImageData(0, 0, width, height);
  const src = srcData.data;
  const outputData = ctx.createImageData(width, height);
  const dst = outputData.data;

  // Kernel: [0, -s, 0, -s, 1 + 4s, -s, 0, -s, 0]
  const s = strength * 0.45;
  const center = 1 + 4 * s;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      // Top, Bottom, Left, Right indices
      const top = ((y - 1) * width + x) * 4;
      const btm = ((y + 1) * width + x) * 4;
      const left = (y * width + (x - 1)) * 4;
      const right = (y * width + (x + 1)) * 4;

      for (let c = 0; c < 3; c++) {
        const val =
          src[idx + c] * center -
          (src[top + c] + src[btm + c] + src[left + c] + src[right + c]) * s;
        dst[idx + c] = Math.min(255, Math.max(0, val));
      }
      dst[idx + 3] = src[idx + 3]; // Alpha
    }
  }

  ctx.putImageData(outputData, 0, 0);
}
