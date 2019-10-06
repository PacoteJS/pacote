# @pacote/iff

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/iff)
![minified](https://badgen.net/bundlephobia/min/@pacote/iff)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/iff)

Conditional expressions with Option support.

## Installation

```bash
yarn add @pacote/iff
```

## Usage

```typescript
import { iff } from '@pacote/iff'

iff(true, () => 1, () => 0) // => 1
iff(false, () => 1, () => 0) // => 10
iff(true, () => 1, () => 'zero') // type error, branches are not the same type
iff(true, () => 1) // => 1 Some(1)
iff(false, () => 1) // => 1 None
```

### `iff(predicate: boolean, onConsequent: () => T, onAlternative?: () => T): T`

`iff()` evaluates a _predicate_ and returns the result of calling
_onConsequent()_ if the predicate is `true` or the result of _onAlternative()_
if the predicate is `false`.

_onConsequent_ and _onAlternative_ must be functions with the same return type.

### `iff(predicate: boolean, onConsequent: () => T): Option<T>`

If _onAlternative_ is not provided or is nullable, `iff()` will always return
an `Option<T>` data type: `Some<T>` if the predicate is `true`, or `None` if the
predicate is `false`.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
