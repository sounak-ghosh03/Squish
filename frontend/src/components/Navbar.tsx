// Sun icon
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

// Moon icon
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

// Squish logo mark
function LogoMark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="8" fill="url(#logo-grad)" />
        <path d="M9 10C9 8.9 9.9 8 11 8h6c1.1 0 2 .9 2 2v1.5C19 12.9 17.7 14 16 14H12c-1.7 0-3 1.1-3 2.5V18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
      <span style={{ fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        squish
      </span>
    </div>
  )
}

interface NavbarProps {
  isDark: boolean
  onToggleDark: () => void
}

export function Navbar({ isDark, onToggleDark }: NavbarProps) {
  return (
    <nav
      id="navbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        height: '56px',
        borderBottom: '1px solid',
        borderColor: isDark ? '#1f2937' : '#e5e7eb',
        backgroundColor: isDark ? 'rgba(3,7,18,0.85)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'background-color 250ms, border-color 250ms',
      }}
    >
      <LogoMark />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: isDark ? '#9ca3af' : '#6b7280',
            textDecoration: 'none',
            transition: 'color 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = isDark ? '#e5e7eb' : '#111827')}
          onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? '#9ca3af' : '#6b7280')}
        >
          GitHub
        </a>

        <button
          id="dark-mode-toggle"
          className="btn-icon"
          onClick={onToggleDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  )
}
