import { createStore } from 'redux'
import { expect, test } from 'vitest'
import { createAction, reducerFromState } from '../src/index'

test('Redux integration', () => {
  const increment = createAction('INCREMENT')
  const counter = reducerFromState(0).on(increment, (s) => s + 1)

  const store = createStore(counter)
  store.dispatch(increment())
  expect(store.getState()).toBe(1)
})
