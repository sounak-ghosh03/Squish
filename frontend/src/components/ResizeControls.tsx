import { useEffect, useRef, useState } from 'react'
import type { ResizeOptions, DimensionUnit, OutputFormat } from '@/types'
import { toPx, fromPx, unitDecimals } from '@/lib/unitConvert'

// ── Preset library ────────────────────────────────────────────────────────────

interface Preset {
  name: string
  widthPx: number
  heightPx: number
  unit: DimensionUnit
  dpi: number
}

const PRESETS: { category: string; items: Preset[] }[] = [
  {
    category: 'Documents',
    items: [
      { name: 'Passport (US)', widthPx: 192, heightPx: 192, unit: 'in', dpi: 96 },          // 2×2 in @96
      { name: 'Passport (EU)', widthPx: 132, heightPx: 170, unit: 'cm', dpi: 96 },           // 35×45 mm @96dpi ≈ 132×170
      { name: 'Postcard', widthPx: 384, heightPx: 576, unit: 'in', dpi: 96 },               // 4×6 in
      { name: 'Stamp', widthPx: 84, heightPx: 113, unit: 'in', dpi: 96 },                   // 0.87×1.18 in
      { name: 'Business Card', widthPx: 336, heightPx: 192, unit: 'in', dpi: 96 },          // 3.5×2 in
      { name: 'A4 Print', widthPx: 794, heightPx: 1123, unit: 'in', dpi: 96 },             // 8.27×11.69 in
    ],
  },
  {
    category: 'Social Media',
    items: [
      { name: 'Instagram Square', widthPx: 1080, heightPx: 1080, unit: 'px', dpi: 96 },
      { name: 'Instagram Story', widthPx: 1080, heightPx: 1920, unit: 'px', dpi: 96 },
      { name: 'Facebook Cover', widthPx: 820, heightPx: 312, unit: 'px', dpi: 96 },
      { name: 'LinkedIn Banner', widthPx: 1584, heightPx: 396, unit: 'px', dpi: 96 },
      { name: 'Twitter/X Post', widthPx: 1200, heightPx: 675, unit: 'px', dpi: 96 },
    ],
  },
  {
    category: 'Web',
    items: [
      { name: 'HD Wallpaper', widthPx: 1920, heightPx: 1080, unit: 'px', dpi: 96 },
      { name: 'Thumbnail', widthPx: 150, heightPx: 150, unit: 'px', dpi: 96 },
    ],
  },
]

// ── Props ─────────────────────────────────────────────────────────────────────

