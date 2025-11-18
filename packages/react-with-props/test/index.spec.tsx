/**
 * @vitest-environment jsdom
 */

import { cleanup, render, renderHook, screen } from '@testing-library/react'
import React from 'react'
import styled from 'styled-components'
import { afterEach, describe, expect, test } from 'vitest'
import { withDefaultProps, withProps } from '../src'

afterEach(() => {
  cleanup()
})

describe('withProps()', () => {
  test('wraps a component', () => {
    const Test = () => <>Test</>
    const Wrapped = withProps({}, Test)
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<Test />)
    expect(actual).toEqual(expected)
  })

  test('wraps a component and forwards props', () => {
    interface TestProps {
      text?: string
    }
    const Test = ({ text = '' }: TestProps) => <>{text}</>
    const Wrapped = withProps({}, Test)
    const { container: actual } = render(<Wrapped text="Test" />)
    const { container: expected } = render(<Test text="Test" />)
    expect(actual).toEqual(expected)
  })

  test('forwards children to components', () => {
    interface TestProps {
      children?: React.ReactNode
    }
    const Test = ({ children }: TestProps) => <>{children}</>
    const Wrapped = withProps({}, Test)
    const { container: actual } = render(
      <Wrapped>
        <span>Test</span>
      </Wrapped>,
    )
    const { container: expected } = render(
      <Test>
        <span>Test</span>
      </Test>,
    )
    expect(actual).toEqual(expected)
  })

  test('injects optional props into components', () => {
    interface TestProps {
      text?: string
    }
    const Test = ({ text }: TestProps) => <>{text}</>
    const Wrapped = withProps({ text: 'Test' }, Test)
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<Test text="Test" />)
    expect(actual).toEqual(expected)
  })

  test('injects mandatory props into components', () => {
    interface TestProps {
      name: string
      value: string
    }
    const Test = ({ name, value }: TestProps) => (
      <>
        {name}: {value}
      </>
    )
    const Wrapped = withProps({ name: 'Test' }, Test)
    const { container: actual } = render(<Wrapped value="OK" />)
    const { container: expected } = render(<Test name="Test" value="OK" />)
    expect(actual).toEqual(expected)
  })

  test('wraps a DOM component', () => {
    const Wrapped = withProps({}, 'header')
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<header />)
    expect(actual).toEqual(expected)
  })

  test('forwards props to DOM components', () => {
    const Wrapped = withProps({}, 'footer')
    const id = renderHook(React.useId)
    const { container: actual } = render(<Wrapped id={id.result.current} />)
    const { container: expected } = render(<footer id={id.result.current} />)
    expect(actual.id).toEqual(expected.id)
  })

  test('injects props into DOM components', () => {
    const id = renderHook(React.useId)
    const Wrapped = withProps({ id: id.result.current }, 'footer')
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<footer id={id.result.current} />)
    expect(actual.id).toEqual(expected.id)
  })

  test('forwards children to DOM components', () => {
    const Wrapped = withProps({}, 'div')
    const { container: actual } = render(
      <Wrapped>
        <span>Test</span>
      </Wrapped>,
    )
    const { container: expected } = render(
      <div>
        <span>Test</span>
      </div>,
    )
    expect(actual).toEqual(expected)
  })

  test('sets the display name', () => {
    const Test = () => <div>Test</div>
    const Wrapped = withProps({}, Test)
    expect(Wrapped.displayName).toEqual('WithProps(Test)')
  })

  test('sets the display name for DOM components', () => {
    const Wrapped = withProps({}, 'div')
    expect(Wrapped.displayName).toEqual('WithProps(div)')
  })

  test('injects props into components from a function', () => {
    interface TestProps {
      name: string
      value: string
    }
    const Test = ({ name, value }: TestProps) => (
      <>
        {name}: {value}
      </>
    )
    const injector = ({ foo = '' }) => ({ name: foo })
    const Wrapped = withProps(injector, Test)
    const { container: actual } = render(<Wrapped foo="Test" value="OK" />)
    const { container: expected } = render(<Test name="Test" value="OK" />)
    expect(actual).toEqual(expected)
  })

  test('styled-components compatibility', () => {
    const Wrapped = withProps({ title: 'Test' }, styled.button``)
    render(<Wrapped />)
    expect(screen.getByRole('button')).toHaveProperty('title', 'Test')
  })
})

