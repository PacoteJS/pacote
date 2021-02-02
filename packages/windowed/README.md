# @pacote/windowed

![version](https://badgen.net/npm/v/@pacote/windowed)
![minified](https://badgen.net/bundlephobia/min/@pacote/windowed)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/windowed)

Returns a snapshot array of a window sliding along an array, inspired by
Kotlin's [`windowed`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html) method.

## Installation

```bash
yarn add @pacote/windowed
```

## Usage

```typescript
import { windowed } from '@pacote/windowed'

const source = [1, 2, 3, 4]

windowed(2, source) // => [[1, 2], [2, 3], [3, 4]]
windowed(3, source) // => [[1, 2, 3], [2, 3, 4]]
windowed(2, 2, source) // => [[1, 2], [3, 4]]
```

### `windowed<T>(size: number, step: number = 1, collection: T[]): T[][]`

`windowed()` returns a snapshot array of a window of the provided `size` sliding
along the provided array with the provided `step`.

Both size and step must be positive and can be greater than the number of
elements in this collection.

#### Arguments

- `size`: the number of elements to take in each window.
- `step`: the number of elements to move the window forward by on an each step, by default `1`.
- `collection`: the array the window slides along.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
