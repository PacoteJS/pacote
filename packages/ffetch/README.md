# @pacote/ffetch

[![Build Status](https://travis-ci.org/goblindegook/ffetch.svg?branch=master)](https://travis-ci.org/goblindegook/ffetch)

## Installation

```bash
yarn add @pacote/ffetch
```

## Usage

In its simplest form, `ffetch` works a lot like the
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) it
wraps:

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

In the example above, executing `ffetch(...).run()` returns a `Promise`
like the Fetch API does. But instead of resolving to a successful response (or
rejecting on error), this `Promise` resolves to an
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

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
