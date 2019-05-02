const PIXELS_PER_INCH = window.devicePixelRatio * 96
const MILLIMETRES_PER_INCH = 25.4
const POINTS_PER_INCH = 72
const PICAS_PER_INCH = 6

function computedFontSize(element: HTMLElement): string {
  return window.getComputedStyle(element).fontSize || ''
}

function fontSize(element?: HTMLElement | null): string {
  return element
    ? computedFontSize(element) || fontSize(element.parentElement)
    : computedFontSize(window.document.documentElement)
}

function parse(providedLength?: string | null): [number, string] {
  const length = providedLength || '0'
  const value = parseFloat(length)
  const match = length.match(/[\d-.]+(\w+)$/)
  const unit = match && match.length > 1 ? match[1] : ''
  return [value, unit]
}

export function pixels(length: string, element?: HTMLElement | null): number {
  const [value, unit] = parse(length)

  switch (unit) {
    case 'rem':
      return value * pixels(fontSize(window.document.documentElement))

    case 'em':
      return value * pixels(fontSize(element), element && element.parentElement)

    case 'in':
      return value * PIXELS_PER_INCH

    case 'q':
      return (value * PIXELS_PER_INCH) / MILLIMETRES_PER_INCH / 4

    case 'mm':
      return (value * PIXELS_PER_INCH) / MILLIMETRES_PER_INCH

    case 'cm':
      return (value * PIXELS_PER_INCH * 10) / MILLIMETRES_PER_INCH

    case 'pt':
      return (value * PIXELS_PER_INCH) / POINTS_PER_INCH

    case 'pc':
      return (value * PIXELS_PER_INCH) / PICAS_PER_INCH

    default:
      return value
  }
}
