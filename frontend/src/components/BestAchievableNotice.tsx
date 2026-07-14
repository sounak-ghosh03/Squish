interface BestAchievableNoticeProps {
  compressedSizeKB: number
  isDark: boolean
}

export function BestAchievableNotice({ compressedSizeKB, isDark }: BestAchievableNoticeProps) {
  return (
    <div
      id="best-achievable-notice"
      className="animate-fade-in"
      role="status"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem',
        padding: '0.75rem 1rem',
        borderRadius: '0.75rem',
        border: `1px solid ${isDark ? '#78350f' : '#fde68a'}`,
        backgroundColor: isDark ? 'rgba(120,53,15,0.25)' : '#fffbeb',
      }}
    >
      <span style={{ fontSize: '1rem', lineHeight: 1.4, flexShrink: 0 }}>⚡</span>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            fontWeight: 600,
            color: isDark ? '#fde68a' : '#92400e',
            lineHeight: 1.4,
          }}
        >
          Best achievable: {compressedSizeKB.toFixed(0)} KB
        </p>
        <p
          style={{
            margin: '0.25rem 0 0',
            fontSize: '0.8125rem',
            color: isDark ? '#fbbf24' : '#b45309',
            lineHeight: 1.5,
          }}
        >
          This file cannot be compressed further without significant quality loss.
          You can still download the current result.
        </p>
      </div>
    </div>
  )
}
