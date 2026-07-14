import { useState, useEffect } from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useRoute } from '@/hooks/useRoute'
import { routeCompression } from '@/lib/router'
import { resizeImage, getImageDimensions } from '@/lib/resizeImage'
import { toPx } from '@/lib/unitConvert'
import { getSavings } from '@/utils/getSavings'
import { formatBytes } from '@/utils/formatBytes'
import { trackCompressStart, trackCompressSuccess, trackCompressError, trackDownload } from '@/utils/analytics'
import { addHistoryEntry } from '@/components/HistoryPanel'
import type { AppState, CompressionOptions, CompressionSource, ResizeOptions, ToolMode } from '@/types'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { DropZone } from '@/components/DropZone'
import { ToolSwitcher } from '@/components/ToolSwitcher'
import { CompressionControls } from '@/components/CompressionControls'
import { ResizeControls } from '@/components/ResizeControls'
import { ResultPanel } from '@/components/ResultPanel'
import { ErrorBanner } from '@/components/ErrorBanner'
import { HistoryPanel } from '@/components/HistoryPanel'
import { ProgressBar } from '@/components/ProgressBar'
import { ImagePreview } from '@/components/ImagePreview'
import { BestAchievableNotice } from '@/components/BestAchievableNotice'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { TermsPage } from '@/pages/TermsPage'

interface CompressionResult {
  blob: Blob
  source: CompressionSource
  compressedSize: number
  savings: number
  resizeDimensions?: { w: number; h: number }
}

const RESIZE_ACCEPT = ['image/jpeg', 'image/png', 'image/webp']

