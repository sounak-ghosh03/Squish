import { useEffect, useRef } from 'react'

type ProgressStatus = 'idle' | 'compressing' | 'uploading' | 'done' | 'error'

interface ProgressBarProps {
  status: ProgressStatus
  /** 0–100, or undefined for indeterminate (server path) */
  percent?: number
  isDark: boolean
}

const STATUS_LABELS: Record<ProgressStatus, string> = {
  idle: '',
  compressing: 'Compressing…',
  uploading: 'Uploading to server…',
  done: 'Done!',
  error: 'Failed',
}

const STATUS_COLORS: Record<ProgressStatus, string> = {
  idle: 'transparent',
  compressing: 'linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)',
  uploading: 'linear-gradient(90deg, #3b82f6, #6366f1, #3b82f6)',
  done: 'linear-gradient(90deg, #22c55e, #4ade80)',
  error: 'linear-gradient(90deg, #ef4444, #f87171)',
}

export function ProgressBar({ status, percent, isDark }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const isActive = status === 'compressing' || status === 'uploading'
  const isIndeterminate = isActive && percent === undefined
  const isDone = status === 'done'
  const isError = status === 'error'
  const label = STATUS_LABELS[status]

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    if (isDone) {
      bar.style.width = '100%'
    } else if (isError) {
      bar.style.width = '100%'
    } else if (percent !== undefined) {
      bar.style.width = `${Math.max(4, percent)}%`
    } else if (isIndeterminate) {
      bar.style.width = '40%'
    } else {
      bar.style.width = '0%'
    }
  }, [status, percent, isIndeterminate, isDone, isError])

  if (status === 'idle') return null

  return (
    <div
      id="progress-bar-container"
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '1rem 1.25rem',
        borderRadius: '0.875rem',
        border: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
        backgroundColor: isDark ? '#111827' : '#ffffff',
      }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isActive && (
            <svg
              className="animate-spin"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
            </svg>
          )}
          {isDone && <span style={{ color: '#22c55e' }}>✓</span>}
          {isError && <span style={{ color: '#ef4444' }}>✕</span>}
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: isError ? '#ef4444' : isDone ? '#22c55e' : isDark ? '#d1d5db' : '#374151',
            }}
          >
            {label}
          </span>
        </div>
        {percent !== undefined && isActive && (
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1' }}>
            {percent}%
          </span>
        )}
      </div>

      {/* Track */}
      <div
        style={{
          height: '6px',
          borderRadius: '9999px',
          backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Fill */}
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: '0%',
            borderRadius: '9999px',
            background: STATUS_COLORS[status],
            backgroundSize: '200% 100%',
            transition: isDone || isError ? 'width 0.4s ease' : 'width 0.3s ease',
            animation: isIndeterminate ? 'progress-shimmer 1.5s ease-in-out infinite' : undefined,
          }}
        />
      </div>

      <style>{`
        @keyframes progress-shimmer {
          0%   { transform: translateX(-60%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  )
}
