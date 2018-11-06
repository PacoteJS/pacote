import { createAction, isAction } from '../src/index'

test('creates an action creator', () => {
  const testAction = createAction<void>('@@TEST/BASE')
  const action = testAction()
  expect(action).toEqual({ type: '@@TEST/BASE' })
})

test('creates an action creator that takes a payload', () => {
  const testAction = createAction<{ name: string }>('@@TEST/PAYLOAD')
  const action = testAction({ name: 'test' })
  expect(action).toEqual({ type: '@@TEST/PAYLOAD', payload: { name: 'test' } })
})

test('creates an action creator that takes payload and metadata', () => {
  const testAction = createAction<{ name: string }>('@@TEST/META')
  const action = testAction({ name: 'test' }, { test: 'ok' })
  expect(action).toEqual({
    type: '@@TEST/META',
    payload: { name: 'test' },
    meta: { test: 'ok' }
  })
})

test('creates an action creator that takes an error', () => {
  const testAction = createAction<{ age: number }>('@@TEST/ERROR')
  const error = new Error('test')
  const action = testAction(error)
  expect(action).toEqual({ type: '@@TEST/ERROR', payload: error, error: true })
})

test('matches action using action creator', () => {
  const testAction = createAction<{ age: number }>('@@TEST/MATCHER')
  const action = testAction({ age: 18 }) as any
  expect(isAction(testAction, action)).toBe(true)

  if (isAction(testAction, action)) {
    expect(action.payload.age).toBe(18)
  }
})