function HomePage({
  isDark,
  onToggleDark,
  onNavigate,
}: {
  isDark: boolean
  onToggleDark: () => void
  onNavigate: (to: '/' | '/privacy' | '/terms') => void
}) {
  // ── Tool mode ─────────────────────────────────────────────────────────────
  const [toolMode, setToolMode] = useState<ToolMode>('compress')

  // ── Shared file state ─────────────────────────────────────────────────────
  const [appState, setAppState] = useState<AppState>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<CompressionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [historyKey, setHistoryKey] = useState(0)

  // ── Compress options ──────────────────────────────────────────────────────
  const [compressOptions, setCompressOptions] = useState<CompressionOptions>({
    mode: 'quality',
    quality: 75,
    targetSizeKB: 500,
  })

  // ── Resize options + original image dims ─────────────────────────────────
  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    width: 800,
    height: 600,
    unit: 'px',
    dpi: 96,
    lockAspect: true,
    outputFormat: 'match',
  })
  const [origDims, setOrigDims] = useState<{ w: number; h: number } | undefined>()

  // When a file is selected in resize mode, read its natural dimensions
  useEffect(() => {
    if (!selectedFile || toolMode !== 'resize') return
    if (!selectedFile.type.startsWith('image/')) return
    getImageDimensions(selectedFile).then((dims) => {
      setOrigDims(dims)
      setResizeOptions((prev) => ({ ...prev, width: dims.w, height: dims.h }))
    }).catch(() => { /* ignore */ })
  }, [selectedFile, toolMode])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleToolSwitch(mode: ToolMode) {
    setToolMode(mode)
    setSelectedFile(null)
    setResult(null)
    setError(null)
    setAppState('idle')
    setOrigDims(undefined)
  }

  function handleFileAccepted(file: File) {
    setSelectedFile(file)
    setAppState('selected')
    setResult(null)
    setError(null)
    setOrigDims(undefined)
  }

  async function handleCompress() {
    if (!selectedFile) return
    setAppState('compressing')
    setError(null)
    const shortType = selectedFile.type.split('/').pop() ?? selectedFile.type
    trackCompressStart(shortType, compressOptions.mode)
    try {
      const { blob, source } = await routeCompression(selectedFile, compressOptions)
      const savings = getSavings(selectedFile.size, blob.size)
      setResult({ blob, source, compressedSize: blob.size, savings })
      setAppState('done')
      trackCompressSuccess(shortType, source)
      addHistoryEntry({ fileName: selectedFile.name, originalSize: selectedFile.size, compressedSize: blob.size, savings, source, timestamp: Date.now() })
      setHistoryKey((k) => k + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed.')
      setAppState('error')
      trackCompressError(shortType)
    }
  }

  async function handleResize() {
    if (!selectedFile) return
    setAppState('compressing')
    setError(null)
    try {
      const blob = await resizeImage(selectedFile, resizeOptions)
      const wPx = toPx(resizeOptions.width, resizeOptions.unit, resizeOptions.dpi)
      const hPx = toPx(resizeOptions.height, resizeOptions.unit, resizeOptions.dpi)
      setResult({ blob, source: 'browser', compressedSize: blob.size, savings: 0, resizeDimensions: { w: wPx, h: hPx } })
      setAppState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resize failed.')
      setAppState('error')
    }
  }

  function handleReset() {
    setSelectedFile(null)
    setResult(null)
    setError(null)
    setAppState('idle')
    setOrigDims(undefined)
  }

  function handleDownload() {
    if (!selectedFile) return
    trackDownload(selectedFile.type.split('/').pop() ?? selectedFile.type)
  }

  // ── Derived state ─────────────────────────────────────────────────────────
  const isDocx = selectedFile?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  const isLargeFile = (selectedFile?.size ?? 0) > 10 * 1024 * 1024
  const willUseServer = toolMode === 'compress' && (isDocx || isLargeFile)
  const isImage = selectedFile?.type.startsWith('image/') ?? false

  const showControls = appState === 'selected' || appState === 'compressing' || appState === 'done' || appState === 'error'
  const showResult = appState === 'done' && result !== null && selectedFile !== null
  const showNoSavings = showResult && toolMode === 'compress' && result.savings <= 0
  const showImagePreview = showResult && isImage

  const progressStatus =
    appState === 'compressing' ? (willUseServer ? 'uploading' : 'compressing')
      : appState === 'done' ? 'done'
        : appState === 'error' ? 'error'
          : 'idle'

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100svh', backgroundColor: isDark ? '#030712' : '#f9fafb', transition: 'background-color 250ms' }}>
      <Navbar isDark={isDark} onToggleDark={onToggleDark} />

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem 0' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="animate-fade-in">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '0.3125rem 0.875rem', borderRadius: '9999px', marginBottom: '1rem',
            backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
            color: '#6366f1', border: '1px solid rgba(99,102,241,0.25)',
          }}>
            <span>✦</span> Privacy-first image tools
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em',
            lineHeight: 1.1, margin: '0 0 0.75rem', color: isDark ? '#f9fafb' : '#111827',
          }}>
            {toolMode === 'compress' ? (
              <>Compress files. <span className="text-gradient">Instantly.</span></>
            ) : (
              <>Resize images. <span className="text-gradient">Precisely.</span></>
            )}
          </h1>

          <p style={{ fontSize: '1rem', color: isDark ? '#9ca3af' : '#6b7280', maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            {toolMode === 'compress'
              ? <>PDF, JPEG, PNG, DOCX — browser-compressed when possible.<br /><strong style={{ color: isDark ? '#d1d5db' : '#374151' }}>Your files stay private.</strong></>
              : <>JPEG, PNG, WebP — resized in your browser in any unit.<br /><strong style={{ color: isDark ? '#d1d5db' : '#374151' }}>Nothing uploaded. Nothing stored.</strong></>
            }
          </p>

            {/* Tool switcher */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ToolSwitcher mode={toolMode} onSwitch={handleToolSwitch} isDark={isDark} />
            </div>
        </div>

        {/* Tool area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DropZone
            onFileAccepted={handleFileAccepted}
            isDark={isDark}
            disabled={appState === 'compressing'}
            acceptedMimeTypes={toolMode === 'resize' ? RESIZE_ACCEPT : undefined}
          />

          {/* Server-path notice (compress mode only) */}
          {selectedFile && willUseServer && appState !== 'done' && (
            <div className="animate-fade-in" style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
              padding: '0.625rem 0.875rem', borderRadius: '0.625rem',
              backgroundColor: isDark ? 'rgba(30,58,138,0.2)' : '#eff6ff',
              border: `1px solid ${isDark ? 'rgba(147,197,253,0.15)' : '#bfdbfe'}`,
              fontSize: '0.8125rem', color: isDark ? '#93c5fd' : '#1e40af',
            }}>
              <span style={{ flexShrink: 0 }}>🛡️</span>
              <span>{isDocx ? 'DOCX files are compressed on the server and deleted immediately.' : 'File is over 10 MB — compressed on the server and deleted immediately.'}</span>
            </div>
          )}

          {error && <ErrorBanner message={error} variant="error" isDark={isDark} onDismiss={() => setError(null)} />}

          {(appState === 'compressing' || appState === 'done' || appState === 'error') && (
            <ProgressBar status={progressStatus} isDark={isDark} />
          )}

          {showControls && toolMode === 'compress' && (
            <CompressionControls
              options={compressOptions} onChange={setCompressOptions}
              onCompress={handleCompress} isCompressing={appState === 'compressing'}
              isDark={isDark} disabled={!selectedFile}
            />
          )}

          {showControls && toolMode === 'resize' && (
            <ResizeControls
              options={resizeOptions} onChange={setResizeOptions}
              onResize={handleResize} isResizing={appState === 'compressing'}
              isDark={isDark} disabled={!selectedFile}
              originalDimensions={origDims}
            />
          )}

          {showNoSavings && (
            <BestAchievableNotice compressedSizeKB={result.compressedSize / 1024} isDark={isDark} />
          )}

          {showResult && (
            <ResultPanel
              fileName={selectedFile.name}
              originalSize={selectedFile.size}
              compressedSize={result.compressedSize}
              savings={result.savings}
              compressedBlob={result.blob}
              source={result.source}
              isDark={isDark}
              onReset={handleReset}
              onDownload={handleDownload}
              resizeDimensions={result.resizeDimensions}
            />
          )}

          {showImagePreview && (
            <ImagePreview originalFile={selectedFile} compressedBlob={result.blob} isDark={isDark} />
          )}

          {toolMode === 'compress' && <HistoryPanel isDark={isDark} refreshKey={historyKey} />}
        </div>

        {/* Trust signals */}
        <div style={{ marginTop: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[{ icon: '🔒', text: 'Browser-only' }, { icon: '🛡️', text: 'Server deletes instantly' }, { icon: '🆓', text: 'Always free' }].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: isDark ? '#6b7280' : '#9ca3af', fontWeight: 500 }}>
                <span>{icon}</span>{text}
              </div>
            ))}
          </div>
          {selectedFile && appState !== 'done' && (
            <p style={{ fontSize: '0.8125rem', color: isDark ? '#6b7280' : '#9ca3af', margin: 0 }}>
              Selected: <strong style={{ color: isDark ? '#d1d5db' : '#374151' }}>{selectedFile.name}</strong> ({formatBytes(selectedFile.size)})
            </p>
          )}
        </div>
      </main>

      <Footer isDark={isDark} onNavigate={onNavigate} />
    </div>
  )
}

function App() {
  const { dark, toggle } = useDarkMode()
  const { route, navigate } = useRoute()

  if (route === '/privacy') return <PrivacyPage isDark={dark} onToggleDark={toggle} onNavigate={navigate} />
  if (route === '/terms') return <TermsPage isDark={dark} onToggleDark={toggle} onNavigate={navigate} />
  return <HomePage isDark={dark} onToggleDark={toggle} onNavigate={navigate} />
}

export default App
