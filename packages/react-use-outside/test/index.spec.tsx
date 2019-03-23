import React from 'react'
import { render, cleanup, act, fireEvent } from 'react-testing-library'
import { useOutside } from '../src'

beforeEach(cleanup)

test.each([
  ['click', fireEvent.click],
  ['touchend', fireEvent.touchEnd],
  ['mouseover', fireEvent.mouseOver]
])(
  'handler is called on %s outside',
  (
    type: keyof DocumentEventMap,
    fireFunction: (element: Element | Window, options?: {}) => boolean
  ) => {
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

    act(() => {
      fireFunction(getByText('Outside'))
    })

    expect(handler).toHaveBeenCalled()
  }
)

test.each([
  ['click', fireEvent.click],
  ['touchend', fireEvent.touchEnd],
  ['mouseover', fireEvent.mouseOver]
])(
  'handler is not called on %s inside',
  (
    type: keyof DocumentEventMap,
    fireFunction: (element: Element | Window, options?: {}) => boolean
  ) => {
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

    act(() => {
      fireFunction(getByText('Inside'))
    })

    expect(handler).not.toHaveBeenCalled()
  }
)

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

  act(() => {
    fireEvent.click(getByText('Outside'))
    fireEvent.touchEnd(getByText('Outside'))
  })

  expect(handler).toHaveBeenCalledTimes(2)
})
