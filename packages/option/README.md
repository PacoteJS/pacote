# @pacote/option

![version](https://badgen.net/npm/v/@pacote/option)
![minified](https://badgen.net/bundlephobia/min/@pacote/option)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/option)

[Option](https://doc.rust-lang.org/std/option/enum.Option.html) type inspired by Rust. It represents an optional value, an `Option` is either `Some` concrete value or it is `None`.

## Installation

```bash
yarn add @pacote/option
```

## Usage

```typescript
import { None, Some, map } from '@pacote/option'

function divide(numerator: number, denominator: number): Option<number> {
  return denominator === 0 : None ? Some(numerator / denominator)
}

map(n => n + 1, divide(4, 2)) // => Some(3)
map(n => n + 1, divide(4, 0)) // => None
```

## Type

`Option<T> = None | Some<T>`

## Constructors

### `None: None`

`None` represents no value.

### `Some<T>(value: T): Some<T>`

`Some()` represents a value of type `T`.

## Functions

### `tryCatch<T>(fn: () => T): Option<T>`

Creates a new instance of `Option` based on a function call. If the function
throws an error, it returns `None`. Otherwise, it returns the result value in a
`Some`.

### `ofNullable<T>(value?: T | null): Option<T>`

Creates a new instance of `Option` based on the value being passed. If `null` or
`undefined`, it returns `None`. Otherwise, it returns `Some(value)`.

### `isSome<T>(option: Option<T>): boolean`

Returns `true` if the passed option is a `Some`. Otherwise, it returns `false`.

### `isNone<T>(option: Option<T>): boolean`

Returns `true` if the passed option is a `None`. Otherwise, it returns `false`.

### `contains<T>(match: T, option: Option<T>): boolean`

Returns `true` if the `Some` value is the same as `match`. Otherwise, it returns
`false`.

### `flatten<T>(option: Option<Option<T>>): Option<T>`

Converts `Option<Option<T>>` to `Option<T>`.

### `getOrElse<T>(onNone: () => T, option: Option<T>): T`

Returns the value contained in the option. If the option is `None`, it evaluates
the provided function for an alternative.

### `map<T, U>(fn: (value: T) => U, option: Option<T>): Option<U>`

Maps an `Option<T>` to `Option<U>` by applying a function to a contained value.

### `flatMap<T, U>(fn: (value: T) => Option<U>, option: Option<T>): Option<U>`

Returns `None` if the option is `None`, otherwise calls the function with the
wrapped value and returns the result.

### `fold<T, U>(onSome: (value: T) => U, onNone: () => U, option: Option<T>): U`

Applies the `onSome` function to the contained value, otherwise it computes a
default using `onNone`.

### `filter<T>(predicate: (value: T) => boolean, option: Option<T>): Option<T>`

Returns `None` if the option is `None`, otherwise calls `predicate` with the
wrapped value and returns:

- `Some(T)` if `predicate` returns `true`, and
- `None` if `predicate` returns `false`.

### `or<T>(alternative: Option<T>, option: Option<T>): Option<T>`

Returns the option if it contains a value, otherwise returns the alternative.

### `and<T>(alternative: Option<T>, option: Option<T>): Option<T>`

Returns `None` if the option is `None`, otherwise returns the alternative.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
