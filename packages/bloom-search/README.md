# @pacote/bloom-search

![version](https://badgen.net/npm/v/@pacote/bloom-search)
![minified](https://badgen.net/bundlephobia/min/@pacote/bloom-search)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/bloom-search)

Document search using [Bloom filters](../bloom-filter/).

This module was created to support basic full-text search on static sites where
a backend-supported search feature isn't possible, and loading a complete index
on the client is too expensive.

Bloom filters are used because they trade result accuracy for space efficiency.
With them, false positive matches are possible, but false negatives are not.
That is to say, its responses are either a _certain miss_ or a _possible match_.

They allow building a simple document search index that is smaller than inverted
indices at the cost of occasionally returning matches for words that are not
present in any document. This error rate can be adjusted to improve search
quality.

Due to the limitations inherent in Bloom filters, only full, individual words
can be matched against indexed documents while searching. The absence of partial
matching can be remedied through the use of a custom stemmer function, but more
"advanced" features like phrase or suffix matching cannot be performed at all.

## Installation

```bash
yarn add @pacote/bloom-search
```

## Usage

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

### `BloomSearch<Document, SummaryField, IndexField>`

`BloomSearch` builds a search index based on `CountingBloomFilter` which
can be used to test the membership of search terms in a set of documents.

The class constructor takes an `Options` object with the following properties:

- `fields` (`IndexField[]`, required) determines which fields in the document
  should be indexed.

- `summary` (`SummaryField[]`, required) determines which fields in the document
  can be stored in the index and returned as a search result.

- `errorRate` (`number`) determines the desired error rate. A lower number
  yields more reliable results but makes the index larger. The value defaults to
  `0.0001` (or 0.01%).

- `ngrams` (`number`) indexes _n_-grams beyond the single text tokens. A value
  of `2` indexes digrams, a value of `3` indexes digrams and trigrams, and so
  forth. This allows seaching the index for simple phrases (a phrase search is
  entered "between quotes"). Indexing _n_-grams will increase the size of the
  generated indices roughly by a factor of _n_. Default value is `1` (no
  _n_-grams are indexed).

- `preprocess` (`(text: unknown, field: IndexField) => string`) is a function to
  serialise each field as a `string` and optionally process it before indexing.
  For example, you can use this function to strip HTML from a field value. By
  default, this class simply converts the field value into a `string`.

- `stopwords` (`(token: string, language: string) => boolean`) filters tokens
  so that words that are too short or too common may be excluded from the index.
  By default, no stopwords are excluded.

- `stemmer` (`(token: string, language: string) => string`) allows developers to
  plug in a custom stemming function. By default, this class does not change
  text tokens.

#### `BloomSearch.add(reference: string, document: Document, language?: string): void`

The `add()` method indexes a single document with the provided unique
`reference` identifier. Adding another document with the same `reference`
replaces the index.

You may optionally pass it a `language` identifier which is fed back into the
`stemmer` and `stopwords` filter to best decide how to handle these steps.

#### `BloomSearch.remove(reference: string): void`

The `remove()` method removes the indexed document associated with the supplied
`reference`.

#### `BloomSearch.search(query: string, language?: string): Partial<Document>[]`

The `search()` method scans the document index and returns a list of documents
summaries (with only the properties declared in the `summary` option) that
possibly match one or more terms in the query.

The function matches individual words against the filter of each indexed
document. You may prefix each word with the `+` operator to intersect results
that (probably) contain the required word.

If the `ngrams` option is greater than `1`, you are also able to search for
exact phrases up to `ngrams` words typed between quotes (for example,
`"this phrase"`). Only documents containing these words in that sequence are
returned in the search results.

Each search term is run through the provided `stemmer` function to ensure terms
are processed in the same way as the tokens previously added to the index's
Bloom filters. To help choose the appropriate stemming algorithm, you may pass
the `search()` method an optional `language` identifier.

#### `BloomSearch.load(index: DocumentIndex<Document, SummaryField>[]): void`

The `load()` method lets you replace the instance's index with an index from
another instance. Its primary use case is to rehydrate the index from a static
file or payload.

**NB:** Calling this method will not change any other attributes in the
instance. It is up to developers to ensure that the instances were initialised
with compatible options, in particular the `stemmer` function. Incompatible
`stemmer` implementations may cause matches to not be found in the rehydrated
index.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
