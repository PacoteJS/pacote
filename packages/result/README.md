# @pacote/option

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
import { Ok, Err, map } from '@pacote/result'

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

### `ofNullable<T, E>(error: E, value: T): Result<T, E>`

Creates a new instance of `Result` based on the value being passed. If `null` or
`undefined`, it returns `Err(error)`. Otherwise, it returns `Ok(value)`.

### `ofPromise<T, Error>(promise: Promise<T>): Promise<Result<T, Error>>`

Creates a new instance of `Promise<Result<T, Error>>` based on whether the
provided promise resolves or not.

If it resolves, a `Promise` of `Ok` with the resolved value is returned.
Otherwise, a `Promise` of `Err` with the rejection error is returned. In either
case, the newly returned promise will always resolve.

### `isOk<T, E>(value: Result<T, E>): boolean`

Returns `true` if the passed result is `Ok`. Otherwise, it returns `false`.

### `isErr<T, E>(value: Result<T, E>): boolean`

Returns `true` if the passed result is `Err`. Otherwise, it returns `false`.

### `getOrElse<T, E>(fn: (err: E) => T, result: Result<T, E>): T`

Returns the value contained in the result. If the result is `Err`, it evaluates
the provided function for an alternative.

### `ok<T, E>(result: Result<T, E>): Option<T>`

Evaluates the result and returns an `Option` that is:

- `None` if the result is `Err`, or
- `Some` wrapping the result value if it's `Ok`.

### `err<T, E>(result: Result<T, E>): Option<E>`

Evaluates the result and returns an `Option` that is:

- `None` if the result is `Ok`, or
- `Some` wrapping the result error if it's `Err`.

### `map<T, E, U>(fn: (value: T) => U, result: Result<T, E>): Result<U, E>`

Maps a `Result<T, E>` to `Result<U, E>` by applying a function to the contained
value.

### `mapErr<T, E, F>(fn: (value: E) => F, result: Result<T, E>): Result<T, F>`

Maps a `Result<T, E>` to `Result<T, F>` by applying a function to the contained
error.

### `flatMap<T, E, U>(fn: (value: T) => Result<U, E>, result: Result<T, E>): Result<U, E>`

Calls `fn` if the result is `Ok`, otherwise returns the `Err` value.

### `flatten<T, E>(result: Result<Result<T, E>, E>): Result<T, E>`

Converts `Result<Result<T, E>, E>` to `Result<T, E>`.

### `fold<T, E, R>(onOk: (ok: T) => R, onErr: (err: E) => R, result: Result<T, E>): R`

Applies the `onOk` function to the value contained in `Ok`, otherwise it
computes a default using `onErr` if it is an error.

### `or<T, E>(alternative: Result<T, E>, result: Result<T, E>): Result<T, E>`

Returns the result if it is `Ok`, otherwise returns the alternative.

### `and<T, E, U>(alternative: Result<U, E>, result: Result<T, E>): Result<U, E>`

Returns the result if it is `Err`, otherwise returns the alternative.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
