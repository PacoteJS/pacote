export function getStyle(
  element: HTMLElement,
  property: keyof CSSStyleDeclaration
): string {
  // eslint-disable-next-line no-undef
  const view = element.ownerDocument?.defaultView || window
  const style = view.getComputedStyle(element)
  return style.getPropertyValue(property as string) || style[property]
}
