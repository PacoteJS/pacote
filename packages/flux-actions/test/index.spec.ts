import { createAction, isType, reducerFromState } from '../src/index'
import { assert, property, string, anything } from 'fast-check'

test('creates an action creator', () => {
  assert(
    property(string(), type => {
      const testAction = createAction(type)
      expect(testAction()).toEqual({ type })
    })
  )
})

test('creates an action creator that takes a payload', () => {
  assert(
    property(string(), anything(), (type, payload) => {
      const testAction = createAction(type)
      expect(testAction(payload)).toEqual({ type, payload })
    })
  )
})

test('creates an action creator that takes payload and metadata', () => {
  assert(
    property(string(), anything(), anything(), (type, payload, meta) => {
      const testAction = createAction(type)
      expect(testAction(payload, meta)).toEqual({ type, payload, meta })
    })
  )
})

test('matches action using action creator', () => {
  const testAction = createAction<{ age: number }>('@@TEST/MATCHER')
  const action = testAction({ age: 18 }) as any
  expect(isType(testAction, action)).toBe(true)

  if (isType(testAction, action)) {
    expect(action.payload.age).toBe(18)
  }
})

test('reducer has initial state', () => {
  const initialState = 'initialState'
  const reducer = reducerFromState(initialState)
  const testAction = createAction<void>('@@TEST')
  expect(reducer(undefined, testAction())).toEqual(initialState)
})

test('reducer is a function', () => {
  const reducer = reducerFromState('initialState')
  expect(typeof reducer).toBe('function')
})

test('reducer matches a single action', () => {
  const person = createAction<{ name: string }>('@@TEST/PERSON')
  const car = createAction<{ brand: string }>('@@TEST/CAR')

  const reducer = reducerFromState({ now: '', then: '' })
    .on(person, (s, a) => ({ now: a.payload.name, then: s.now }))
    .on(car, (s, a) => ({ now: a.payload.brand, then: s.now }))

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

  const reducer = reducerFromState({ now: '', then: '' }).on(
    [person, dog],
    (s, a) => ({ now: a.payload.name, then: s.now })
  )

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

test('reducer is immutable', () => {
  const action = createAction('@@TEST/ACTION')
  const reducer = reducerFromState('').on(action, () => 'immutability ok')
  reducer.on(action, () => 'immutability nok')
  expect(reducer(undefined, action())).toBe('immutability ok')
})
