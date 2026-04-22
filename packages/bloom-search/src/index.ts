import { windowed } from '@pacote/array'
import { BloomFilter, optimal } from '@pacote/bloom-filter'
import { memoize } from '@pacote/memoize'
import type { U64 } from '@pacote/u64'
import { type XXHash, xxh64 } from '@pacote/xxhash'
import { entries, pick } from './object'
import { EXCLUDE, PHRASE, queryTerms, REQUIRE } from './query'
import { countIdf, createIdfLookup } from './tf-idf'

export type PreprocessFunction<Document, Field extends keyof Document> = (
  value: Document[Field],
  field: Field,
  document: Document,
) => string
export type StopwordsFunction = (token: string, language?: string) => boolean
export type StemmerFunction = (token: string, language?: string) => string
export type TokenizerFunction = (token: string, language?: string) => string[]

/**
 * Represents an indexed document in the search index.
 *
 * @template Document     The type of document being indexed.
 * @template SummaryField The document keys that can be returned in search results.
 */
export interface IndexedDocument<
  Document,
  SummaryField extends keyof Document,
> {
  /**
   * Summary fields for the document. These are preserved as-is.
   */
  readonly summary: Pick<Document, SummaryField>
  /**
   * Bloom filter signatures for the document grouped by word frequency. Any
   * words added to a signature are searchable but not retrievable.
   */
  readonly signatures: Record<number, BloomFilter<string>>
}

export interface Index<Document, SummaryField extends keyof Document> {
  version: number
  documents: Record<string, IndexedDocument<Document, SummaryField>>
}

/**
 * Configuration options for creating a search index.
 *
 * @template Document     The type of document being indexed.
 * @template SummaryField The document keys that can be returned in search results.
 * @template IndexField   The document keys to be indexed for searching.
 */
export interface Options<
  Document extends Record<string, unknown>,
  SummaryField extends keyof Document = keyof Document,
  IndexField extends keyof Document = keyof Document,
> {
  /**
   * The fields to index, provided as an array or as a record of field keys and
   * weight values.
   */
  fields: IndexField[] | Record<IndexField, number>
  /**
   * Determines which fields in the document can be stored in the index and
   * returned as a search result.
   */
  summary: SummaryField[]
  /**
   * Determines the desired error rate. A lower number yields more reliable
   * results but makes the index larger. The value defaults to `0.0001` (or
   * 0.01%).
   */
  errorRate?: number
  /**
   * Minimum term cardinality used to calculate the Bloom filter size. This can
   * be used to reduce false positives when dealing with small documents with
   * sparse term frequency distribution. The default value is `0`.
   */
  minSize?: number
  /**
   * Indexes _n_-grams beyond the single text tokens. A value of `2` indexes
   * digrams, a value of `3` indexes digrams and trigrams, and so forth. This
   * allows seaching the index for simple phrases (a phrase search is entered
   * "between quotes"). Indexing _n_-grams will increase the size of the
   * generated indices roughly by a factor of _n_. Default value is `1` (no
   * _n_-grams are indexed).
   */
  ngrams?: number
  /**
   * Hash seed to use in Bloom Filters, defaults to `0x00c0ffee`.
   */
  seed?: number
  /**
   * Optimises storage by grouping indexed terms into buckets according to term
   * frequency in a document. Defaults to `[1, 2, 3, 4, 8, 16, 32, 64]`.
   */
  termFrequencyBuckets?: number[]
  /**
   * Preprocessing function, executed before all others. The function serialises
   * each field as a `string` and optionally process it before indexing. For
   * example, you might use this function to strip HTML from a field value. By
   * default, this class simply converts the field value into a `string`.
   */
  preprocess?: PreprocessFunction<Document, IndexField>
  /**
   * Allows plugging in a custom stemming function. By default, this class does
   * not change text tokens.
   */
  stemmer?: StemmerFunction
  /**
   * Filters tokens so that words that are too short or too common may be
   * excluded from the index. By default, no stopwords are excluded.
   */
  stopwords?: StopwordsFunction
  /**
   * Allows a custom tokenizer function. By default content is transformed to
   * lowercase, split at every whitespace or hyphen, and stripped of any
   * non-word (`A-Z`, `0-9`, and `_`) characters.
   */
  tokenizer?: TokenizerFunction
}

interface SearchTokens {
  required: string[]
  included: string[]
  excluded: string[]
}

