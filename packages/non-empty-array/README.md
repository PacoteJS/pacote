# @pacote/non-empty-array

![version](https://badgen.net/npm/v/@pacote/non-empty-array)
![minified](https://badgen.net/bundlephobia/min/@pacote/non-empty-array)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/non-empty-array)

An array type guaranteed to have at least one element.

The module consumes and returns plain JavaScript arrays, but is typed to prevent
the TypeScript compiler from handling arrays that might be empty.

One instance where non-empty arrays are useful is when combined with
[`@pacote/result`](../result/) to create a `Validation` data type that
accumulates multiple errors as `Result<T, NonEmptyArray<Error>>`. This is
because a failing computation _must_ have at least one error.

## Installation

```bash
yarn add @pacote/non-empty-array
```

## Usage

```typescript
import { fromElements, fromArray, concat } from '@pacote/non-empty-array'

fromElements(1, 2, 3) // => [1, 2, 3]
fromElements() // => TypeScript compilation error

fromArray([1, 2, 3]) // => Some([1, 2, 3])
fromArray([]) // => None

concat([1, 2], [3, 4]) // => [1, 2, 3, 4]
concat([1], []) // => [1]
concat([], []) // => TypeScript compilation error
```

### `fromElements<T>(first: T, ...rest: readonly T[]): NonEmptyArray<T>`

`fromElements()` creates a new `NonEmptyArray` from the provided arguments.
At least one argument is required.

### `fromArray<T>(array: readonly T[]): Option<NonEmptyArray<T>>`

`fromArray()` creates a new `NonEmptyArray` from an arbitrary array in a
typesafe manner, returning `Some(array)` if it is not empty. If it's empty, it
returns `None`.

### `isNonEmptyArray<T>(value: any): value is NonEmptyArray<T>`

`isNonEmptyArray()` returns `true` if the passed value is an array that is not
empty. Otherwise, it returns `false`.

### `concat<T>(before: readonly T[], after: NonEmptyArray<T>): NonEmptyArray<T>`

`concat()` joins two `Array`s or `NonEmptyArray`s in order, returning a new
`NonEmptyArray`. At least one of the provided arrays must be non-empty.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
