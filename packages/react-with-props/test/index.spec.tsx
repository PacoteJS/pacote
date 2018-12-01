import React, { FunctionComponent, ReactNode } from 'react'
import { render, cleanup } from 'react-testing-library'
import { withProps } from '../src'

beforeEach(cleanup)

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
  const Test: FunctionComponent<TestProps> = ({ name, value }) => (
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

test('wraps a DOM component and forwards props', () => {
  const Wrapped = withProps({}, 'footer')
  const { container: actual } = render(<Wrapped id="Test" />)
  const { container: expected } = render(<footer id="test" />)
  expect(actual.id).toEqual(expected.id)
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
