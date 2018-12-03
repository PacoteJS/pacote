import React, { FunctionComponent, ReactNode } from 'react'
import { render, cleanup } from 'react-testing-library'
import { withProps, withDefaultProps } from '../src'

beforeEach(cleanup)

describe('withProps()', () => {
  test('wraps a component', () => {
    const Test = () => <>Test</>
    const Wrapped = withProps({}, Test)
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<Test />)
    expect(actual).toEqual(expected)
  })

  test('wraps a component and forwards props', () => {
    const Test: FunctionComponent<{ text?: string }> = ({ text = '' }) => (
      <>{text}</>
    )
    const Wrapped = withProps({}, Test)
    const { container: actual } = render(<Wrapped text="Test" />)
    const { container: expected } = render(<Test text="Test" />)
    expect(actual).toEqual(expected)
  })

  test('forwards children to components', () => {
    const Test = ({ children }: { children?: ReactNode }) => <>{children}</>
    const Wrapped = withProps({}, Test)
    const { container: actual } = render(
      <Wrapped>
        <span>Test</span>
      </Wrapped>
    )
    const { container: expected } = render(
      <Test>
        <span>Test</span>
      </Test>
    )
    expect(actual).toEqual(expected)
  })

  test('injects optional props into components', () => {
    const Test = ({ text }: { text?: string }) => <>{text}</>
    const Wrapped = withProps({ text: 'Test' }, Test)
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<Test text="Test" />)
    expect(actual).toEqual(expected)
  })

  test('injects mandatory props into components', () => {
    type TestProps = { name: string; value: string }
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
    const { container: actual } = render(<Wrapped id="test" />)
    const { container: expected } = render(<footer id="test" />)
    expect(actual.id).toEqual(expected.id)
  })

  test('inject props to DOM components', () => {
    const Wrapped = withProps({ id: 'test' }, 'footer')
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<footer id="test" />)
    expect(actual.id).toEqual(expected.id)
  })

  test('forwards children to DOM components', () => {
    const Wrapped = withProps({}, 'div')
    const { container: actual } = render(
      <Wrapped>
        <span>Test</span>
      </Wrapped>
    )
    const { container: expected } = render(
      <div>
        <span>Test</span>
      </div>
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
    const Test: FunctionComponent<{ text?: string }> = ({ text = '' }) => (
      <>{text}</>
    )
    const Wrapped = withDefaultProps({}, Test)
    const { container: actual } = render(<Wrapped text="Test" />)
    const { container: expected } = render(<Test text="Test" />)
    expect(actual).toEqual(expected)
  })

  test('forwards children to components', () => {
    const Test = ({ children }: { children?: ReactNode }) => <>{children}</>
    const Wrapped = withDefaultProps({}, Test)
    const { container: actual } = render(
      <Wrapped>
        <span>Test</span>
      </Wrapped>
    )
    const { container: expected } = render(
      <Test>
        <span>Test</span>
      </Test>
    )
    expect(actual).toEqual(expected)
  })

  test('injects optional props into components', () => {
    const Test = ({ text }: { text?: string }) => <>{text}</>
    const Wrapped = withDefaultProps({ text: 'Test' }, Test)
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<Test text="Test" />)
    expect(actual).toEqual(expected)
  })

  test('injects mandatory props into components', () => {
    type TestProps = { name: string; value: string }
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
    type TestProps = { name: string; value: string }
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
    const Wrapped = withDefaultProps({}, 'footer')
    const { container: actual } = render(<Wrapped id="test" />)
    const { container: expected } = render(<footer id="test" />)
    expect(actual.id).toEqual(expected.id)
  })

  test('injects props into DOM components', () => {
    const Wrapped = withDefaultProps({ id: 'test' }, 'footer')
    const { container: actual } = render(<Wrapped />)
    const { container: expected } = render(<footer id="test" />)
    expect(actual.id).toEqual(expected.id)
  })

  test('forwards children to DOM components', () => {
    const Wrapped = withDefaultProps({}, 'div')
    const { container: actual } = render(
      <Wrapped>
        <span>Test</span>
      </Wrapped>
    )
    const { container: expected } = render(
      <div>
        <span>Test</span>
      </div>
    )
    expect(actual).toEqual(expected)
  })

  test('overrides props injected into DOM components', () => {
    const Wrapped = withDefaultProps({ id: 'test' }, 'footer')
    const { container: actual } = render(<Wrapped id="override" />)
    const { container: expected } = render(<footer id="override" />)
    expect(actual.id).toEqual(expected.id)
  })

  test('sets the display name', () => {
    const Test = () => <div>Test</div>
    const Wrapped = withDefaultProps({}, Test)
    expect(Wrapped.displayName).toEqual('WithDefaultProps(Test)')
  })

  test('sets the display name for DOM components', () => {
    const Wrapped = withDefaultProps({}, 'div')
    expect(Wrapped.displayName).toEqual('WithDefaultProps(div)')
  })
})
