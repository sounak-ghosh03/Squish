import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

interface LegalLayoutProps {
  isDark: boolean
  onToggleDark: () => void
  onNavigate: (to: '/' | '/privacy' | '/terms') => void
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalLayout({
  isDark,
  onToggleDark,
  onNavigate,
  title,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  const textColor = isDark ? '#f3f4f6' : '#111827'
  const mutedColor = isDark ? '#9ca3af' : '#6b7280'
  const borderColor = isDark ? '#1f2937' : '#e5e7eb'

  return (
    <div
      style={{
        minHeight: '100svh',
        backgroundColor: isDark ? '#030712' : '#f9fafb',
        transition: 'background-color 250ms',
      }}
    >
      <Navbar isDark={isDark} onToggleDark={onToggleDark} />

      <main
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '3rem 1.5rem 2rem',
        }}
      >
        {/* Back button */}
        <button
          id="legal-back-btn"
          onClick={() => onNavigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginBottom: '2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: mutedColor,
            fontSize: '0.875rem',
            fontWeight: 500,
            fontFamily: 'inherit',
            padding: 0,
            transition: 'color 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#6366f1')}
          onMouseLeave={(e) => (e.currentTarget.style.color = mutedColor)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Squish
        </button>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: `1px solid ${borderColor}` }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: textColor, margin: '0 0 0.5rem' }}>
            {title}
          </h1>
          <p style={{ fontSize: '0.875rem', color: mutedColor, margin: 0 }}>
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            color: textColor,
            lineHeight: 1.7,
            fontSize: '0.9375rem',
          }}
        >
          {children}
        </div>
      </main>

      <Footer isDark={isDark} onNavigate={onNavigate} />
    </div>
  )
}
