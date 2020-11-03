# @pacote/throttle

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

const throttledFn = throttle(fn, 100)

throttledFn() // fn() is called immediately
throttledFn() // fn() is scheduled for execution after 100ms
throttledFn() // fn() is scheduled for execution, cancelling the previous one
```

### `throttle<T>(fn: (...args: T[]) => any, delay = 0): (...args: T[]) => void`

`throttle()` creates a throttled version of the passed function.

By calling the throttled function repeatedly, the original function is called
once immediately and then at most once for every period of time determined by
the `delay` argument.

The `delay` argument is optional and defaults to `0` when not supplied.

The throttled function supplies a `.cancel()` method that can be used to cancel
a pending invocation.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