interface Result<Document, SummaryField extends keyof Document> {
  readonly summary: Pick<Document, SummaryField>
  readonly score: number
}

const INDEX_VERSION = 1

const compare = (a: number, b: number) => (a === b ? 0 : a > b ? -1 : 1)

const defaultTokenizer = (text: string): string[] =>
  text
    .normalize('NFD')
    .toLowerCase()
    .split(/[\s-]+/)
    .map((token) => token.replace(/\W/gi, ''))

const memoizedHash = (hash: XXHash<U64>) =>
  memoize(String, (data) =>
    Number.parseInt(hash.update(data).digest('hex').substring(8, 16), 16),
  )

/**
 * Indexer and searcher based on Bloom filters.
 *
 * ```typescript
 * import { BloomSearch } from '@pacote/bloom-search'
 *
 * const bs = new BloomSearch({
 *   fields: ['text'],
 *   summary: ['id'],
 * })
 *
 * bs.add('id1', { id: 1, text: 'foo bar' })
 * bs.add('id2', { id: 2, text: 'foo baz' })
 *
 * bs.search('foo +bar') // => [{ id: 1 }])
 * bs.search('foo -bar') // => [{ id: 2 }])
 * ```
 */
export class BloomSearch<
  Document extends Record<string, unknown>,
  SummaryField extends keyof Document = keyof Document,
  IndexField extends keyof Document = keyof Document,
