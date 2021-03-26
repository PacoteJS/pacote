# @pacote/pipe

![version](https://badgen.net/npm/v/@pacote/pipe)
![minified](https://badgen.net/bundlephobia/min/@pacote/pipe)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/pipe)

Chain function calls with right-composition, improving readability when chaining
multiple functions together.

The point of this module is not brevity or performance, but being able to
declare a sequence of functions left-to-right in the order they are applied.

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

### `pipe<A0>(arg: A0): PipeFunctor<A0>`

`pipe()` allows you to pass a value into a sequence of functions chained
left-to-right.

It takes an argument of type `A0` and returns a `PipeFunctor<A0>` object.
This contains the input argument in the `value` property and a `then` method.

Each call of the `then()` method takes a `(An) => An+1` function, returning a
`PipeFunctor<An+1>`, which allows you to chain yet another function or inspect
the result by accessing `value`.

Given three functions `f`, `g`, and `h`, the following lines are equivalent:

```typescript
const result = h(g(f(x)))

const result = pipe(x).then(f).then(g).then(h).value
```

### `flow<A0, A1>(initialFn: (arg: A0) => A1): FlowFunctor<A0, A1>`

`flow()` lets you chain functions left-to-right in a point-free manner.

It takes a function of the type `(A0) => A1` and returns a
`FlowFunctor<A0, A1>` function. This is a clone of the passed function plus a
`then` method.

Each call of the `then()` method maps a `(An) => An+1` function, returning a
`FlowFunctor<A0, An+1>`, which allows you to chain yet another function.

Given three functions `f`, `g`, and `h`, the following lines are equivalent:

```typescript
const fn = (x) => h(g(f(x)))

const fn = flow(f).then(g).then(h)
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
