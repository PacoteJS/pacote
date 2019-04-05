import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library'
import { useOutside } from '../src'

beforeEach(cleanup)

test.each<
  [keyof DocumentEventMap, (element: Element | Window, options?: {}) => boolean]
>([
  ['click', fireEvent.click],
  ['touchend', fireEvent.touchEnd],
  ['mouseover', fireEvent.mouseOver]
])('handler is called on %s outside', (type, fireFunction) => {
  const handler = jest.fn()

  const Test = () => {
    const ref = useOutside<HTMLDivElement>(type, handler)
    return (
      <>
        <div ref={ref}>Inside</div>
        <div>Outside</div>
      </>
    )
  }

  const { getByText } = render(<Test />)

  fireFunction(getByText('Outside'))

  expect(handler).toHaveBeenCalled()
})

test.each<
  [keyof DocumentEventMap, (element: Element | Window, options?: {}) => boolean]
>([
  ['click', fireEvent.click],
  ['touchend', fireEvent.touchEnd],
  ['mouseover', fireEvent.mouseOver]
])('handler is not called on %s inside', (type, fireFunction) => {
  const handler = jest.fn()

  const Test = () => {
    const ref = useOutside<HTMLDivElement>(type, handler)
    return (
      <>
        <div ref={ref}>Inside</div>
        <div>Outside</div>
      </>
    )
  }

  const { getByText } = render(<Test />)

  fireFunction(getByText('Inside'))

  expect(handler).not.toHaveBeenCalled()
})

test('handler is called for multiple event types', () => {
  const handler = jest.fn()

  const Test = () => {
    const ref = useOutside<HTMLDivElement>(['click', 'touchend'], handler)
    return (
      <>
        <div ref={ref}>Inside</div>
        <div>Outside</div>
      </>
    )
  }

  const { getByText } = render(<Test />)
  fireEvent.click(getByText('Outside'))
  fireEvent.touchEnd(getByText('Outside'))

  expect(handler).toHaveBeenCalledTimes(2)
})
