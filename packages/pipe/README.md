# @pacote/pipe

![version](https://badgen.net/npm/v/@pacote/pipe)
![minified](https://badgen.net/bundlephobia/min/@pacote/pipe)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/pipe)

Chain function calls with right-composition, improving readability by declaring
a sequence of functions left-to-right in the order they are applied.

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

pipe('hello', doubleSay, capitalize, exclaim) // => 'Hello, hello!'
```

### `pipe(initial: unknown, ...fns: readonly Function[]): unknown`

`pipe()` allows you to pass a value into a sequence of functions chained
left-to-right.

It takes an argument of any type plus any number of functions that accept the
preceding result, then feeds the first argument into the first function, the
output of the first function into the second function, and so on until the
output of the last function is finally returned.

Given three functions `f`, `g`, and `h`:

```typescript
const result = pipe(x, f, g, h) // equivalent to h(g(f(x)))
```

### `flow(...fns: readonly Function[]): Function`

`flow()` lets you chain functions left-to-right in a point-free manner.

It takes any number of functions that accept the preceding result, and returns
a composed function that takes an initial value and returns the last function
output after the initial value is chained through the intervening functions.

Given three functions `f`, `g`, and `h`:

```typescript
const fn = flow(f, g, h) // equivalent to (x) => h(g(f(x)))
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
