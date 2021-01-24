# @pacote/bloom-search

![version](https://badgen.net/npm/v/@pacote/bloom-search)
![minified](https://badgen.net/bundlephobia/min/@pacote/bloom-search)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/bloom-search)

Document search using Bloom filters.

## Installation

```bash
yarn add @pacote/bloom-search
```

## Usage

```typescript
import { BloomSearch } from '@pacote/bloom-search'

const bs = new BloomSearch({
  errorRate: 0.001,
  fields: ['text'],
  summary: ['id'],
})

bs.add({ id: 1, text: 'foo' })
bs.add({ id: 2, text: 'bar' })

bs.search('foo') // => [{ id: 1 }])
```

### `BloomSearch`

TODO

#### Options

TODO

#### `BloomSearch.add(document: Document, language?: string): void`

TODO

#### `BloomSearch.search(terms: string, language?: string): Result[]`

TODO

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
