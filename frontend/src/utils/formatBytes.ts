export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(decimals)} KB`
  return `${(bytes / 1024 ** 2).toFixed(decimals)} MB`
}
