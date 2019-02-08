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

// These return true:
isPlainObject({})
isPlainObject({ an: 'object' })

// All of these return false:
isPlainObject(undefined)
isPlainObject(null)
isPlainObject(false)
isPlainObject(true)
isPlainObject(NaN)
isPlainObject(Infinity)
isPlainObject(0)
isPlainObject('string')
isPlainObject([])
isPlainObject(new ArrayBuffer(0))
isPlainObject(new Date())
isPlainObject(new Map())
isPlainObject(new Promise())
isPlainObject(new Set())
isPlainObject(new WeakMap())
isPlainObject(new WeakSet())
```

### `isPlainObject(o: any): boolean`

`isPlainObject()` takes a single value and checks whether it is a plain object. May be used as a type guard.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
