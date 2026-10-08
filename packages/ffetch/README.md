# @pacote/ffetch

![version](https://badgen.net/npm/v/@pacote/ffetch)
![minified](https://badgen.net/bundlephobia/min/@pacote/ffetch)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/ffetch)

Fetch API wrapped in a [`TaskEither`](https://gcanti.github.io/fp-ts/TaskEither.html).

## Installation

```bash
yarn add @pacote/ffetch
```

## Handling results

The returned `Either` can be handled with `fp-ts` mapping functions, keeping
success and failure paths explicit:

```typescript
import { ffetch } from '@pacote/ffetch'
import { pipe } from 'fp-ts/function'
import { map, mapLeft, getOrElse } from 'fp-ts/lib/Either'

const response = await ffetch('https://goblindegook.com/api/kittens/1')()

pipe(
  response,
  map((body) => {
    /* handle successful response */
    return body
  }),
  mapLeft((error) => {
    /* handle request failure */
    return error
  }),
)

const okOrDefault = pipe(
  response,
  getOrElse(() => 'some default value'),
)
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
