# @pacote/request

![version](https://badgen.net/npm/v/@pacote/request)
![minified](https://badgen.net/bundlephobia/min/@pacote/request)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/request)

Composable HTTP requests.

## Installation

```bash
yarn add @pacote/request
```

## Usage

Now:

```typescript
import { POST, header, body, send, waitFor } from '@pacote/request'
import { pipe } from '@pacote/pipe'

const result = await pipe(
  POST('https://goblindegook.com/api/kittens'),
  header('Content-Type', 'application/json'),
  body(JSON.stringify({ name: 'Eddie', year: 2016 })),
  send(),
  waitFor(header('Location'))
)
```

With the [pipeline operator](https://tc39.es/proposal-pipeline-operator/):

```typescript
import { POST, header, body, send } from '@pacote/request'

const result = POST('https://goblindegook.com/api/kittens')
  |> header('Content-Type', 'application/json')
  |> body(JSON.stringify({ name: 'Eddie', year: 2016 }))
  |> send()
  |> await header('Location')
```

### `request(): void`

`request()` ...

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
