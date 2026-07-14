interface PresetBarProps {
  activePreset: string | null
  onSelect: (label: string, quality: number) => void
  isDark: boolean
}

const PRESETS = [
  { label: 'Web', quality: 70, hint: 'Balanced for web sharing' },
  { label: 'Email', quality: 60, hint: 'Smallest size for email' },
  { label: 'Print', quality: 90, hint: 'High quality for print' },
  { label: 'Archive', quality: 50, hint: 'Maximum compression' },
] as const

export function PresetBar({ activePreset, onSelect, isDark }: PresetBarProps) {
  return (
    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }} role="group" aria-label="Quality presets">
      {PRESETS.map(({ label, quality, hint }) => {
        const isActive = activePreset === label
        return (
          <button
            key={label}
            id={`preset-${label.toLowerCase()}`}
            onClick={() => onSelect(label, quality)}
            title={`${hint} (${quality}%)`}
            aria-pressed={isActive}
            style={{
              padding: '0.3125rem 0.75rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: isActive ? '#6366f1' : isDark ? '#374151' : '#d1d5db',
              backgroundColor: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
              color: isActive ? '#6366f1' : isDark ? '#9ca3af' : '#6b7280',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = '#6366f1'
                e.currentTarget.style.color = '#6366f1'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = isDark ? '#374151' : '#d1d5db'
                e.currentTarget.style.color = isDark ? '#9ca3af' : '#6b7280'
              }
            }}
          >
            {label}{' '}
            <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>{quality}%</span>
          </button>
        )
      })}
    </div>
  )
}
