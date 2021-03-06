# @pacote/ffetch

![version](https://badgen.net/npm/v/@pacote/ffetch)
![minified](https://badgen.net/bundlephobia/min/@pacote/ffetch)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/ffetch)

Fetch API wrapped in a [`TaskEither`](https://gcanti.github.io/fp-ts/TaskEither.html).

## Installation

```bash
yarn add @pacote/ffetch
```

## Usage

In its simplest form, `ffetch` works a lot like the [Fetch
API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) it wraps:

```typescript
import { ffetch } from '@pacote/ffetch'

const response = await ffetch('https://goblindegook.com/api/kittens/1')()

console.log(result.value) // yields either an error or the response body
```

The function conveniently abstracts away concerns like response body parsing and
some error handling.

However, the main difference and biggest selling point is that `ffetch` creates
a [`TaskEither`](https://gcanti.github.io/fp-ts/TaskEither.html) object which
doesn't immediately run and allows chaining extra functionality. For example,
you could more simply implement features like request cancellation and retrying
around such an abstraction.

In the example above, executing `ffetch(...)()` returns a `Promise` like the
Fetch API does. But instead of resolving to a successful response (or rejecting
on error), this `Promise` resolves to an
[`Either`](https://gcanti.github.io/fp-ts/Either.html) representation that holds
the successfully obtained and parsed response (on the right) or any of the
possible errors that can arise (on the left).

Whatever the result, it can be directly accessed via the `value` property, but
`Either` also allows handling responses safely through mapping functions, all
without resorting to (sometimes nested) `try ... catch` constructs. For example:

```typescript
import { ffetch } from '@pacote/ffetch'
import { pipe } from 'fp-ts/function'
import { map, mapLeft, getOrElse } from 'fp-ts/lib/Either'

// Perform the request:
const response = await ffetch('https://goblindegook.com/api/kittens/1')()

// Handling success and failure responses separately:
pipe(
  response,
  map((body) => {
    /* handle successful response */
    return body
  }),
  mapLeft((error) => {
    /* handle request failure */
    return error
  })
)

// Get the successful response body falling back to some default value:
const okOrDefault = pipe(
  response,
  getOrElse(() => 'some default value')
)
```

### Options

The module provides a `createFetch()` factory function that allows you to
override the parsing functions for success and error responses respectively, as
well as provide a Fetch API polyfill or replacement.

#### `fetch: (input: Request | string, init?: RequestInit) => Promise<Response>`

Provide a Fetch API polyfill or Fetch API-compatible implementation, as in Node
environments where a Fetch API function is not globally available. For example:

```typescript
import { createFetch } from '@pacote/ffetch'
import * as unfetch from 'unfetch'

const unffetch = createFetch({ fetch: unfetch })

await unffetch('https://goblindegook.com/api/kittens/1')()
```

#### `parse: (r: Response) => Promise<T>`

This option can be set to a function that takes a
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object
and returns a `Promise` with its parsed payload.

As an example, you might want to use this to include response headers in the
result, or parse binary responses:

```typescript
import { createFetch } from '@pacote/ffetch'

const binaryFetch = createFetch({
  parse: (r) => r.blob(),
})

await binaryFetch('https://goblindegook.com/api/kittens/1')()
```

#### `parseLeft: (r: Response) => Promise<E>`

This option can be set to a function that takes a
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object
and returns a `Promise` with its parsed payload. This function is used to parse
[non-ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
responses.

For example, you mat set a custom parser to handle text bodies on `5xx` class
status codes but JSON content for other errors:

```typescript
import { createFetch } from '@pacote/ffetch'

const customErrorHandlingFetch = createFetch({
  parseLeft: (r) => (r.status >= 500 ? r.text() : r.json()),
})

await customErrorHandlingFetch('https://goblindegook.com/api/kittens/1')()
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
