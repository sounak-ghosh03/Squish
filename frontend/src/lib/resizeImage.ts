import type { ResizeOptions, OutputFormat } from '@/types'
import { toPx } from '@/lib/unitConvert'

/**
 * Returns the natural pixel dimensions of an image File.
 */
export function getImageDimensions(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image dimensions.'))
    }
    img.src = url
  })
}

/**
 * Resolves the output MIME type.
 * 'match' → keep the original file type (falls back to image/jpeg for unknown types).
 */
function resolveFormat(outputFormat: OutputFormat, file: File): string {
  if (outputFormat === 'match') {
    const t = file.type
    if (t === 'image/jpeg' || t === 'image/png' || t === 'image/webp') return t
    return 'image/jpeg'
  }
  return outputFormat
}

/**
 * Resizes an image File according to the given ResizeOptions.
 * All rendering is done in-browser via a canvas — nothing is uploaded.
 */
export function resizeImage(file: File, options: ResizeOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)

      try {
        const targetW = toPx(options.width, options.unit, options.dpi)
        const targetH = toPx(options.height, options.unit, options.dpi)

        if (targetW <= 0 || targetH <= 0) {
          reject(new Error('Target dimensions must be greater than zero.'))
          return
        }

        const canvas = document.createElement('canvas')
        canvas.width  = targetW
        canvas.height = targetH

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not obtain 2D canvas context.'))
          return
        }

        // Use high-quality downscaling
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, targetW, targetH)

        const mime = resolveFormat(options.outputFormat, file)
        // For JPEG use quality 0.92, others use lossless defaults
        const quality = mime === 'image/jpeg' ? 0.92 : undefined

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Canvas failed to produce a Blob.'))
            }
          },
          mime,
          quality,
        )
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Resize failed.'))
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not load image for resizing.'))
    }

    img.src = url
  })
}
