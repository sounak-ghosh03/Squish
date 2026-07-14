import type { ToolMode } from '@/types'

interface ToolSwitcherProps {
  mode: ToolMode
  onSwitch: (mode: ToolMode) => void
  isDark: boolean
}

const TOOLS: { mode: ToolMode; label: string; icon: string }[] = [
  { mode: 'compress', label: 'Compress', icon: '⚡' },
  { mode: 'resize',   label: 'Resize',   icon: '⇲' },
]

export function ToolSwitcher({ mode, onSwitch, isDark }: ToolSwitcherProps) {
  const trackBg  = isDark ? '#111827' : '#f3f4f6'
  const trackBdr = isDark ? '#1f2937' : '#e5e7eb'

  return (
    <div
      id="tool-switcher"
      role="tablist"
      aria-label="Tool mode"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem',
        borderRadius: '9999px',
        backgroundColor: trackBg,
        border: `1px solid ${trackBdr}`,
      }}
    >
      {TOOLS.map((t) => {
        const active = mode === t.mode
        return (
          <button
            key={t.mode}
            id={`tool-${t.mode}`}
            role="tab"
            aria-selected={active}
            onClick={() => onSwitch(t.mode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.4375rem 1.125rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              transition: 'background-color 180ms, color 180ms, box-shadow 180ms',
              backgroundColor: active
                ? 'linear-gradient(135deg, #6366f1, #a78bfa)'
                : 'transparent',
              // CSS gradients can't be used in backgroundColor directly; use a wrapper trick
              background: active
                ? 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)'
                : 'transparent',
              color: active ? '#ffffff' : (isDark ? '#9ca3af' : '#6b7280'),
              boxShadow: active
                ? '0 2px 8px rgba(99, 102, 241, 0.45)'
                : 'none',
            }}
          >
            <span style={{ fontSize: '0.875rem', lineHeight: 1 }}>{t.icon}</span>
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
