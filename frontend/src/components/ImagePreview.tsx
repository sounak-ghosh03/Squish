import { useEffect, useRef, useState, useCallback } from 'react'

interface ImagePreviewProps {
  originalFile: File
  compressedBlob: Blob
  isDark: boolean
}

export function ImagePreview({ originalFile, compressedBlob, isDark }: ImagePreviewProps) {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null)
  const [sliderPos, setSliderPos] = useState(50) // percent
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Create object URLs and clean up on unmount
  useEffect(() => {
    const orig = URL.createObjectURL(originalFile)
    const comp = URL.createObjectURL(compressedBlob)
    setOriginalUrl(orig)
    setCompressedUrl(comp)
    return () => {
      URL.revokeObjectURL(orig)
      URL.revokeObjectURL(comp)
    }
  }, [originalFile, compressedBlob])

  const updateSlider = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setSliderPos((x / rect.width) * 100)
  }, [])

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: MouseEvent) => updateSlider(e.clientX)
    const onUp = () => setIsDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDragging, updateSlider])

  // Touch events
  const onTouchStart = () => setIsDragging(true)
  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: TouchEvent) => updateSlider(e.touches[0].clientX)
    const onEnd = () => setIsDragging(false)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
  }, [isDragging, updateSlider])

  if (!originalUrl || !compressedUrl) return null

  const borderColor = isDark ? '#1f2937' : '#e5e7eb'

  return (
    <div
      id="image-preview"
      className="animate-slide-up"
      style={{
        border: `1px solid ${borderColor}`,
        borderRadius: '1rem',
        overflow: 'hidden',
        backgroundColor: isDark ? '#111827' : '#ffffff',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isDark ? '#f3f4f6' : '#111827' }}>
          Before / After
        </span>
        <span style={{ fontSize: '0.75rem', color: isDark ? '#6b7280' : '#9ca3af', fontWeight: 500 }}>
          Drag to compare
        </span>
      </div>

      {/* Slider container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          overflow: 'hidden',
          cursor: isDragging ? 'ew-resize' : 'col-resize',
          userSelect: 'none',
          backgroundColor: isDark ? '#030712' : '#f9fafb',
        }}
      >
        {/* Compressed image (full width, underneath) */}
        <img
          src={compressedUrl}
          alt="Compressed"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />

        {/* Original image (clipped to left of slider) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            transition: isDragging ? 'none' : 'clip-path 0.05s ease',
          }}
        >
          <img
            src={originalUrl}
            alt="Original"
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Labels */}
        <div
          style={{
            position: 'absolute',
            top: '0.5rem',
            left: '0.625rem',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(0,0,0,0.55)',
            color: '#ffffff',
            letterSpacing: '0.04em',
            pointerEvents: 'none',
          }}
        >
          ORIGINAL
        </div>
        <div
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.625rem',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(0,0,0,0.55)',
            color: '#ffffff',
            letterSpacing: '0.04em',
            pointerEvents: 'none',
          }}
        >
          COMPRESSED
        </div>

        {/* Slider handle */}
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPos}%`,
            transform: 'translateX(-50%)',
            width: '2px',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.3)',
            cursor: 'ew-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Handle pill */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 2px 12px rgba(99,102,241,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'ew-resize',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="9 7 4 12 9 17" />
              <polyline points="15 7 20 12 15 17" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
