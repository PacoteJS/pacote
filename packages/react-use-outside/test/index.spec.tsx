/**
 * @vitest-environment jsdom
 */

import { cleanup, fireEvent, render } from '@testing-library/react'
// biome-ignore lint/correctness/noUnusedImports: required to render JSX
import React from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import { useOutside } from '../src'

function renderTestComponent(
  type: keyof DocumentEventMap | (keyof DocumentEventMap)[],
  handler: EventListener,
) {
  const Test = () => {
    const ref = useOutside<HTMLDivElement>(type, handler)
    return (
      <>
        <div ref={ref}>Inside</div>
        <div>Outside</div>
      </>
    )
  }

  return render(<Test />)
}

afterEach(() => {
  cleanup()
})

test.each<
  [
    keyof DocumentEventMap,
    (element: Element | Window, options?: Record<string, unknown>) => boolean,
  ]
>([
  ['click', fireEvent.click],
  ['touchend', fireEvent.touchEnd],
  ['mouseover', fireEvent.mouseOver],
])('handler is called on %s outside', (type, fireFunction) => {
  const handler = vi.fn()
  const screen = renderTestComponent(type, handler)
  fireFunction(screen.getByText('Outside'))
  expect(handler).toHaveBeenCalled()
})

test.each<
  [
    keyof DocumentEventMap,
    (element: Element | Window, options?: Record<string, unknown>) => boolean,
  ]
>([
  ['click', fireEvent.click],
  ['touchend', fireEvent.touchEnd],
  ['mouseover', fireEvent.mouseOver],
])('handler is not called on %s inside', (type, fireFunction) => {
  const handler = vi.fn()
  const screen = renderTestComponent(type, handler)
  fireFunction(screen.getByText('Inside'))
  expect(handler).not.toHaveBeenCalled()
})

test('handler is called for multiple event types', () => {
  const handler = vi.fn()
  const screen = renderTestComponent(['click', 'touchend'], handler)
  fireEvent.click(screen.getByText('Outside'))
  fireEvent.touchEnd(screen.getByText('Outside'))
  expect(handler).toHaveBeenCalledTimes(2)
})
