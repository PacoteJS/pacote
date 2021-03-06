# @pacote/array

![version](https://badgen.net/npm/v/@pacote/array)
![minified](https://badgen.net/bundlephobia/min/@pacote/array)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/array)

Extra Array functions.

## Installation

```bash
yarn add @pacote/array
```

## `associate<T, K, V>(transform: (value: T) => [K, V], array: readonly T[]): Record<K, V>`

`associate()` creates a new `Record` from an `array` of arbitrary values,
passing each through a `transform` function to obtain tuples of the target
`Record`'s keys and values.

### Usage

```typescript
import { associate } from '@pacote/array'

associate((s) => [s, s.length], ['abc', 'd']) // => { 'abc': 3, 'd': 1 }
```

### Arguments

- `transform`: the transformation function.
- `array`: the array to transform into a `Record`.

## `range(start: number, end: number): number[]`

`range()` returns an array of numbers between `start` and `end` (non inclusive).
The function is only able to generate ascending ranges.

### Usage

```typescript
import { range } from '@pacote/array'

range(1, 4) // => [1, 2, 3]
```

### Arguments

- `start`: the start of the range.
- `end`: the end of the range (not included).

## `windowed<T>(size: number, step: number = 1, collection: T[]): T[][]`

`windowed()` returns a snapshot array of a window of the provided `size` sliding
along the provided array with the provided `step`.

Both size and step must be positive and can be greater than the number of
elements in this collection.

Inspired by Kotlin's [`windowed`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html) method.

### Usage

```typescript
import { windowed } from '@pacote/array'

const array = [1, 2, 3, 4]

windowed(2, array) // => [[1, 2], [2, 3], [3, 4]]
windowed(3, array) // => [[1, 2, 3], [2, 3, 4]]
windowed(2, 2, array) // => [[1, 2], [3, 4]]
```

### Arguments

- `size`: the number of elements to take in each window.
- `step`: the number of elements to move the window forward by on an each step, by default `1`.
- `collection`: the array the window slides along.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
