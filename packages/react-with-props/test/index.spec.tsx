import React from 'react'
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
  const Test = ({ text = '' }) => <>{text}</>
  const Wrapped = withProps({}, Test)
  const { container: actual } = render(<Wrapped text="Test" />)
  const { container: expected } = render(<Test text="Test" />)
  expect(actual).toEqual(expected)
})

test('wraps a component and injects optional props', () => {
  const Test = ({ text }: { text?: string }) => <>{text}</>
  const Wrapped = withProps({ text: 'Test' }, Test)
  const { container: actual } = render(<Wrapped />)
  const { container: expected } = render(<Test text="Test" />)
  expect(actual).toEqual(expected)
})

test('wraps a component and injects mandatory props', () => {
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

test('wraps a DOM component and forwards props', () => {
  const Wrapped = withProps({}, 'footer')
  const { container: actual } = render(<Wrapped id="test" />)
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
