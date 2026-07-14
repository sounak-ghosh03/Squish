import { formatBytes } from '@/utils/formatBytes'
import type { CompressionSource } from '@/types'

interface ResultPanelProps {
  fileName: string
  originalSize: number
  compressedSize: number
  savings: number
  compressedBlob: Blob
  source: CompressionSource
  isDark: boolean
  onReset: () => void
  onDownload?: () => void
  /** When set (resize mode), shows output px dimensions instead of savings badge */
  resizeDimensions?: { w: number; h: number }
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `squished_${fileName}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function SavingsBadge({ savings }: { savings: number }) {
  if (savings > 20) {
    return <span className="badge badge-green">✓ Saved {savings}%</span>
  }
  if (savings > 0) {
    return <span className="badge badge-yellow">⚡ Saved {savings}%</span>
  }
  return <span className="badge badge-red">⚠ No savings</span>
}

function PrivacyBadge({ source, isDark }: { source: CompressionSource; isDark: boolean }) {
  const isBrowser = source === 'browser'
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        fontSize: '0.75rem',
        fontWeight: 500,
        padding: '0.3125rem 0.6875rem',
        borderRadius: '9999px',
        backgroundColor: isBrowser
          ? isDark ? 'rgba(20,83,45,0.3)' : '#dcfce7'
          : isDark ? 'rgba(30,58,138,0.3)' : '#eff6ff',
        color: isBrowser
          ? isDark ? '#86efac' : '#166534'
          : isDark ? '#93c5fd' : '#1e40af',
        border: `1px solid ${isBrowser
            ? isDark ? 'rgba(134,239,172,0.2)' : '#bbf7d0'
            : isDark ? 'rgba(147,197,253,0.2)' : '#bfdbfe'
          }`,
      }}
    >
      {isBrowser ? '🔒' : '🛡️'}
      {isBrowser
        ? 'Compressed in your browser — file never uploaded'
        : 'Processed on server, deleted immediately'}
    </div>
  )
}

export function ResultPanel({
  fileName,
  originalSize,
  compressedSize,
  savings,
  compressedBlob,
  source,
  isDark,
  onReset,
  onDownload,
  resizeDimensions,
}: ResultPanelProps) {
  const isLarger = compressedSize >= originalSize

  const statBoxStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    padding: '1rem',
    borderRadius: '0.75rem',
    backgroundColor: isDark ? '#1f2937' : '#f9fafb',
    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
  }

  return (
    <div className="card animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#f3f4f6' : '#111827', margin: 0 }}>
          Result
        </h2>
        {resizeDimensions ? (
          <span style={{
            fontSize: '0.8125rem', fontWeight: 700, padding: '0.25rem 0.625rem',
            borderRadius: '9999px', backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
            color: '#6366f1',
          }}>
            {resizeDimensions.w} × {resizeDimensions.h} px
          </span>
        ) : (
          <SavingsBadge savings={savings} />
        )}
      </div>

      {/* Size stats */}
      <div id="result-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={statBoxStyle}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: isDark ? '#6b7280' : '#9ca3af' }}>
            Original
          </span>
          <span style={{ fontSize: '1.375rem', fontWeight: 700, color: isDark ? '#f3f4f6' : '#111827', lineHeight: 1.2 }}>
            {formatBytes(originalSize)}
          </span>
        </div>

        <div style={statBoxStyle}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: isDark ? '#6b7280' : '#9ca3af' }}>
            Compressed
          </span>
          <span style={{ fontSize: '1.375rem', fontWeight: 700, color: savings > 0 ? '#22c55e' : '#ef4444', lineHeight: 1.2 }}>
            {formatBytes(compressedSize)}
          </span>
        </div>
      </div>

      {/* Size bar visualization */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <div style={{ height: '6px', borderRadius: '9999px', backgroundColor: isDark ? '#374151' : '#e5e7eb', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: isLarger ? '100%' : `${100 - savings}%`,
              background: savings > 20
                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                : savings > 0
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
              borderRadius: '9999px',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
        <p style={{ fontSize: '0.75rem', color: isDark ? '#6b7280' : '#9ca3af', margin: 0 }}>
          {isLarger
            ? 'Could not compress further — try lowering quality or use a different format'
            : `Reduced by ${formatBytes(originalSize - compressedSize)} (${savings}%)`}
        </p>
      </div>

      {/* Privacy badge */}
      <PrivacyBadge source={source} isDark={isDark} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
        <button
          id="download-button"
          className="btn-primary"
          style={{ flex: 1, padding: '0.6875rem' }}
          onClick={() => {
            downloadBlob(compressedBlob, fileName)
            onDownload?.()
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
        <button
          id="compress-another-button"
          className="btn-secondary"
          style={{ flex: 1, padding: '0.6875rem' }}
          onClick={onReset}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.54" />
          </svg>
          New file
        </button>
      </div>
    </div>
  )
}
