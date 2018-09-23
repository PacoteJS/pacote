# @pacote/ffetch

[![Build Status](https://travis-ci.org/goblindegook/ffetch.svg?branch=master)](https://travis-ci.org/goblindegook/ffetch)

## Installation

```bash
yarn add @pacote/ffetch
```

## Usage

In its simplest form, `ffetch` works a lot like the [Fetch
API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) it wraps:

```typescript
import { ffetch } from '@pacote/ffetch'

const response = await ffetch('https://goblindegook.com/api/kittens/1').run()

console.log(result.value) // yields either an error or the response body
```

The function conveniently abstracts away concerns like response body parsing and
some error handling.

However, the main difference and biggest selling point is that `ffetch` creates
a [`TaskEither`](https://gcanti.github.io/fp-ts/TaskEither.html) object which
doesn't immediately run and allows chaining extra functionality. For example,
you could more simply implement features like request cancellation and retrying
around such an abstraction.

In the example above, executing `ffetch(...).run()` returns a `Promise` like the
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

// Perform the request:
const response = await ffetch('https://goblindegook.com/api/kittens/1').run()

// Handling success and failure responses separately:
response
  .map(body => {
    /* handle successful response */
    return body
  })
  .leftMap(error => {
    /* handle request failure */
    return error
  })
)

// Get the successful response body falling back to some default value:
const okOrDefault = response.getOrElse('some default value')
```

### Options

The module provides a `createFetch()` factory function that llows you to
override the parsing functions for success and error responses respectively.

#### `parse: (r: Response) => Promise<T>`

This option can be set to a function that takes a
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object
and returns a `Promise` with its parsed payload.

As an example, you might want to use this to include response headers in the
response, or parse binary responses:

```typescript
import { createFetch } from '@pacote/ffetch'

const binaryFetch = createFetch({
  parseLeft: r => r.blob()
})

const response = await binaryFetch(URL).run()
```

#### `parseLeft: (r: Response) => Promise<E>`

This option can be set to a function that takes a
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object
and returns a `Promise` with its parsed payload. This function is used to parse
[non-ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
responses.

For example, you might want to set a custom parser to handle text bodies on
`5xx` class status codes and JSON content for other errors.

```typescript
import { createFetch } from '@pacote/ffetch'

const customErrorHandlingFetch = createFetch({
  parseLeft: r => (r.status >= 500 ? r.text() : r.json())
})

const response = await customErrorHandlingFetch(URL).run()
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
