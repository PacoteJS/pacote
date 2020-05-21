export function getStyle(
  element: HTMLElement,
  property: keyof CSSStyleDeclaration
): string {
  const view = element.ownerDocument?.defaultView || window
  const style = view.getComputedStyle(element)
  return (
    style.getPropertyValue(property as string) || (style[property] as string)
  )
}