interface ResizeControlsProps {
  options: ResizeOptions
  onChange: (opts: ResizeOptions) => void
  onResize: () => void
  isResizing: boolean
  isDark: boolean
  disabled?: boolean
  /** Natural pixel dimensions of the currently-selected image */
  originalDimensions?: { w: number; h: number }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const FORMAT_LABELS: Record<OutputFormat, string> = {
  match: 'Match input',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ResizeControls({
  options,
  onChange,
  onResize,
  isResizing,
  isDark,
  disabled = false,
  originalDimensions,
}: ResizeControlsProps) {
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [openCategory, setOpenCategory] = useState<string | null>('Documents')

  // Track aspect ratio from original image (or last locked state)
  const aspectRef = useRef<number>(
    originalDimensions && originalDimensions.h > 0
      ? originalDimensions.w / originalDimensions.h
      : 1,
  )

  // Update aspect ratio ref when original dimensions change
  useEffect(() => {
    if (originalDimensions && originalDimensions.h > 0) {
      aspectRef.current = originalDimensions.w / originalDimensions.h
    }
  }, [originalDimensions])

  // ── Shared styles ──────────────────────────────────────────────────────────

  const borderColor = isDark ? '#374151' : '#d1d5db'
  const bgInput = isDark ? '#1f2937' : '#f9fafb'
  const textColor = isDark ? '#f3f4f6' : '#111827'
  const mutedColor = isDark ? '#9ca3af' : '#6b7280'

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5625rem 0.75rem',
    borderRadius: '0.625rem',
    border: `1px solid ${borderColor}`,
    backgroundColor: bgInput,
    color: textColor,
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 150ms',
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  function setUnit(unit: DimensionUnit) {
    const { width, height, unit: oldUnit, dpi } = options
    const wPx = toPx(width, oldUnit, dpi)
    const hPx = toPx(height, oldUnit, dpi)
    setActivePreset(null)
    onChange({
      ...options,
      unit,
      width: fromPx(wPx, unit, dpi),
      height: fromPx(hPx, unit, dpi),
    })
  }

  function setDpi(dpi: number) {
    const { width, height, unit } = options
    const wPx = toPx(width, unit, options.dpi)
    const hPx = toPx(height, unit, options.dpi)
    onChange({
      ...options,
      dpi,
      width: fromPx(wPx, unit, dpi),
      height: fromPx(hPx, unit, dpi),
    })
  }

  function setWidth(raw: number) {
    setActivePreset(null)
    if (options.lockAspect && aspectRef.current > 0) {
      const wPx = toPx(raw, options.unit, options.dpi)
      const hPx = Math.round(wPx / aspectRef.current)
      onChange({ ...options, width: raw, height: fromPx(hPx, options.unit, options.dpi) })
    } else {
      onChange({ ...options, width: raw })
    }
  }

  function setHeight(raw: number) {
    setActivePreset(null)
    if (options.lockAspect && aspectRef.current > 0) {
      const hPx = toPx(raw, options.unit, options.dpi)
      const wPx = Math.round(hPx * aspectRef.current)
      onChange({ ...options, height: raw, width: fromPx(wPx, options.unit, options.dpi) })
    } else {
      onChange({ ...options, height: raw })
    }
  }

  function applyPreset(preset: Preset) {
    setActivePreset(preset.name)
    const { unit, dpi } = options
    onChange({
      ...options,
      width: fromPx(preset.widthPx, unit, dpi),
      height: fromPx(preset.heightPx, unit, dpi),
    })
  }

  function toggleLock() {
    // Capture current aspect before toggling
    const wPx = toPx(options.width, options.unit, options.dpi)
    const hPx = toPx(options.height, options.unit, options.dpi)
    if (hPx > 0) aspectRef.current = wPx / hPx
    onChange({ ...options, lockAspect: !options.lockAspect })
  }

  const dec = unitDecimals(options.unit)
  const wPx = toPx(options.width, options.unit, options.dpi)
  const hPx = toPx(options.height, options.unit, options.dpi)

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="card animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: textColor, margin: 0, marginBottom: '0.25rem' }}>
          Resize Settings
        </h2>
        {originalDimensions ? (
          <p style={{ fontSize: '0.8125rem', color: mutedColor, margin: 0 }}>
            Original: {originalDimensions.w} × {originalDimensions.h} px
          </p>
        ) : (
          <p style={{ fontSize: '0.8125rem', color: mutedColor, margin: 0 }}>
            Enter target dimensions below
          </p>
        )}
      </div>

      {/* Unit selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: mutedColor }}>Unit</span>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {(['px', 'in', 'cm'] as DimensionUnit[]).map((u) => (
            <button
              key={u}
              id={`unit-${u}`}
              onClick={() => setUnit(u)}
              style={{
                padding: '0.3125rem 0.875rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: options.unit === u ? '#6366f1' : borderColor,
                backgroundColor: options.unit === u ? 'rgba(99,102,241,0.12)' : 'transparent',
                color: options.unit === u ? '#6366f1' : mutedColor,
                cursor: 'pointer',
                transition: 'all 150ms',
                fontFamily: 'inherit',
              }}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* DPI — shown only for in / cm */}
      {options.unit !== 'px' && (
        <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label htmlFor="dpi-input" style={{ fontSize: '0.8125rem', fontWeight: 500, color: mutedColor, whiteSpace: 'nowrap' }}>
            DPI (dots per inch)
          </label>
          <input
            id="dpi-input"
            type="number"
            min={1}
            max={1200}
            step={1}
            value={options.dpi}
            onChange={(e) => setDpi(Math.max(1, Number(e.target.value)))}
            style={{ ...inputStyle, width: '100px' }}
          />
          <span style={{ fontSize: '0.75rem', color: mutedColor }}>
            Screen = 96, Print = 300
          </span>
        </div>
      )}

      {/* Width × Height */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.625rem' }}>
        {/* Width */}
        <div style={{ flex: 1 }}>
          <label htmlFor="resize-width" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: mutedColor, marginBottom: '0.375rem' }}>
            Width ({options.unit})
          </label>
          <input
            id="resize-width"
            type="number"
            min={options.unit === 'px' ? 1 : 0.01}
            step={options.unit === 'px' ? 1 : 0.01}
            value={options.width}
            onChange={(e) => setWidth(+Number(e.target.value).toFixed(dec))}
            style={inputStyle}
          />
        </div>

        {/* Aspect lock */}
        <button
          id="aspect-lock"
          onClick={toggleLock}
          title={options.lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
          style={{
            flexShrink: 0,
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0.5rem',
            border: `1px solid ${options.lockAspect ? '#6366f1' : borderColor}`,
            backgroundColor: options.lockAspect ? 'rgba(99,102,241,0.12)' : 'transparent',
            color: options.lockAspect ? '#6366f1' : mutedColor,
            cursor: 'pointer',
            transition: 'all 150ms',
            marginBottom: '1px',
          }}
        >
          {options.lockAspect ? (
            // Locked padlock
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          ) : (
            // Unlocked padlock
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
          )}
        </button>

        {/* Height */}
        <div style={{ flex: 1 }}>
          <label htmlFor="resize-height" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: mutedColor, marginBottom: '0.375rem' }}>
            Height ({options.unit})
          </label>
          <input
            id="resize-height"
            type="number"
            min={options.unit === 'px' ? 1 : 0.01}
            step={options.unit === 'px' ? 1 : 0.01}
            value={options.height}
            onChange={(e) => setHeight(+Number(e.target.value).toFixed(dec))}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Pixel preview (shown when unit is in/cm) */}
      {options.unit !== 'px' && (
        <p style={{ fontSize: '0.75rem', color: mutedColor, margin: 0 }}>
          → {wPx} × {hPx} px at {options.dpi} DPI
        </p>
      )}

      {/* Output format */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="output-format" style={{ fontSize: '0.8125rem', fontWeight: 500, color: mutedColor }}>
          Output format
        </label>
        <select
          id="output-format"
          value={options.outputFormat}
          onChange={(e) => onChange({ ...options, outputFormat: e.target.value as OutputFormat })}
          style={{
            ...inputStyle,
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            paddingRight: '2.25rem',
          }}
        >
          {(Object.keys(FORMAT_LABELS) as OutputFormat[]).map((f) => (
            <option key={f} value={f}>{FORMAT_LABELS[f]}</option>
          ))}
        </select>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: mutedColor }}>Presets</span>
        {PRESETS.map((group) => (
          <div key={group.category}>
            {/* Category toggle */}
            <button
              onClick={() => setOpenCategory(openCategory === group.category ? null : group.category)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem 0',
                marginBottom: '0.375rem',
                color: mutedColor,
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {group.category}
              </span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ transform: openCategory === group.category ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {openCategory === group.category && (
              <div className="animate-fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {group.items.map((p) => (
                  <button
                    key={p.name}
                    id={`preset-${p.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => applyPreset(p)}
                    title={`${p.widthPx}×${p.heightPx} px`}
                    style={{
                      padding: '0.3rem 0.625rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderRadius: '9999px',
                      border: '1px solid',
                      borderColor: activePreset === p.name ? '#6366f1' : borderColor,
                      backgroundColor: activePreset === p.name ? 'rgba(99,102,241,0.12)' : 'transparent',
                      color: activePreset === p.name ? '#6366f1' : mutedColor,
                      cursor: 'pointer',
                      transition: 'all 150ms',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resize button */}
      <button
        id="resize-button"
        className="btn-primary"
        onClick={onResize}
        disabled={isResizing || disabled}
        style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem' }}
      >
        {isResizing ? (
          <>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
            </svg>
            Resizing…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            Resize Image
          </>
        )}
      </button>
    </div>
  )
}