describe('withDefaultProps()', () => {
  test('wraps a component', () => {
    const Test = () => <>Test</>
    const Wrapped = withDefaultProps({}, Test)
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<Test />)
    expect(actual).toEqual(expected)
  })

  test('wraps a component and forwards props', () => {
    interface TestProps {
      text?: string
    }
    const Test = ({ text = '' }: TestProps) => <>{text}</>
    const Wrapped = withDefaultProps({}, Test)
    const { container: actual } = render(<Wrapped text="Test" />)
    const { container: expected } = render(<Test text="Test" />)
    expect(actual).toEqual(expected)
  })

  test('forwards children to components', () => {
    interface TestProps {
      children?: React.ReactNode
    }
    const Test = ({ children }: TestProps) => <>{children}</>
    const Wrapped = withDefaultProps({}, Test)
    const { container: actual } = render(
      <Wrapped>
        <span>Test</span>
      </Wrapped>,
    )
    const { container: expected } = render(
      <Test>
        <span>Test</span>
      </Test>,
    )
    expect(actual).toEqual(expected)
  })

  test('injects optional props into components', () => {
    interface TestProps {
      text?: string
    }
    const Test = ({ text }: TestProps) => <>{text}</>
    const Wrapped = withDefaultProps({ text: 'Test' }, Test)
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<Test text="Test" />)
    expect(actual).toEqual(expected)
  })

  test('injects mandatory props into components', () => {
    interface TestProps {
      name: string
      value: string
    }
    const Test = ({ name, value }: TestProps) => (
      <>
        {name}: {value}
      </>
    )
    const Wrapped = withDefaultProps({ name: 'Test' }, Test)
    const { container: actual } = render(<Wrapped value="OK" />)
    const { container: expected } = render(<Test name="Test" value="OK" />)
    expect(actual).toEqual(expected)
  })

  test('overrides injected props into components', () => {
    interface TestProps {
      name: string
      value: string
    }
    const Test = ({ name, value }: TestProps) => (
      <>
        {name}: {value}
      </>
    )
    const Wrapped = withDefaultProps({ name: 'Test' }, Test)
    const { container: actual } = render(<Wrapped name="Override" value="OK" />)
    const { container: expected } = render(<Test name="Override" value="OK" />)
    expect(actual).toEqual(expected)
  })

  test('wraps a DOM component', () => {
    const Wrapped = withDefaultProps({}, 'header')
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<header />)
    expect(actual).toEqual(expected)
  })

  test('forwards props to DOM components', () => {
    const id = renderHook(React.useId)
    const Wrapped = withDefaultProps({}, 'footer')
    const { container: actual } = render(<Wrapped id={id.result.current} />)
    const { container: expected } = render(<footer id={id.result.current} />)
    expect(actual.id).toBe(expected.id)
  })

  test('injects props into DOM components', () => {
    const id = renderHook(React.useId)
    const Wrapped = withDefaultProps({ id: id.result.current }, 'footer')
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<footer id={id.result.current} />)
    expect(actual.id).toBe(expected.id)
  })

  test('forwards children to DOM components', () => {
    const Wrapped = withDefaultProps({}, 'div')
    const { container: actual } = render(
      <Wrapped>
        <span>Test</span>
      </Wrapped>,
    )
    const { container: expected } = render(
      <div>
        <span>Test</span>
      </div>,
    )
    expect(actual).toEqual(expected)
  })

  test('overrides props injected into DOM components', () => {
    const id = renderHook(React.useId)
    const Wrapped = withDefaultProps({ id: 'test' }, 'footer')
    const { container: actual } = render(<Wrapped id={id.result.current} />)
    const { container: expected } = render(<footer id={id.result.current} />)
    expect(actual.id).toBe(expected.id)
  })

  test('sets the display name', () => {
    const Test = () => <div>Test</div>
    const Wrapped = withDefaultProps({}, Test)
    expect(Wrapped.displayName).toBe('WithDefaultProps(Test)')
  })

  test('sets the display name for DOM components', () => {
    const Wrapped = withDefaultProps({}, 'div')
    expect(Wrapped.displayName).toBe('WithDefaultProps(div)')
  })

  test('styled-components compatibility', () => {
    const Wrapped = withDefaultProps({ title: 'Test' }, styled.button``)
    render(<Wrapped />)
    expect(screen.getByRole('button')).toHaveProperty('title', 'Test')
  })
})
