/**
 * Reads an element's computed CSS property value.
 *
 * @param element - Element whose computed style to read.
 * @param property - CSS property name.
 * @returns The computed property value.
 * @example
 * ```typescript
 * import { getStyle } from '@pacote/get-style'
 *
 * // When the body has a font size of 20px:
 * getStyle(document.body, 'fontSize') // => '20px'
 * ```
 */
export function getStyle(
  element: HTMLElement,
  property: keyof CSSStyleDeclaration,
): string {
  const view = element.ownerDocument?.defaultView || window
  const style = view.getComputedStyle(element)
  return (
    style.getPropertyValue(property as string) || (style[property] as string)
  )
}
