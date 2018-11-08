# @pacote/error

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/error)
![minified](https://badgen.net/bundlephobia/min/@pacote/error)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/error)

Custom error classes and utilities.

## Installation

```bash
yarn add @pacote/error
```

## Usage

### `BaseError`

`BaseError` is an error class which provides a convenience static `imprint()` method to get around [issues with extending the built-in JavaScript `Error` class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). It's by no means a bullet-proof solution and full support is not available in older browsers (such as Internet Explorer up to version 10).

```typescript
import { BaseError } from '@pacote/error'

class StatusError extends BaseError {
  constructor(public readonly status: number, message?: string) {
    super(message)
    StatusError.imprint(this)
  }
}

const e = new StatusError(404, 'Not found')

e instanceOf Error       // true
e instanceOf BaseError   // true
e instanceOf StatusError // true
e.message                // 'Not found'
e.status                 // 404
e.stack                  // <defined>
```

### `ComplexError`

`ComplexError` aggregates multiple error objects so they can be thrown as one. Its primary use case is to support validation errors caused by multiple failing conditions.

```typescript
import { ComplexError } from '@pacote/error'

function doSomething() {
  throw new ComplexError('Could not do something', [
    new Error('one'),
    new Error('two')
  ])
}

try {
  doSomething()
} catch (e) {
  e.causes.forEach(console.error) // Outputs Error('one'), Error('two')
}
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
