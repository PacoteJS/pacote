# @pacote/signature-search

![version](https://badgen.net/npm/v/@pacote/signature-search)
![minified](https://badgen.net/bundlephobia/min/@pacote/signature-search)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/signature-search)

Document search using [Ribbon filters](../ribbon-filter/).

This module was created to support basic full-text search on static sites
where a backend-supported search feature isn't possible, and loading a
complete index on the client is too expensive.

Ribbon filters are used because they trade result accuracy for space
efficiency. With them, false positive matches are possible, but false
negatives are not. That is to say, its responses are either a _certain miss_
or a _possible match_.

They allow building a simple document search index that is smaller than
inverted indices at the cost of occasionally returning matches for words that
are not present in any document. This error rate can be adjusted to improve
search quality.

Due to the limitations inherent in Ribbon filters, only full, individual words
can be matched against indexed documents while searching. The absence of
partial matching can be remedied through the use of a custom stemmer
function, but more "advanced" features like suffix matching cannot be
performed at all.

See [how several client-side search engines compare against Signature
Search](https://signature-search.goblindegook.com/).

## Installation

```bash
yarn add @pacote/signature-search
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
