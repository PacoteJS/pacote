import { createAction, isAction, reduceFromState } from '../src/index'

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

test('matches action using action creator', () => {
  const testAction = createAction<{ age: number }>('@@TEST/MATCHER')
  const action = testAction({ age: 18 }) as any
  expect(isAction(testAction, action)).toBe(true)

  if (isAction(testAction, action)) {
    expect(action.payload.age).toBe(18)
  }
})

test('reducer has initial state', () => {
  const initialState = 'initialState'
  const reducer = reduceFromState(initialState)
  const testAction = createAction<void>('@@TEST')
  expect(reducer.run(undefined, testAction())).toEqual(initialState)
})

test('reducer matches a single action', () => {
  const person = createAction<{ name: string }>('@@TEST/PERSON')
  const car = createAction<{ brand: string }>('@@TEST/CAR')

  const reducer = reduceFromState({ now: '', then: '' })
    .on(person, (s, a) => ({ now: a.payload.name, then: s.now }))
    .on(car, (s, a) => ({ now: a.payload.brand, then: s.now })).run

  const state = { now: 'Test', then: '' }

  expect(reducer(state, person({ name: 'Marty McFly' }))).toEqual({
    now: 'Marty McFly',
    then: 'Test'
  })

  expect(reducer(state, car({ brand: 'DeLorean' }))).toEqual({
    now: 'DeLorean',
    then: 'Test'
  })
})

test('reducer matches a list of actions', () => {
  const person = createAction<{ name: string }>('@@TEST/PERSON')
  const dog = createAction<{ name: string }>('@@TEST/DOG')

  const reducer = reduceFromState({ now: '', then: '' }).on(
    [person, dog],
    (s, a) => ({ now: a.payload.name, then: s.now })
  ).run

  const state = { now: 'Test', then: '' }

  expect(reducer(state, person({ name: 'Marty McFly' }))).toEqual({
    now: 'Marty McFly',
    then: 'Test'
  })

  expect(reducer(state, dog({ name: 'Einstein' }))).toEqual({
    now: 'Einstein',
    then: 'Test'
  })
})
