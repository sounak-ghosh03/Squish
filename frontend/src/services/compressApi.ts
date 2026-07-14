import type { CompressionOptions } from '@/types'

const TIMEOUT_MS = 60_000 // 60 s — large files can take a while

/**
 * Send a file to the FastAPI /compress endpoint and stream the result back as a Blob.
 * The server deletes the temp file immediately after responding — zero storage.
 */
export async function compressOnServer(
  file: File,
  options: CompressionOptions,
): Promise<Blob> {
  const apiUrl = import.meta.env.VITE_API_URL

  if (!apiUrl) {
    throw new Error(
      'Server URL not configured. Set VITE_API_URL in your .env file ' +
      '(e.g. VITE_API_URL=http://localhost:8000).',
    )
  }

  const form = new FormData()
  form.append('file', file)
  form.append('mode', options.mode)
  form.append('quality', String(options.quality))
  form.append('targetSizeKB', String(options.targetSizeKB))

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(`${apiUrl}/compress`, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out — the server took too long to respond.')
    }
    throw new Error(
      `Could not reach the compression server. ` +
      `Make sure the API is running and VITE_API_URL is correct.`,
    )
  } finally {
    clearTimeout(timer)
  }

  if (!res.ok) {
    let detail = `Server error ${res.status}`
    try {
      const json = (await res.json()) as { detail?: string }
      if (json.detail) detail = json.detail
    } catch {
      // ignore JSON parse failures
    }
    throw new Error(detail)
  }

  return res.blob()
}
