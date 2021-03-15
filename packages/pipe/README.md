# @pacote/pipe

![version](https://badgen.net/npm/v/@pacote/pipe)
![minified](https://badgen.net/bundlephobia/min/@pacote/pipe)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/pipe)

Chain function calls with right-composition, improving readability when chaining several functions together.

## Installation

```bash
yarn add @pacote/pipe
```

## Usage

```typescript
import { pipe } from '@pacote/pipe'

const doubleSay = (text: string) => text + ', ' + text
const capitalize = (text: string) => text[0].toUpperCase() + text.substring(1)
const exclaim = (text: string) => text + '!'

exclaim(capitalize(doubleSay('hello'))) // => 'Hello, hello!'

pipe('hello').then(doubleSay).then(capitalize).then(exclaim).value // => 'Hello, hello!'
```

### `pipe<T>(value: T): PipedResult<T>`

`pipe()` takes a value of type `T` and returns a `PipedResult<T>` object. This
contains the input value in the `value` property and a `then` method.

The `then()` method accepts a `T` to `R` function, returning a `PipedResult<R>`,
which allows you to chain another `then()` call or inspect the result by
accessing `value`.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
