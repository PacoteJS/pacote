# @pacote/flux-actions

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)

Typed actions and reducers for Flux architectures.

## Installation

```bash
yarn add @pacote/flux-actions
```

## Usage

### `createAction<Payload>(type: string)`

#### Action payloads

```typescript
import { createAction } from '@pacote/flux-actions'
const travel = createAction<{ year: number }>('TRAVEL')
```

Calling `travel({ year: 1955 })` will generate the following action object:

```javascript
{
  type: 'TRAVEL',
  payload: {
    year: 'world'
  }
}
```

#### Action metadata

The action creator supports an optional metadata parameter. For example, `travel({ year: 1955 }, meta: { test: true })` will create:

```javascript
{
  type: 'GREET',
  payload: {
    year: 1955
  },
  meta: {
    test: true
  }
}
```

#### Actions with errors

The action creator does not handle errors (like in Flux Standard Actions). Instead, consider using monadic objects like `Either`:

```typescript
import { createAction } from '@pacote/flux-actions'
import { Either, left, right } from 'fp-ts/lib/Either'

const travel = createAction<Either<Error, { year: number }>>('TRAVEL')

travel(right({ year: 2015 }))
travel(left(Error()))
```

### `isAction<Payload>(creator: ActionCreator<Payload>, action: Action<Payload>)`

Checks whether an action matches the provided type. This ensures the action is properly typed inside the guard block.

```typescript
import { createAction, isAction } from '@pacote/flux-actions'

const travel = createAction<{ year: number }>('TRAVEL')
const action = travel({ year: 1955 })

if (isType(travel, action)) {
  // action.payload is typed inside guard
  console.log(action.payload.year)
}
```

### `reduceFromState(initialState: State)`

Creates a reducer which matches action handlers to appropriate types.

```typescript
import { createAction, reduceFromState } from '@pacote/flux-actions'

const person = createAction<{ name: string }>('PERSON')
const dog = createAction<{ name: string }>('DOG')
const car = createAction<{ brand: string }>('CAR')

const reducer = reduceFromState({ now: 'None', then: '' })
  // Matches multiple actions:
  .on([person, dog], (s, a) => ({ now: a.payload.name, then: s.now }))
  // Matches a single action:
  .on(car, (s, a) => ({ now: a.payload.brand, then: s.now }))

const s2 = reducer.run(undefined, person({ name: 'Marty McFly' }))
// { now: 'Marty McFly', then: 'None' })

const s3 = reducer.run(s2, dog({ name: 'Einstein' }))
// { now: 'Einstein', then: 'Marty McFly' })

const s4 = reducer.run(s3, car({ brand: 'DeLorean' }))
// { now: 'DeLorean', then: 'Einstein' })
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
