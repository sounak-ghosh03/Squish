import imageCompression from 'browser-image-compression'
import type { CompressionOptions } from '@/types'

export async function compressImage(file: File, options: CompressionOptions): Promise<Blob> {
  const opts =
    options.mode === 'quality'
      ? {
          maxSizeMB: 100,
          initialQuality: options.quality / 100,
          useWebWorker: true,
        }
      : {
          maxSizeMB: options.targetSizeKB / 1024,
          useWebWorker: true,
        }

  const result = await imageCompression(file, opts)
  return result
}
