# @pacote/throttle

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/throttle)
![minified](https://badgen.net/bundlephobia/min/@pacote/throttle)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/throttle)

A tiny throttler.

## Installation

```bash
yarn add @pacote/throttle
```

## Usage

```typescript
import { throttle } from '@pacote/throttle'

// By calling `throttledFn` repeatedly, `fn` is called once immediately and then at most once every 100ms:
const throttledFn = throttle(fn, 100)
```

### `throttle(fn: Function, delay = 0): Function`

`throttle()` creates a throttled version of the passed function.

By calling the throttled function repeatedly, the original functions is called
once immediately and then at most once for every period of time determined by
the `delay` argument.

The `delay` argument is optional and defaults to `0` when not supplied.

The throttled function supplies a `.cancel()` method to cancel delayed
invokations.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
