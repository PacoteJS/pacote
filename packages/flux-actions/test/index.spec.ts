import { assert, anything, property, string } from 'fast-check'
import { expect, test } from 'vitest'
import { createAction, isType, reducerFromState } from '../src/index'

test('creates an action creator', () => {
  assert(
    property(string(), (type) => {
      const testAction = createAction(type)
      expect(testAction()).toEqual({ type })
    }),
  )
})

test('creates an action creator that takes a payload', () => {
  assert(
    property(string(), anything(), (type, payload) => {
      const testAction = createAction<unknown>(type)
      expect(testAction(payload)).toEqual({ type, payload })
    }),
  )
})

test('creates an action creator that takes payload and metadata', () => {
  assert(
    property(string(), anything(), anything(), (type, payload, meta) => {
      const testAction = createAction<unknown, unknown>(type)
      expect(testAction(payload, meta)).toEqual({ type, payload, meta })
    }),
  )
})

test('matches action using action creator', () => {
  const testAction = createAction<{ age: number }>('@@TEST/MATCHER')
  const action = testAction({ age: 18 })
  expect(isType(testAction, action)).toBe(true)
  expect(action.payload.age).toBe(18)
})

test('reducer has initial state', () => {
  const initialState = 'initialState'
  const testReducer = reducerFromState(initialState)
  const testAction = createAction<void>('@@TEST/INITIAL')
  expect(testReducer(undefined, testAction())).toEqual(initialState)
})

test.todo('reducer can be created without an initial state')

test('reducer is a function', () => {
  const testReducer = reducerFromState('initialState')
  expect(typeof testReducer).toBe('function')
})

test('reducer matches a single action', () => {
  const person = createAction<{ name: string }>('@@TEST/PERSON')
  const car = createAction<{ brand: string }>('@@TEST/CAR')

  const testReducer = reducerFromState<string[]>([])
    .on(person, (s, a) => [a.payload.name, ...s])
    .on(car, (s, a) => [a.payload.brand, ...s])

  const personState = testReducer(['Test'], person({ name: 'Marty McFly' }))
  expect(personState).toEqual(['Marty McFly', 'Test'])

  const carState = testReducer(['Test'], car({ brand: 'DeLorean' }))
  expect(carState).toEqual(['DeLorean', 'Test'])
})

test('reducer matches a list of actions', () => {
  const person = createAction<{ name: string }>('@@TEST/PERSON')
  const dog = createAction<{ name: string }>('@@TEST/DOG')

  const testReducer = reducerFromState<string[]>([]) //
    .on([person, dog], (s, a) => [a.payload.name, ...s])

  const personState = testReducer(['Test'], person({ name: 'Marty McFly' }))
  expect(personState).toEqual(['Marty McFly', 'Test'])

  const dogState = testReducer(['Test'], dog({ name: 'Einstein' }))
  expect(dogState).toEqual(['Einstein', 'Test'])
})

test('reducer is immutable', () => {
  const action = createAction('@@TEST/ACTION')
  const testReducer = reducerFromState('').on(action, () => 'immutability ok')
  testReducer.on(action, () => 'immutability nok')
  expect(testReducer(undefined, action())).toBe('immutability ok')
})
