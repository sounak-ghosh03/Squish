import type { CSSProperties } from 'react'
import { useState } from 'react'
import type { CompressionOptions, CompressionMode } from '@/types'
import { PresetBar } from './PresetBar'
import { ModeInfo } from './ModeInfo'

interface CompressionControlsProps {
  options: CompressionOptions
  onChange: (opts: CompressionOptions) => void
  onCompress: () => void
  isCompressing: boolean
  isDark: boolean
  disabled?: boolean
}

export function CompressionControls({
  options,
  onChange,
  onCompress,
  isCompressing,
  isDark,
  disabled = false,
}: CompressionControlsProps) {
  const [activePreset, setActivePreset] = useState<string | null>(null)

  function switchMode(mode: CompressionMode) {
    setActivePreset(null)
    onChange({ ...options, mode })
  }

  function handlePreset(label: string, quality: number) {
    setActivePreset(label)
    onChange({ ...options, mode: 'quality', quality })
  }

  const modeTabStyle = (active: boolean): CSSProperties => ({
    flex: 1,
    padding: '0.4375rem 0',
    fontSize: '0.8125rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    backgroundColor: active ? '#6366f1' : 'transparent',
    color: active ? '#ffffff' : isDark ? '#9ca3af' : '#6b7280',
  })

  const inputBaseStyle: CSSProperties = {
    width: '100%',
    padding: '0.625rem 0.875rem',
    borderRadius: '0.625rem',
    border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
    backgroundColor: isDark ? '#1f2937' : '#f9fafb',
    color: isDark ? '#f3f4f6' : '#111827',
    fontSize: '0.9375rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 150ms',
  }

  return (
    <div className="card animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#f3f4f6' : '#111827', margin: 0, marginBottom: '0.25rem' }}>
          Compression Settings
        </h2>
        <p style={{ fontSize: '0.8125rem', color: isDark ? '#9ca3af' : '#6b7280', margin: 0 }}>
          Adjust quality or target a specific file size
        </p>
      </div>

      {/* Mode Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          padding: '0.25rem',
          borderRadius: '0.75rem',
          backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
        }}
      >
        <button id="mode-quality" style={modeTabStyle(options.mode === 'quality')} onClick={() => switchMode('quality')}>
          Quality %
        </button>
        <button id="mode-target-size" style={modeTabStyle(options.mode === 'targetSize')} onClick={() => switchMode('targetSize')}>
          Target Size
        </button>
      </div>

      {/* Quality Mode */}
      {options.mode === 'quality' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {/* Presets */}
          <PresetBar activePreset={activePreset} onSelect={handlePreset} isDark={isDark} />

          {/* Slider */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <label htmlFor="quality-slider" style={{ fontSize: '0.8125rem', fontWeight: 500, color: isDark ? '#d1d5db' : '#374151' }}>
                  Quality
                </label>
                <ModeInfo mode="quality" isDark={isDark} />
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6366f1', minWidth: '3rem', textAlign: 'right' }}>
                {options.quality}%
              </span>
            </div>
            <input
              id="quality-slider"
              type="range"
              min={1}
              max={100}
              value={options.quality}
              onChange={(e) => {
                setActivePreset(null)
                onChange({ ...options, quality: Number(e.target.value) })
              }}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.6875rem', color: isDark ? '#6b7280' : '#9ca3af' }}>Smallest</span>
              <span style={{ fontSize: '0.6875rem', color: isDark ? '#6b7280' : '#9ca3af' }}>Best quality</span>
            </div>
          </div>
        </div>
      )}

      {/* Target Size Mode */}
      {options.mode === 'targetSize' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <label htmlFor="target-size-input" style={{ fontSize: '0.8125rem', fontWeight: 500, color: isDark ? '#d1d5db' : '#374151' }}>
              Target File Size
            </label>
            <ModeInfo mode="targetSize" isDark={isDark} />
          </div>
          <div style={{ position: 'relative' }}>
            <input
              id="target-size-input"
              type="number"
              min={1}
              max={100000}
              value={options.targetSizeKB}
              onChange={(e) => onChange({ ...options, targetSizeKB: Number(e.target.value) })}
              style={inputBaseStyle}
              placeholder="e.g. 500"
            />
            <span
              style={{
                position: 'absolute',
                right: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: isDark ? '#6b7280' : '#9ca3af',
                pointerEvents: 'none',
              }}
            >
              KB
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: isDark ? '#6b7280' : '#9ca3af', margin: 0 }}>
            The compressor will aim to hit this target — results may vary by file type.
          </p>
        </div>
      )}

      {/* Compress Button */}
      <button
        id="compress-button"
        className="btn-primary"
        onClick={onCompress}
        disabled={isCompressing || disabled}
        style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem' }}
      >
        {isCompressing ? (
          <>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
            </svg>
            Compressing…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
            Compress File
          </>
        )}
      </button>
    </div>
  )
}
