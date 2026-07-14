import type { CompressionOptions, CompressionSource } from '@/types'
import { compressImage } from './compressImage'
import { compressPdf } from './compressPdf'
import { compressOnServer } from '@/services/compressApi'

const TEN_MB = 10 * 1024 * 1024
const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export interface RouteResult {
  blob: Blob
  source: CompressionSource
}

/** Heuristic: detect browser out-of-memory / WASM crash errors. */
function isMemoryError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase()
  return (
    msg.includes('out of memory') ||
    msg.includes('memory access out of bounds') ||
    msg.includes('unreachable') ||
    msg.includes('allocation failed') ||
    msg.includes('oom')
  )
}

export async function routeCompression(
  file: File,
  options: CompressionOptions,
): Promise<RouteResult> {
  const isLargeFile = file.size > TEN_MB
  const isDocx = file.type === DOCX_TYPE

  // ── Server path ──────────────────────────────────────────────────────────
  // Always use server for: DOCX (no browser-side compressor), large files
  if (isLargeFile || isDocx) {
    try {
      const blob = await compressOnServer(file, options)
      return { blob, source: 'server' }
    } catch (err) {
      const label = isDocx ? 'DOCX compression' : 'Files over 10 MB'
      throw new Error(
        `${label} requires the server, which is currently unavailable. ` +
        `${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }

  // ── Browser path ──────────────────────────────────────────────────────────
  try {
    if (file.type === 'application/pdf') {
      const blob = await compressPdf(file, options)
      return { blob, source: 'browser' }
    }

    if (file.type.startsWith('image/')) {
      const blob = await compressImage(file, options)
      return { blob, source: 'browser' }
    }
  } catch (err) {
    // Auto-retry on WASM/memory errors via server fallback
    if (isMemoryError(err)) {
      console.warn('Browser memory limit hit — auto-retrying via server fallback.')
      try {
        const blob = await compressOnServer(file, options)
        return { blob, source: 'server' }
      } catch (serverErr) {
        throw new Error(
          `Browser ran out of memory and the server fallback also failed: ` +
          `${serverErr instanceof Error ? serverErr.message : String(serverErr)}`,
        )
      }
    }
    // Re-throw non-memory errors as-is
    throw err
  }

  throw new Error(`Unsupported file type: ${file.type}`)
}