> {
  /**
   * A record containing the name of all indexable fields and their relative
   * weight used to rank search results.
   */
  public readonly fields: Record<IndexField, number>

  /**
   * An array with the names of fields to preserve as summary, and which are
   * returned as search results for the matching documents. It is recommended to
   * keep only fields necessary to identify a document (e.g. title, URL, short
   * description) to keep space requirements down.
   */
  public readonly summary: SummaryField[]

  /**
   * Error rate used in all Bloom filters to generate document signatures.
   */
  public readonly errorRate: number

  /**
   * Minimum term cardinality used to calculate the Bloom filter size. This can
   * be used to reduce false positives when dealing with small documents with
   * sparse term frequency distribution.
   */
  public readonly minSize: number

  /**
   * The _n_-grams to store in the index. Defaults to `1` (no _n_-grams).
   */
  public readonly ngrams: number

  /**
   * Hash seed to use in Bloom Filters, defaults to `0x00c0ffee`.
   */
  public readonly seed: number

  /**
   * Optimises storage by grouping indexed terms into buckets according to term
   * frequency in a document.
   */
  public readonly termFrequencyBuckets: number[]
  private readonly preprocess: PreprocessFunction<Document, IndexField>
  private readonly stemmer: StemmerFunction
  private readonly stopwords: StopwordsFunction
  private readonly tokenizer: TokenizerFunction
  private readonly hash: (i: number, token: string) => number
  private readonly documents = new Map<
    string,
    IndexedDocument<Document, SummaryField>
  >()

  /**
   * Creates a new Bloom search instance based on Bloom filters, which can be
   * used to add documents and test the membership of search terms in the added
   * set.
   *
   * @param options Bloom search options.
   */
  constructor(options: Options<Document, SummaryField, IndexField>) {
    this.fields = Array.isArray(options.fields)
      ? options.fields.reduce(
          (weight, field) => {
            weight[field] = 1
            return weight
          },
          {} as Record<IndexField, number>,
        )
      : options.fields
    this.summary = options.summary
    this.errorRate = options.errorRate ?? 0.0001
    this.ngrams = options.ngrams ?? 1
    this.minSize = options.minSize ?? 0
    this.termFrequencyBuckets = options.termFrequencyBuckets ?? [
      1, 2, 3, 4, 8, 16, 32, 64,
    ]
    this.preprocess = options.preprocess ?? String
    this.stemmer = options.stemmer ?? ((token) => token)
    this.stopwords = options.stopwords ?? (() => true)
    this.tokenizer = options.tokenizer ?? defaultTokenizer
    this.seed = options.seed ?? 0x00c0ffee

    const h1 = memoizedHash(xxh64(this.seed + 1))
    const h2 = memoizedHash(xxh64(this.seed + 2))

    this.hash = (i, data) => h1(data) + i * h2(data) + i ** 3
  }

  /**
   * Collection containing document summaries and Bloom filter signatures used
   * to search, with document shorthand reference identifier used as keys.
   */
  public get index(): Index<Document, SummaryField> {
    return {
      version: INDEX_VERSION,
      documents: this.snapshotDocuments(),
    }
  }

  public set index(index: Index<Document, SummaryField>) {
    this.load(index)
  }

  /**
   * Replaces the instance's index with an index from another instance. Its
   * primary use case is to rehydrate the index from a static file or payload.
   *
   * **NB:** Calling this method will not change any other attributes in the
   * instance. It is up to developers to ensure that the instances were
   * initialised with compatible options, in particular the `stemmer`
   * function. Incompatible `stemmer` implementations may cause matches to
   * not be found in the rehydrated index.
   *
   * @param index Replacement index.
   */
  load(index: Index<Document, SummaryField>): void {
    if (index.version !== INDEX_VERSION) {
      throw new Error(
        `incompatible index schema version ${index.version}, expected ${INDEX_VERSION}`,
      )
    }

    this.documents.clear()

    for (const [ref, entry] of entries(index.documents)) {
      const document = {
        summary: entry.summary,
        signatures: entries(entry.signatures).reduce<
          Record<number, BloomFilter<string>>
        >((signatures, [frequency, signature]) => {
          signatures[frequency] = new BloomFilter({
            ...signature,
            hash: this.hash,
          })
          return signatures
        }, {}),
      }

      this.documents.set(ref, document)
    }
  }

  /**
   * Indexes a single document with its unique reference identifier.
   *
   * @param ref         - A unique reference identifier for the document. Adding
   *                      another document with the same reference replaces the
   *                      document on the search index.
   * @param document    - The document to index.
   * @param [language]  - Language identifier which is fed back into the
   *                      `stemmer` and `stopwords` callback functions to help
   *                      decide how to handle these steps.
   */
  add(ref: string, document: Document, language?: string): void {
    const uniqueTokens = new Set<string>()
    const frequency: Record<string, number> = {}

    for (const [field, weight = 1] of entries(this.fields)) {
      if (document[field] == null) continue

      const fieldText = this.preprocess(document[field], field, document)
      const fieldTokens = this.tokenizer(fieldText, language)
      const indexedTokens: string[] = []

      for (const token of fieldTokens)
        if (token.length && this.stopwords(token, language))
          indexedTokens.push(this.stemmer(token, language))

      for (let size = 2; size <= this.ngrams; size += 1)
        for (const ngram of windowed(size, fieldTokens))
          indexedTokens.push(ngram.join(' '))

      for (const token of indexedTokens) {
        uniqueTokens.add(token)
        frequency[token] = (frequency[token] ?? 0) + weight
      }
    }

    if (uniqueTokens.size === 0) return

    const tokensByFrequency = new Array<string[]>(
      this.termFrequencyBuckets.length + 1,
    )

    for (const token of uniqueTokens) {
      let frequencyBucketIndex = 0
      for (let i = this.termFrequencyBuckets.length - 1; i >= 0; i -= 1) {
        if (frequency[token] >= this.termFrequencyBuckets[i]) {
          frequencyBucketIndex = i + 1
          break
        }
      }

      if (!tokensByFrequency[frequencyBucketIndex]) {
        tokensByFrequency[frequencyBucketIndex] = []
      }
      tokensByFrequency[frequencyBucketIndex].push(token)
    }

    const signatures = tokensByFrequency.reduce<
      Record<number, BloomFilter<string>>
    >((acc, tokens, frequencyBucketIndex) => {
      if (!tokens?.length) return acc

      const frequencyBucket =
        frequencyBucketIndex === 0
          ? 0
          : this.termFrequencyBuckets[frequencyBucketIndex - 1]

      acc[frequencyBucket] = new BloomFilter({
        ...optimal(Math.max(this.minSize, tokens.length), this.errorRate),
        seed: this.seed,
        hash: this.hash,
      })

      for (const token of tokens) acc[frequencyBucket].add(token)

      return acc
    }, {})

    this.documents.set(ref, {
      summary: pick(this.summary, document),
      signatures,
    })
  }

  /**
   * Removes an indexed document.
   *
   * @param ref - Reference identifier of the document to remove.
   */
  remove(ref: string): void {
    this.documents.delete(ref)
  }

  /**
   * Scans the document index and returns a list of documents summaries (with
   * only the properties declared in the `summary` option) that possibly match
   * one or more terms in the query.
   *
   * Each search term is run through the provided `stemmer` function to ensure
   * terms are processed in the same way as the tokens previously added to the
   * index's signature.
   *
   * @param query       - Terms to search.
   *
   * Individual words are matched against the signature of each indexed document.
   * You may prefix each word with the `+` operator to intersect results that
   * (probably) contain the required word, or use the `-` operator to exclude
   * results containing the word.
   *
   * If the `ngrams` option is greater than `1`, you are also able to search for
   * exact phrases up to `ngrams` words typed between quotes (for example,
   * `"this phrase"`). Only documents containing these words in that sequence
   * are returned in the search results.
   *
   * @param [language]  - Language identifier for the search terms. This is
   *                      used only to help choose the appropriate stemming
   *                      algorithm, search results will not filtered by
   *                      language.
   *
   * @returns Ordered list of document summaries, sorted by probable search
   *          term frequency.
   */
  search(query: string, language?: string): Pick<Document, SummaryField>[] {
    const tokens = this.parseQuery(query, language)
    const totalDocuments = this.documents.size

    const candidates = Array.from(this.documents.values()).reduce<
      {
        summary: Pick<Document, SummaryField>
        matches: Record<string, number>
      }[]
    >((all, document) => {
      const tokenMatches = new Map<string, number>()
      const getTokenMatch = (token: string): number => {
        if (tokenMatches.has(token)) {
          return tokenMatches.get(token) ?? 0
        }
        const match = this.hasToken(document, token)
        tokenMatches.set(token, match)
        return match
      }

      for (const token of tokens.excluded) {
        if (getTokenMatch(token)) {
          return all
        }
      }

      for (const token of tokens.required) {
        if (!getTokenMatch(token)) {
          return all
        }
      }

      let matchCount = 0
      const matches: Record<string, number> = {}
      for (const token of tokens.included) {
        const match = getTokenMatch(token)
        if (match > 0) {
          matches[token] = match
          matchCount += 1
        }
      }

      if (matchCount > 0) all.push({ summary: document.summary, matches })

      return all
    }, [])

    const documentTermFrequencies = candidates.map(({ matches }) => matches)
    const idfByTerm = createIdfLookup(documentTermFrequencies, totalDocuments)

    return candidates
      .reduce<Result<Document, SummaryField>[]>((all, result) => {
        all.push({
          ...result,
          score: countIdf(result.matches, idfByTerm),
        })
        return all
      }, [])
      .sort((a, b) => compare(a.score, b.score))
      .map(({ summary }) => summary)
  }

  toJSON() {
    return {
      errorRate: this.errorRate,
      fields: this.fields,
      index: this.index,
      minSize: this.minSize,
      ngrams: this.ngrams,
      seed: this.seed,
      summary: this.summary,
      termFrequencyBuckets: this.termFrequencyBuckets,
    }
  }

  private hasToken(
    document: IndexedDocument<Document, SummaryField>,
    token: string,
  ): number {
    for (const frequency in document.signatures) {
      if (document.signatures[frequency].has(token)) {
        return Number(frequency)
      }
    }
    return 0
  }

  private parseQuery(query: string, language?: string): SearchTokens {
    const required = new Set<string>()
    const included = new Set<string>()
    const excluded = new Set<string>()

    for (const [term, type] of queryTerms(query)) {
      const tokenizedTerm = this.tokenizer(term, language)
      const termTokens =
        type === PHRASE
          ? [tokenizedTerm.filter((token) => token.length).join(' ')].filter(
              (token) => token.length,
            )
          : tokenizedTerm
              .filter(
                (token) => token.length && this.stopwords(token, language),
              )
              .map((token) => this.stemmer(token, language))

      for (const token of termTokens) {
        if (type !== EXCLUDE) included.add(token)
        else excluded.add(token)
        if (type === REQUIRE || type === PHRASE) required.add(token)
      }
    }

    return {
      required: Array.from(required),
      included: Array.from(included),
      excluded: Array.from(excluded),
    }
  }

  private snapshotDocuments(): Record<
    string,
    IndexedDocument<Document, SummaryField>
  > {
    return Object.assign(
      Object.create(null),
      Object.fromEntries<IndexedDocument<Document, SummaryField>>(
        this.documents,
      ),
    )
  }
}
