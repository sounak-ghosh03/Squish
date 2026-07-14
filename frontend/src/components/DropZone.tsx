import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileTypeIcon } from './FileTypeIcon'
import { formatBytes } from '@/utils/formatBytes'

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

interface DropZoneProps {
  onFileAccepted: (file: File) => void
  isDark: boolean
  disabled?: boolean
  /** Override accepted MIME types. Defaults to all compress-supported types. */
  acceptedMimeTypes?: string[]
}

export function DropZone({ onFileAccepted, isDark, disabled = false, acceptedMimeTypes }: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0])
      }
    },
    [onFileAccepted],
  )

  // Build accept object from prop override or fall back to full set
  const acceptConfig = acceptedMimeTypes
    ? Object.fromEntries(
        acceptedMimeTypes
          .filter((t) => t in ACCEPTED_TYPES)
          .map((t) => [t, ACCEPTED_TYPES[t as keyof typeof ACCEPTED_TYPES]])
      )
    : ACCEPTED_TYPES

  const { getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles, fileRejections } =
    useDropzone({
      onDrop,
      accept: acceptConfig,
      maxFiles: 1,
      disabled,
    })

  const currentFile = acceptedFiles[0] ?? null
  const hasError = fileRejections.length > 0

  const borderColor = isDragReject || hasError
    ? '#ef4444'
    : isDragActive
    ? '#6366f1'
    : isDark
    ? '#374151'
    : '#d1d5db'

  const bgColor = isDragActive
    ? isDark
      ? 'rgba(99, 102, 241, 0.08)'
      : 'rgba(99, 102, 241, 0.04)'
    : isDark
    ? '#111827'
    : '#ffffff'

  return (
    <div
      {...getRootProps()}
      id="dropzone"
      style={{
        border: `2px dashed ${borderColor}`,
        borderRadius: '1rem',
        backgroundColor: bgColor,
        padding: '2.5rem 2rem',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 200ms ease',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <input {...getInputProps()} id="file-input" aria-label="File upload input" />

      {/* Glow effect when dragging */}
      {isDragActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {currentFile ? (
        /* File selected state */
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
          <FileTypeIcon mimeType={currentFile.type} size={48} />
          <div>
            <p style={{ fontWeight: 600, color: isDark ? '#f3f4f6' : '#111827', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
              {currentFile.name}
            </p>
            <p style={{ fontSize: '0.8125rem', color: isDark ? '#9ca3af' : '#6b7280' }}>
              {formatBytes(currentFile.size)} — click or drop to replace
            </p>
          </div>
        </div>
      ) : (
        /* Empty / drag state */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
          {/* Upload icon */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: isDragActive
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : isDark
                ? '#1f2937'
                : '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms ease',
              boxShadow: isDragActive ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDragActive ? '#ffffff' : isDark ? '#9ca3af' : '#6b7280'}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div>
            <p style={{ fontWeight: 600, color: isDark ? '#f3f4f6' : '#111827', fontSize: '1rem', marginBottom: '0.375rem' }}>
              {isDragActive ? 'Drop it here!' : 'Drop your file here'}
            </p>
            <p style={{ fontSize: '0.8125rem', color: isDark ? '#9ca3af' : '#6b7280' }}>
              or <span style={{ color: '#6366f1', fontWeight: 600 }}>click to browse</span>
            </p>
          </div>

          {/* Supported formats */}
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.25rem' }}>
            {['JPG', 'PNG', 'PDF', 'DOCX'].map((fmt) => (
              <span
                key={fmt}
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  letterSpacing: '0.04em',
                }}
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: '0.875rem',
            padding: '0.5rem 0.875rem',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(239,68,68,0.1)',
            color: '#ef4444',
            fontSize: '0.8125rem',
            fontWeight: 500,
          }}
        >
          ⚠ {fileRejections[0]?.errors[0]?.message ?? 'Unsupported file type or too many files'}
        </div>
      )}
    </div>
  )
}
