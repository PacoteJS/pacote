import { test, expect } from 'vitest'
import { createAction, reducerFromState } from '../src/index'
import { createStore } from 'redux'

test('Redux integration', () => {
  const increment = createAction('INCREMENT')
  const counter = reducerFromState(0).on(increment, (s) => s + 1)

  const store = createStore(counter)
  store.dispatch(increment())
  expect(store.getState()).toBe(1)
})
