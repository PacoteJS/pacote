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

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
