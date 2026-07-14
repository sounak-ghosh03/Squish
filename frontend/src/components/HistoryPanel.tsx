import { useState, useEffect } from 'react'
import { formatBytes } from '@/utils/formatBytes'

const STORAGE_KEY = 'squish_compress_history'
const MAX_ENTRIES = 5

export interface HistoryEntry {
  id: string
  fileName: string
  originalSize: number
  compressedSize: number
  savings: number
  source: 'browser' | 'server'
  timestamp: number
}

/** Save a new entry to the history (trims to MAX_ENTRIES). */
export function addHistoryEntry(entry: Omit<HistoryEntry, 'id'>): void {
  try {
    const existing = loadHistory()
    const next: HistoryEntry = { ...entry, id: `${Date.now()}-${Math.random()}` }
    const updated = [next, ...existing].slice(0, MAX_ENTRIES)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // ignore storage errors
  }
}

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

interface HistoryPanelProps {
  isDark: boolean
  /** Re-render trigger — pass a counter that increments each time a new compression finishes */
  refreshKey?: number
}

export function HistoryPanel({ isDark, refreshKey }: HistoryPanelProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setEntries(loadHistory())
  }, [refreshKey])

  if (entries.length === 0) return null

  function handleClear() {
    clearHistory()
    setEntries([])
  }

  const borderColor = isDark ? '#1f2937' : '#e5e7eb'
  const bgColor = isDark ? '#111827' : '#ffffff'
  const labelColor = isDark ? '#6b7280' : '#9ca3af'
  const textColor = isDark ? '#f3f4f6' : '#111827'
  const subColor = isDark ? '#9ca3af' : '#6b7280'

  return (
    <div
      id="history-panel"
      style={{
        border: `1px solid ${borderColor}`,
        borderRadius: '1rem',
        overflow: 'hidden',
        backgroundColor: bgColor,
        transition: 'background-color 250ms, border-color 250ms',
      }}
    >
      {/* Collapsible header */}
      <button
        id="history-toggle"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1.25rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: textColor,
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.54" />
          </svg>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Recent Compressions</span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
              color: labelColor,
            }}
          >
            {entries.length}
          </span>
        </div>

        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Entries list */}
      {open && (
        <div className="animate-fade-in">
          <div style={{ borderTop: `1px solid ${borderColor}` }}>
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  borderTop: i > 0 ? `1px solid ${borderColor}` : undefined,
                  alignItems: 'center',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: textColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.fileName}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: subColor }}>
                    {formatBytes(entry.originalSize)} → {formatBytes(entry.compressedSize)}
                    {' · '}
                    {entry.source === 'browser' ? '🔒 browser' : '🛡️ server'}
                    {' · '}
                    {timeAgo(entry.timestamp)}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: entry.savings > 20
                      ? isDark ? 'rgba(20,83,45,0.4)' : '#dcfce7'
                      : entry.savings > 0
                      ? isDark ? 'rgba(113,63,18,0.4)' : '#fef9c3'
                      : isDark ? 'rgba(127,29,29,0.4)' : '#fee2e2',
                    color: entry.savings > 20
                      ? isDark ? '#86efac' : '#166534'
                      : entry.savings > 0
                      ? isDark ? '#fde047' : '#854d0e'
                      : isDark ? '#fca5a5' : '#991b1b',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.savings > 0 ? `−${entry.savings}%` : 'No savings'}
                </span>
              </div>
            ))}
          </div>

          {/* Clear button */}
          <div style={{ padding: '0.625rem 1.25rem', borderTop: `1px solid ${borderColor}`, textAlign: 'right' }}>
            <button
              id="history-clear"
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: labelColor,
                transition: 'color 150ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = labelColor)}
            >
              Clear history
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
