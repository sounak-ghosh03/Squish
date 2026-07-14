export type SupportedFileType =
  | 'image/jpeg'
  | 'image/png'
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export type CompressionMode = 'quality' | 'targetSize'

export type DimensionUnit = 'px' | 'in' | 'cm'

export type OutputFormat = 'match' | 'image/jpeg' | 'image/png' | 'image/webp'

export type ToolMode = 'compress' | 'resize'

export interface ResizeOptions {
  width: number
  height: number
  unit: DimensionUnit
  dpi: number          // used when unit is 'in' or 'cm' (default 96)
  lockAspect: boolean
  outputFormat: OutputFormat
}

export type AppState = 'idle' | 'selected' | 'compressing' | 'done' | 'error'

export interface FileInfo {
  file: File
  originalSize: number
  compressedSize?: number
  compressedBlob?: Blob
  savings?: number // percentage saved
}

export interface CompressionOptions {
  mode: CompressionMode
  quality: number    // 0–100
  targetSizeKB: number
}

export type CompressionSource = 'browser' | 'server'

export interface CompressionResult {
  blob: Blob
  source: CompressionSource
  compressedSize: number
  savings: number
}
