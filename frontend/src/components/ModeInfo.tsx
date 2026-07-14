import { useState, useRef, useEffect } from 'react'

interface ModeInfoProps {
  mode: 'quality' | 'targetSize'
  isDark: boolean
}

const INFO = {
  quality: {
    title: 'Quality %',
    body: 'Controls how much detail to preserve. Higher = better quality, larger file. Lower = smaller file, more visible compression. 70–80% is a great balance for most uses.',
  },
  targetSize: {
    title: 'Target Size (KB)',
    body: 'Set the file size you need. The compressor searches for the best quality that fits within your limit. Results vary — very aggressive targets may cause visible quality loss.',
  },
}

export function ModeInfo({ mode, isDark }: ModeInfoProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const info = INFO[mode]

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        id={`mode-info-${mode}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={`Learn about ${info.title}`}
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '18px',
          height: '18px',
          borderRadius: '9999px',
          border: `1.5px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
          backgroundColor: 'transparent',
          color: isDark ? '#6b7280' : '#9ca3af',
          fontSize: '0.6875rem',
          fontWeight: 700,
          cursor: 'pointer',
          lineHeight: 1,
          transition: 'border-color 150ms, color 150ms',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#6366f1'
          e.currentTarget.style.color = '#6366f1'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = isDark ? '#4b5563' : '#d1d5db'
          e.currentTarget.style.color = isDark ? '#6b7280' : '#9ca3af'
        }}
      >
        ?
      </button>

      {open && (
        <div
          className="animate-fade-in"
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '240px',
            padding: '0.75rem',
            borderRadius: '0.625rem',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 100,
            pointerEvents: 'none',
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '9px',
              height: '9px',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderTop: 'none',
              borderLeft: 'none',
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
            }}
          />
          <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 700, color: isDark ? '#f3f4f6' : '#111827', marginBottom: '0.25rem' }}>
            {info.title}
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#9ca3af' : '#6b7280', lineHeight: 1.55 }}>
            {info.body}
          </p>
        </div>
      )}
    </div>
  )
}
