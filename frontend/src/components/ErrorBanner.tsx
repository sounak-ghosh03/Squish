interface ErrorBannerProps {
  message: string
  variant?: 'warning' | 'error'
  isDark: boolean
  onDismiss: () => void
}

export function ErrorBanner({ message, variant = 'error', isDark, onDismiss }: ErrorBannerProps) {
  const isWarning = variant === 'warning'

  const bgColor = isWarning
    ? isDark ? 'rgba(120,53,15,0.3)' : '#fefce8'
    : isDark ? 'rgba(127,29,29,0.3)' : '#fff1f2'

  const borderColor = isWarning
    ? isDark ? '#78350f' : '#fde68a'
    : isDark ? '#7f1d1d' : '#fecdd3'

  const textColor = isWarning
    ? isDark ? '#fde68a' : '#92400e'
    : isDark ? '#fca5a5' : '#be123c'

  const icon = isWarning ? '⚠️' : '❌'

  return (
    <div
      id="error-banner"
      className="animate-fade-in"
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        borderRadius: '0.75rem',
        border: `1px solid ${borderColor}`,
        backgroundColor: bgColor,
      }}
    >
      <span style={{ fontSize: '1rem', lineHeight: 1.4, flexShrink: 0 }}>{icon}</span>
      <p style={{ flex: 1, margin: 0, fontSize: '0.875rem', fontWeight: 500, color: textColor, lineHeight: 1.5 }}>
        {message}
      </p>
      <button
        id="error-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss error"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: textColor,
          opacity: 0.65,
          padding: '0.125rem',
          flexShrink: 0,
          lineHeight: 1,
          fontSize: '1rem',
          transition: 'opacity 150ms',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.65')}
      >
        ✕
      </button>
    </div>
  )
}
