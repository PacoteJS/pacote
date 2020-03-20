# @pacote/option

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/result)
![minified](https://badgen.net/bundlephobia/min/@pacote/result)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/result)

[Result](https://doc.rust-lang.org/std/result/enum.Result.html) type inspired by Rust. It represents either a success (`Ok`) or an error (`Err`).

## Installation

```bash
yarn add @pacote/result
```

## Usage

```typescript
import { Ok, Err } from '@pacote/result'

function divide(numerator: number, denominator: number): Option<number> {
  return denominator === 0 : Err('division by zero') ? Ok(numerator / denominator)
}

map(n => n + 1, divide(4, 2)) // => Ok(3)
map(n => n + 1, divide(4, 0)) // => Err('division by zero')
```

## Type

`Result<T, E> = Ok<T> | Err<E>`

## Constructors

### `Ok<T>(value: T): Result<T, never>`

`Ok()` wraps the success value.

### `Err<E>(value: E): Result<never, E>`

`Err()` wraps the error value.

## Functions

TODO: Documentation

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
