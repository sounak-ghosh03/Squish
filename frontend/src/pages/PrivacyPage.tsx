import { LegalLayout } from '@/components/LegalLayout'

interface PrivacyPageProps {
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

export function PrivacyPage({ isDark, onToggleDark, onNavigate }: PrivacyPageProps) {
  return (
    <LegalLayout
      isDark={isDark}
      onToggleDark={onToggleDark}
      onNavigate={onNavigate}
      title="Privacy Policy"
      lastUpdated="June 2025"
    >
      <p>
        Squish is built around a single principle: <strong>your files are yours</strong>.
        We have designed the tool so that the vast majority of file processing happens
        entirely inside your browser — no data ever reaches our servers unless
        it's strictly necessary.
      </p>

      <Section title="What data we collect">
        <p>
          <strong>We collect no personal data.</strong> There are no accounts,
          no sign-ups, and no cookies used for tracking. The only data we receive
          is anonymous page-view events via{' '}
          <a href="https://plausible.io" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
            Plausible Analytics
          </a>
          {' '}— a GDPR-compliant, cookieless analytics tool. Plausible does not
          use cookies, does not collect IP addresses, and does not share data
          with third parties.
        </p>
        <p>
          We also track anonymous events such as "a user compressed a PDF in the
          browser" to understand which file types are most used. We never record
          file names, file contents, or file sizes.
        </p>
      </Section>

      <Section title="Browser-side processing (files under 10 MB)">
        <p>
          Files under 10 MB are compressed entirely within your browser using
          WebAssembly and JavaScript APIs. <strong>These files never leave your
          device.</strong> They are not sent to any server, not stored in any
          database, and not accessible to anyone — including us.
        </p>
        <p>
          The only data written to your device is a small compression history
          stored in your browser's <code>localStorage</code> — this contains
          only file names, original size, compressed size, and timestamp.
          It never leaves your browser and you can clear it at any time using
          the "Clear history" button in the app.
        </p>
      </Section>

      <Section title="Server-side processing (DOCX and files over 10 MB)">
        <p>
          DOCX files and files larger than 10 MB are sent to our compression
          server over an encrypted HTTPS connection. The following applies to
          all server-processed files:
        </p>
        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <li>The file is written to a temporary location on the server.</li>
          <li>Compression is performed immediately.</li>
          <li>The compressed file is streamed back to your browser.</li>
          <li>
            <strong>The temporary file is deleted immediately after the
            response is sent</strong>, regardless of whether the request
            succeeds or fails. This deletion is enforced in a{' '}
            <code>finally</code> block in our API code.
          </li>
          <li>We do not log file contents, file names, or file sizes.</li>
          <li>Files are never stored, indexed, or shared.</li>
        </ul>
      </Section>

      <Section title="Third-party services">
        <p>
          <strong>Plausible Analytics</strong> — We use Plausible for anonymous
          usage statistics. Plausible is hosted in the EU, does not use cookies,
          and is fully GDPR, CCPA, and PECR compliant. See{' '}
          <a href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
            Plausible's privacy policy
          </a>.
        </p>
        <p>
          We use no advertising networks, no social media trackers, no Google
          Analytics, and no third-party cookies of any kind.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          Because we collect no personal data, there is nothing to request,
          correct, or delete. If you have questions about privacy, contact us
          via the GitHub repository.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          We may update this policy to reflect changes to how Squish works.
          Any significant changes will be noted at the top of this page with
          an updated date.
        </p>
      </Section>
    </LegalLayout>
  )
}
