# @pacote/bloom-search

![version](https://badgen.net/npm/v/@pacote/bloom-search)
![minified](https://badgen.net/bundlephobia/min/@pacote/bloom-search)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/bloom-search)

Document search using [Bloom filters](../bloom-filter/).

This module was created to support basic full-text search on static sites
where a backend-supported search feature isn't possible, and loading a
complete index on the client is too expensive.

Bloom filters are used because they trade result accuracy for space
efficiency. With them, false positive matches are possible, but false
negatives are not. That is to say, its responses are either a _certain miss_
or a _possible match_.

They allow building a simple document search index that is smaller than
inverted indices at the cost of occasionally returning matches for words that
are not present in any document. This error rate can be adjusted to improve
search quality.

Due to the limitations inherent in Bloom filters, only full, individual words
can be matched against indexed documents while searching. The absence of
partial matching can be remedied through the use of a custom stemmer
function, but more "advanced" features like suffix matching cannot be
performed at all.

## Installation

```bash
yarn add @pacote/bloom-search
```

## Example

```typescript
import { BloomSearch } from '@pacote/bloom-search'

const bs = new BloomSearch({
  fields: ['text'],
  summary: ['id'],
})

bs.add('id1', { id: 1, text: 'foo bar' })
bs.add('id2', { id: 2, text: 'foo baz' })

bs.search('foo +bar') // => [{ id: 1 }])
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
