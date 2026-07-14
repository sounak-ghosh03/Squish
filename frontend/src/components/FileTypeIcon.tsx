import type { SupportedFileType } from '@/types'

interface FileTypeIconProps {
  mimeType: string
  size?: number
  className?: string
}

export function FileTypeIcon({ mimeType, size = 32, className = '' }: FileTypeIconProps) {
  const type = mimeType as SupportedFileType

  if (type === 'application/pdf') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label="PDF file"
      >
        <rect width="32" height="32" rx="6" fill="#ef4444" opacity="0.12" />
        <rect width="32" height="32" rx="6" fill="url(#pdf-grad)" opacity="0.8" />
        <text x="16" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ef4444" fontFamily="Inter, sans-serif">PDF</text>
        <defs>
          <linearGradient id="pdf-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef2f2" />
            <stop offset="1" stopColor="#fee2e2" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label="DOCX file"
      >
        <rect width="32" height="32" rx="6" fill="url(#docx-grad)" opacity="0.8" />
        <text x="16" y="20" textAnchor="middle" fontSize="8" fontWeight="700" fill="#2563eb" fontFamily="Inter, sans-serif">DOCX</text>
        <defs>
          <linearGradient id="docx-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#eff6ff" />
            <stop offset="1" stopColor="#dbeafe" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  if (mimeType === 'image/png') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label="PNG file"
      >
        <rect width="32" height="32" rx="6" fill="url(#png-grad)" opacity="0.9" />
        <text x="16" y="20" textAnchor="middle" fontSize="8" fontWeight="700" fill="#7c3aed" fontFamily="Inter, sans-serif">PNG</text>
        <defs>
          <linearGradient id="png-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f5f3ff" />
            <stop offset="1" stopColor="#ede9fe" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  // JPEG / JPG
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-label="JPEG file"
    >
      <rect width="32" height="32" rx="6" fill="url(#jpg-grad)" opacity="0.9" />
      <text x="16" y="20" textAnchor="middle" fontSize="8" fontWeight="700" fill="#d97706" fontFamily="Inter, sans-serif">JPG</text>
      <defs>
        <linearGradient id="jpg-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffbeb" />
          <stop offset="1" stopColor="#fef3c7" />
        </linearGradient>
      </defs>
    </svg>
  )
}
