import type { DimensionUnit } from '@/types'

const MM_PER_IN = 25.4
const CM_PER_IN = 2.54

/**
 * Convert a value from the given unit to pixels.
 * @param value  - the numeric value in `unit`
 * @param unit   - 'px' | 'in' | 'cm'
 * @param dpi    - dots-per-inch (used for 'in' and 'cm', ignored for 'px')
 */
export function toPx(value: number, unit: DimensionUnit, dpi: number): number {
  if (unit === 'px') return Math.round(value)
  if (unit === 'in') return Math.round(value * dpi)
  if (unit === 'cm') return Math.round((value / CM_PER_IN) * dpi)
  return Math.round(value)
}

/**
 * Convert pixels to the given unit.
 */
export function fromPx(px: number, unit: DimensionUnit, dpi: number): number {
  if (unit === 'px') return Math.round(px)
  if (unit === 'in') return +(px / dpi).toFixed(3)
  if (unit === 'cm') return +((px / dpi) * CM_PER_IN).toFixed(3)
  return px
}

/**
 * Pretty-print a dimension value with its unit label.
 * e.g. formatDimension(3.5, 'in') → '3.5 in'
 */
export function formatDimension(value: number, unit: DimensionUnit): string {
  if (unit === 'px') return `${Math.round(value)} px`
  if (unit === 'in') return `${value.toFixed(2)} in`
  if (unit === 'cm') return `${value.toFixed(2)} cm`
  return String(value)
}

/**
 * Return decimal precision appropriate for the unit.
 * px → 0 decimals, in/cm → 2 decimals
 */
export function unitDecimals(unit: DimensionUnit): number {
  return unit === 'px' ? 0 : 2
}

// ── Preset conversions used in ResizeControls ───────────────────────────────
export { MM_PER_IN, CM_PER_IN }
