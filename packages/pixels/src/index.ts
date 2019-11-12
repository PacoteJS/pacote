import { getStyle } from '@pacote/get-style'

const PIXELS_PER_INCH = 96
const MILLIMETRES_PER_INCH = 25.4
const POINTS_PER_INCH = 72
const PICAS_PER_INCH = 6

function fontSize(element?: HTMLElement | null): string {
  return element
    ? getStyle(element, 'fontSize') || fontSize(element.parentElement)
    : getStyle(window.document.documentElement, 'fontSize')
}

function parse(providedLength?: string | null): [number, string] {
  const length = providedLength || '0'
  const value = parseFloat(length)
  const match = length.match(/[\d-.]+(\w+)$/)
  const unit = match?.[1] ?? ''
  return [value, unit.toLowerCase()]
}

export function pixels(length: string, element?: HTMLElement | null): number {
  const view = element?.ownerDocument?.defaultView ?? window
  const root = view.document.documentElement || view.document.body

  const [value, unit] = parse(length)

  switch (unit) {
    case 'rem':
      return value * pixels(fontSize(window.document.documentElement))

    case 'em':
      return value * pixels(fontSize(element), element?.parentElement)

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

    case 'vh':
      return (value * view.innerHeight || root.clientWidth) / 100

    case 'vw':
      return (value * view.innerWidth || root.clientHeight) / 100

    case 'vmin':
      return (
        (value *
          Math.min(
            view.innerWidth || root.clientWidth,
            view.innerHeight || root.clientHeight
          )) /
        100
      )

    case 'vmax':
      return (
        (value *
          Math.max(
            view.innerWidth || root.clientWidth,
            view.innerHeight || root.clientHeight
          )) /
        100
      )

    default:
      return value
  }
}
