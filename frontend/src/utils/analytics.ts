/**
 * Plausible analytics helper.
 *
 * Tracks only interaction events — no file content, no file sizes,
 * no personally identifiable information. GDPR compliant.
 *
 * Plausible is loaded as a script tag in index.html. This utility
 * wraps the global `window.plausible` function safely so it never
 * throws when Plausible is blocked by an ad blocker.
 */

type PlausibleFn = (event: string, options?: { props?: Record<string, string> }) => void

declare global {
  interface Window {
    plausible?: PlausibleFn
  }
}

/**
 * Send a custom event to Plausible.
 * Silently no-ops if Plausible is not loaded (blocked, dev mode, etc.).
 */
export function trackEvent(
  name: string,
  props?: Record<string, string>,
): void {
  try {
    window.plausible?.(name, props ? { props } : undefined)
  } catch {
    // Never let analytics errors surface to the user
  }
}

// ── Typed event helpers ────────────────────────────────────────────────────

/** Fired when the user clicks "Compress File". */
export function trackCompressStart(fileType: string, mode: string): void {
  trackEvent('Compress Start', { file_type: fileType, mode })
}

/** Fired when compression completes successfully. */
export function trackCompressSuccess(fileType: string, source: 'browser' | 'server'): void {
  trackEvent('Compress Success', { file_type: fileType, source })
}

/** Fired when compression fails with an error. */
export function trackCompressError(fileType: string): void {
  trackEvent('Compress Error', { file_type: fileType })
}

/** Fired when the user clicks "Download". */
export function trackDownload(fileType: string): void {
  trackEvent('Download', { file_type: fileType })
}
