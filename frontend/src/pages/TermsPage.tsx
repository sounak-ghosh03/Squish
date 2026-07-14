import { LegalLayout } from '@/components/LegalLayout'

interface TermsPageProps {
  isDark: boolean
  onToggleDark: () => void
  onNavigate: (to: '/' | '/privacy' | '/terms') => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {children}
      </div>
    </section>
  )
}

export function TermsPage({ isDark, onToggleDark, onNavigate }: TermsPageProps) {
  return (
    <LegalLayout
      isDark={isDark}
      onToggleDark={onToggleDark}
      onNavigate={onNavigate}
      title="Terms of Use"
      lastUpdated="June 2025"
    >
      <p>
        By using Squish, you agree to these terms. They are intentionally
        short and written in plain language.
      </p>

      <Section title="What Squish is">
        <p>
          Squish is a free, browser-based file compression tool. It compresses
          PDF, JPEG, PNG, and DOCX files. It is provided as-is, free of charge,
          with no guarantees.
        </p>
      </Section>

      <Section title="Acceptable use">
        <p>You may use Squish to compress files that you own or have the right
        to process. You may not use Squish to:</p>
        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <li>Compress files you do not have permission to process</li>
          <li>Attempt to reverse-engineer, overload, or abuse the service</li>
          <li>Upload illegal, harmful, or malicious content to the server path</li>
          <li>Automate requests to the compression API in a way that degrades service for others</li>
        </ul>
      </Section>

      <Section title="No guarantees on compression results">
        <p>
          Compression ratios vary significantly by file type and content.
          Some files — especially those already compressed (e.g. JPEGs at high
          quality, scanned PDFs) — may not compress further. Squish makes no
          guarantee that any particular file size reduction will be achieved.
        </p>
        <p>
          Always keep your original files. While we make every effort to preserve
          file integrity, compression is a lossy process for images and may
          affect visual quality. <strong>We are not liable for any data loss
          or quality degradation resulting from use of this tool.</strong>
        </p>
      </Section>

      <Section title="Server-processed files">
        <p>
          Files sent to our server (DOCX and files over 10 MB) are processed
          and deleted immediately. See our{' '}
          <button
            onClick={() => onNavigate('/privacy')}
            style={{
              color: '#6366f1',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              textDecoration: 'underline',
            }}
          >
            Privacy Policy
          </button>{' '}
          for full details. You must not upload files containing highly sensitive
          personal data (e.g. passwords, financial records, medical data) via
          the server path if you are subject to strict data regulations (e.g.
          HIPAA). Use the browser path (files under 10 MB) for such content.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          Squish is provided <strong>"as is"</strong> without warranty of
          any kind, express or implied. In no event shall Squish or its
          creators be liable for any direct, indirect, incidental, or
          consequential damages arising from use of this service — including
          but not limited to data loss, file corruption, or service
          unavailability.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We may update these terms. Continued use of Squish after changes are
          posted constitutes acceptance of the new terms. The date at the top
          of this page indicates the last revision.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions? Open an issue on our{' '}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
            GitHub repository
          </a>.
        </p>
      </Section>
    </LegalLayout>
  )
}
