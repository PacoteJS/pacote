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

pipe('hello').map(doubleSay).map(capitalize).map(exclaim).value // => 'Hello, hello!'
```

### `pipe<T>(value: T): PipeFunctor<T>`

`pipe()` takes a value of type `T` and returns a `PipeFunctor<T>` object. This
contains the input value in the `value` property and a `map` method.

The `map()` method accepts a `T` to `R` function, returning a `PipeFunctor<R>`,
which allows you to chain another `map()` call or inspect the result by
accessing `value`.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
