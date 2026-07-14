interface FooterProps {
  isDark: boolean
  onNavigate: (to: '/privacy' | '/terms') => void
}

export function Footer({ isDark, onNavigate }: FooterProps) {
  const linkStyle = {
    color: isDark ? '#6b7280' : '#9ca3af',
    textDecoration: 'none',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 150ms',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'inherit',
  } as const

  return (
    <footer
      id="site-footer"
      style={{
        borderTop: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
        marginTop: '4rem',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        transition: 'border-color 250ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        {/* Squish logo mark (small) */}
        <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="7" fill="url(#footer-grad)" />
          <path d="M9 10C9 8.9 9.9 8 11 8h6c1.1 0 2 .9 2 2v1.5C19 12.9 17.7 14 16 14H12c-1.7 0-3 1.1-3 2.5V18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="footer-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: isDark ? '#9ca3af' : '#6b7280', letterSpacing: '-0.02em' }}>
          squish
        </span>
      </div>

      <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '1.5rem' }}>
        <button
          id="footer-privacy-link"
          style={linkStyle}
          onClick={() => onNavigate('/privacy')}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#6366f1')}
          onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? '#6b7280' : '#9ca3af')}
        >
          Privacy Policy
        </button>
        <button
          id="footer-terms-link"
          style={linkStyle}
          onClick={() => onNavigate('/terms')}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#6366f1')}
          onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? '#6b7280' : '#9ca3af')}
        >
          Terms of Use
        </button>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...linkStyle, cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#6366f1')}
          onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? '#6b7280' : '#9ca3af')}
        >
          GitHub
        </a>
      </nav>

      <p style={{ fontSize: '0.75rem', color: isDark ? '#374151' : '#d1d5db', margin: 0 }}>
        © {new Date().getFullYear()} Squish. Free forever.
      </p>
    </footer>
  )
}
