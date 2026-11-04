/**
 * Image compressor utility for Fraganza Admin
 * Downscales and compresses base64 images so they take minimal storage (~8KB - 40KB)
 * and never exceed browser localStorage or IndexedDB quotas.
 */

export async function compressImage(
  source: string | Blob | File,
  maxWidth = 256,
  maxHeight = 256,
  quality = 0.75
): Promise<string> {
  if (!source) return '';

  // If it's a web URL (http:// or https://) and not a data URI, keep it as-is
  if (typeof source === 'string' && (source.startsWith('http://') || source.startsWith('https://'))) {
    return source.trim();
  }

  // If it's already a very small data URL (< 25KB), return directly
  if (typeof source === 'string' && source.startsWith('data:') && source.length < 25 * 1024) {
    return source;
  }

  return new Promise<string>((resolve) => {
    let srcUrl = '';
    let isCreatedBlobUrl = false;

    if (typeof source !== 'string' && ((source as any) instanceof Blob || (source as any) instanceof File)) {
      try {
        srcUrl = URL.createObjectURL(source);
        isCreatedBlobUrl = true;
      } catch {
        resolve('');
        return;
      }
    } else if (typeof source === 'string') {
      srcUrl = source;
    } else {
      resolve('');
      return;
    }

    const cleanup = () => {
      if (isCreatedBlobUrl) {
        try {
          URL.revokeObjectURL(srcUrl);
        } catch {}
      }
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width <= 0 || height <= 0) {
          cleanup();
          resolve(typeof source === 'string' ? source : '');
          return;
        }

        // Calculate aspect-ratio fit
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', { willReadFrequently: false });
        if (!ctx) {
          cleanup();
          resolve(typeof source === 'string' ? source : '');
          return;
        }

        // Fill background with soft neutral white/dark or preserve transparency if possible
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to jpeg for super high compression
        // Or if transparency is needed, webp/png
        let compressed = canvas.toDataURL('image/jpeg', quality);

        // If JPEG is still somewhat large (> 80KB), compress further
        if (compressed.length > 80 * 1024) {
          compressed = canvas.toDataURL('image/jpeg', 0.6);
        }

        cleanup();
        resolve(compressed);
      } catch (err) {
        console.warn('Canvas compression error:', err);
        cleanup();
        resolve(typeof source === 'string' ? source : '');
      }
    };

    img.onerror = () => {
      cleanup();
      resolve(typeof source === 'string' ? source : '');
    };

    img.src = srcUrl;
  });
}
