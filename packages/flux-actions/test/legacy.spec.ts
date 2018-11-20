import { createAction, reducerFromState } from '../src'

test('reducerFromState() returns a legacy .run() method', () => {
  const action = createAction('@@TEST/ACTION')
  const reducer = reducerFromState('')
  expect(reducer.run('unchanged', action())).toBe('unchanged')
})

test('reducerFromState().on() returns a legacy .run() method', () => {
  const name = createAction<string>('@@TEST/NAME')
  const reducer = reducerFromState('').on(name, (s, a) => a.payload)
  expect(reducer.run('', name('Dr Emmet L. Brown'))).toBe('Dr Emmet L. Brown')
})
