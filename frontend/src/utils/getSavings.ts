export function getSavings(original: number, compressed: number): number {
  if (original === 0) return 0
  return Math.round(((original - compressed) / original) * 100)
}
