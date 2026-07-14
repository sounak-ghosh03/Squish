import type { CompressionOptions } from '@/types'

/**
 * Browser-side PDF compression using pdf-lib — loaded lazily on first call
 * so the ~500 KB pdf-lib bundle doesn't block initial page load.
 *
 * Re-saves the PDF with object streams enabled which reduces size for many PDFs.
 * Full embedded-image downscaling happens on the server path (Phase 2).
 */
export async function compressPdf(file: File, _options: CompressionOptions): Promise<Blob> {
  // Dynamic import — pdf-lib is only fetched when the user actually picks a PDF
  const { PDFDocument } = await import('pdf-lib')

  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })

  const compressedBytes = await pdfDoc.save({ useObjectStreams: true })
  return new Blob([compressedBytes], { type: 'application/pdf' })
}
