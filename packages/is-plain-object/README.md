# @pacote/is-plain-object

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/is-plain-object)
![minified](https://badgen.net/bundlephobia/min/@pacote/is-plain-object)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/is-plain-object)

Checks whether the provided value is a plain JavaScript object.

## Installation

```bash
yarn add @pacote/is-plain-object
```

## Usage

```typescript
import { isPlainObject } from '@pacote/is-plain-object'

isPlainObject({}) // true
isPlainObject({ an: 'object' }) // true

isPlainObject(undefined) // false
isPlainObject(null) // false
isPlainObject(false) // false
isPlainObject(true) // false
isPlainObject(NaN) // false
isPlainObject(Infinity) // false
isPlainObject(0) // false
isPlainObject('string') // false
isPlainObject([]) // false
isPlainObject(new ArrayBuffer(0)) // false
isPlainObject(new Date()) // false
isPlainObject(new Map()) // false
isPlainObject(new Promise()) // false
isPlainObject(new Set()) // false
isPlainObject(new WeakMap()) // false
isPlainObject(new WeakSet()) // false
```

### `isPlainObject(o: any): boolean`

`isPlainObject()` takes a single value and checks whether it is a plain object. May be used as a type guard.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
