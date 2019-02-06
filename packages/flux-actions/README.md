# @pacote/flux-actions

[![Redux Demo](https://badgen.net/badge/codesandbox/redux%20demo/yellow)](https://codesandbox.io/s/xv62o57r3z)
[![React Hooks API Demo](https://badgen.net/badge/codesandbox/react%20hooks%20api%20demo/yellow)](https://codesandbox.io/s/2wx6n5zlj0)
[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/flux-actions)
![minified](https://badgen.net/bundlephobia/min/@pacote/flux-actions)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/flux-actions)

Typed actions and reducers for Flux and Flux-like architectures, including the [`useReducer` React hook](https://reactjs.org/docs/hooks-reference.html#usereducer).

## Demos

- [Counter using Redux](https://codesandbox.io/s/xv62o57r3z)
- [Counter using React Hooks](https://codesandbox.io/s/2wx6n5zlj0)

## Installation

```bash
yarn add @pacote/flux-actions
```

## Usage

### `createAction<Payload>(type: string)`

#### Action payloads

```typescript
import { createAction } from '@pacote/flux-actions'
const changeYear = createAction<number>('CHANGE_YEAR')
```

Calling `changeYear(1955)` will generate the following action object:

```javascript
{
  type: 'CHANGE_YEAR',
  payload: 1955
}
```

#### Action metadata

The action creator supports an optional metadata parameter. For example, `changeYear(1955, meta: { test: true })` will create:

```javascript
{
  type: 'CHANGE_YEAR',
  payload: 1955,
  meta: {
    test: true
  }
}
```

#### Actions with errors

Unlike Flux Standard Actions, the action creator does not handle errors. Instead, consider using monadic objects like `Either` to wrap error conditions:

```typescript
import { createAction } from '@pacote/flux-actions'
import { Either, tryCatch } from 'fp-ts/lib/Either'

const changeYear = createAction<Either<Error, number>>('CHANGE_YEAR')

changeYear(tryCatch(...))
```

### `isType<Payload>(creator: ActionCreator<Payload>, action: Action<Payload>)`

Checks whether an action matches the provided type. This ensures the action is properly typed inside the guard block.

```typescript
import { createAction, isType } from '@pacote/flux-actions'

const changeYear = createAction<number>('CHANGE_YEAR')
const action = changeYear(1985)

if (isType(changeYear, action)) {
  // action.payload is a number inside the guard
  console.log(action.payload)
}
```

### `reduceFromState(initialState: State)`

Creates a reducer which matches action handlers to appropriate types.

```typescript
import { createAction, reduceFromState } from '@pacote/flux-actions'

const person = createAction<{ name: string }>('PERSON')
const dog = createAction<{ name: string }>('DOG')
const car = createAction<{ brand: string }>('CAR')

const reducer = reducerFromState({ now: 'None', then: '' })
  // Matches multiple actions:
  .on([person, dog], (s, a) => ({ now: a.payload.name, then: s.now }))
  // Matches a single action:
  .on(car, (s, a) => ({ now: a.payload.brand, then: s.now }))

const s2 = reducer(undefined, person({ name: 'Marty McFly' }))
// { now: 'Marty McFly', then: 'None' })

const s3 = reducer(s2, dog({ name: 'Einstein' }))
// { now: 'Einstein', then: 'Marty McFly' })

const s4 = reducer(s3, car({ brand: 'DeLorean' }))
// { now: 'DeLorean', then: 'Einstein' })
```

Reducing actions with errors wrapped in `Either` could look something like this:

```typescript
import { createAction, reduceFromState } from '@pacote/flux-actions'
import { Either, tryCatch } from 'fp-ts/lib/Either'

type State = {
  year: number
  error: Error | null
}

const changeYear = createAction<Either<Error, number>>('CHANGE_YEAR')

const reducer = reducerFromState<State>({ year: 1985, error: null })
  .on(changeYear, (state, { payload } ) => payload.fold<State>(
    error => ({ ...state, error }),
    year => ({ year, error: null })
  ))

reducer(undefined, changeYear(tryCatch(...)))
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
