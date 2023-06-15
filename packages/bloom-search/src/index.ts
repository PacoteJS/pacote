import { BloomFilter, optimal } from '@pacote/bloom-filter'
import { range, unique, windowed } from '@pacote/array'
import { queryTerms } from './query'
import { entries, keys, pick } from './object'
import { countIdf } from './tf-idf'
import { xxh64 } from '@pacote/xxhash'
import { memoize } from '@pacote/memoize'

type PreprocessFunction<Document, Field extends keyof Document> = (
  value: Document[Field],
  field: Field,
  document: Document
) => string
type StopwordsFunction = (token: string, language?: string) => boolean
type StemmerFunction = (token: string, language?: string) => string
type TokenizerFunction = (token: string, language?: string) => string[]

export type IndexedDocument<Document, SummaryField extends keyof Document> = {
  /**
   * Summary fields for the document. These are preserved as-is.
   */
  readonly summary: Pick<Document, SummaryField>
  /**
   * Bloom filter signature for the document. All words added to the signature
   * are searchable but not retrievable.
   */
  readonly signatures: Record<number, BloomFilter<string>>
}

export type Index<Document, SummaryField extends keyof Document> = {
  version: number
  documents: Record<string, IndexedDocument<Document, SummaryField>>
}

type SearchTokens = {
  required: string[]
  included: string[]
  excluded: string[]
}

type Result<Document, SummaryField extends keyof Document> = {
  readonly summary: Pick<Document, SummaryField>
  readonly score: number
}

const compare = (a: number, b: number) => (a === b ? 0 : a > b ? -1 : 1)

const defaultTokenizer = (text: string): string[] =>
  text
    .normalize('NFD')
    .toLowerCase()
    .split(/[\s-]+/)
    .map((token) => token.replace(/\W/gi, ''))

/**
 * Encapsulates search functionality based on Bloom filters.
 */
export class BloomSearch<
  Document extends Record<string, unknown>,
  SummaryField extends keyof Document = keyof Document,
  IndexField extends keyof Document = keyof Document
> {
  /**
   * Collection containing document summaries and Bloom filter signatures used
   * to search, with document shorthand reference identifier used as keys.
   */
  public index: Index<Document, SummaryField> = { version: 1, documents: {} }

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
   * The _n_-grams to store in the index. Defaults to `1` (no _n_-grams).
   */
  public readonly ngrams: number
  public readonly seed: number
  private readonly preprocess: PreprocessFunction<Document, IndexField>
  private readonly stemmer: StemmerFunction
  private readonly stopwords: StopwordsFunction
  private readonly tokenizer: TokenizerFunction
  private readonly hash: (i: number, token: string) => number

  /**
   * Creates a new Bloom search instance based on Bloom filters, which can be
   * used to add documents and test the membership of search terms in the added
   * set.
   *
   * @param options             - Bloom search options.
   * @param options.fields      - The fields to index, provided as an array or
   *                              as a record of field keys and weight values.
   * @param options.summary     - Determines which fields in the document can be
   *                              stored in the index and returned as a search
   *                              result.
   * @param options.errorRate   - Determines the desired error rate. A lower
   *                              number yields more reliable results but makes
   *                              the index larger. The value defaults to
   *                              `0.0001` (or 0.01%).
   * @param options.ngrams      - Indexes _n_-grams beyond the single text
   *                              tokens. A value of `2` indexes digrams, a
   *                              value of `3` indexes digrams and trigrams, and
   *                              so forth. This allows seaching the index for
   *                              simple phrases (a phrase search is entered
   *                              "between quotes"). Indexing _n_-grams will
   *                              increase the size of the generated indices
   *                              roughly by a factor of _n_. Default value is
   *                              `1` (no _n_-grams are indexed).
   * @param options.preprocess  - Preprocessing function, executed before all
   *                              others. The function serialises each field as
   *                              a `string` and optionally process it before
   *                              indexing. For example, you might use this
   *                              function to strip HTML from a field value. By
   *                              default, this class simply converts the field
   *                              value into a `string`.
   * @param options.seed        - Hash seed to use in Bloom Filters, defaults to
   *                              `0x00c0ffee`.
   * @param options.stopwords   - Filters tokens so that words that are too
   *                              short or too common may be excluded from the
   *                              index. By default, no stopwords are excluded.
   * @param options.stemmer     - Allows plugging in a custom stemming function.
   *                              By default, this class does not change text
   *                              tokens.
   * @param options.tokenizer   - Allows a custom tokenizer function. By default
   *                              content is transformed to lowercase, split
   *                              at every whitespace of hyphen, and non-word
   *                              (A-Z, 0-9, and _) characters replaced.
   */
  constructor(options: {
    fields: IndexField[] | Record<IndexField, number>
    summary: SummaryField[]
    errorRate?: number
    ngrams?: number
    seed?: number
    preprocess?: PreprocessFunction<Document, IndexField>
    stemmer?: StemmerFunction
    stopwords?: StopwordsFunction
    tokenizer?: TokenizerFunction
  }) {
    this.fields = Array.isArray(options.fields)
      ? options.fields.reduce((weight, field) => {
          weight[field] = 1
          return weight
        }, {} as Record<IndexField, number>)
      : options.fields
    this.summary = options.summary
    this.errorRate = options.errorRate ?? 0.0001
    this.ngrams = options.ngrams ?? 1
    this.preprocess = options.preprocess ?? String
    this.stemmer = options.stemmer ?? ((token) => token)
    this.stopwords = options.stopwords ?? (() => true)
    this.tokenizer = options.tokenizer ?? defaultTokenizer
    this.seed = options.seed ?? 0x00c0ffee

    const h1 = xxh64(this.seed + 1)
    const h2 = xxh64(this.seed + 2)
    const toUint32 = (hex: string) => parseInt(hex.substring(8, 16), 16)

    this.hash = memoize(
      (i: number, data: string) => String(i) + ':' + data,
      (i: number, data: string): number => {
        const d1 = toUint32(h1.update(data).digest('hex'))
        const d2 = toUint32(h2.update(data).digest('hex'))
        return d1 + i * d2 + i ** 3
      }
    )
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
    if (index.version !== this.index.version) {
      throw new Error(
        `incompatible index schema version ${index.version}, expected ${this.index.version}`
      )
    }

    this.index.documents = entries(index.documents).reduce(
      (acc, [ref, entry]) => {
        acc[ref] = {
          summary: entry.summary,
          signatures: entries(entry.signatures).reduce(
            (signatures, [frequency, signature]) => {
              signatures[frequency] = new BloomFilter({
                ...signature,
                hash: this.hash,
              })
              return signatures
            },
            {} as Record<number, BloomFilter<string>>
          ),
        }
        return acc
      },
      {} as Record<string, IndexedDocument<Document, SummaryField>>
    )
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
    const tokensByField = keys(this.fields).reduce((tokens, field) => {
      if (document[field] !== undefined) {
        const fieldText = this.preprocess(document[field], field, document)
        const fieldTokens = this.tokenizer(fieldText, language)

        const unigrams = fieldTokens
          .filter((token) => token.length && this.stopwords(token, language))
          .map((token) => this.stemmer(token, language))

        const ngrams = range(2, this.ngrams + 1)
          .map((i) => windowed(i, fieldTokens).map((ngram) => ngram.join(' ')))
          .flat()

        tokens[field] = unigrams.concat(ngrams)
      }
      return tokens
    }, {} as Record<IndexField, string[]>)

    const uniqTokens = unique(Object.values<string[]>(tokensByField).flat())

    if (uniqTokens.length === 0) {
      return
    }

    const tokenFrequencies: Record<string, number> = {}

    entries(this.fields).forEach(([field, weight = 1]) =>
      (tokensByField[field] || []).forEach((token) => {
        tokenFrequencies[token] = (tokenFrequencies[token] ?? 0) + weight
      })
    )

    const tokensByFrequency = Array.from(uniqTokens).reduce((acc, token) => {
      const frequency = tokenFrequencies[token]
      acc[frequency] = (acc[frequency] ?? []).concat(token)
      return acc
    }, {} as Record<number, string[]>)

    const signatures = entries(tokensByFrequency).reduce(
      (acc, [frequency, tokens]) => {
        acc[frequency] = new BloomFilter({
          ...optimal(tokens.length, this.errorRate),
          seed: this.seed,
          hash: this.hash,
        })
        tokens.forEach((token) => {
          acc[frequency].add(token)
        })
        return acc
      },
      {} as Record<number, BloomFilter<string>>
    )

    this.index.documents[ref] = {
      summary: pick(this.summary, document),
      signatures,
    }
  }

  /**
   * Removes an indexed document.
   *
   * @param ref - Reference identifier of the document to remove.
   */
  remove(ref: string): void {
    delete this.index.documents[ref]
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
    const totalDocuments = keys(this.index).length

    return Object.values<IndexedDocument<Document, SummaryField>>(
      this.index.documents
    )
      .filter(
        (document) =>
          tokens.excluded.every((token) => !this.hasToken(document, token)) &&
          tokens.required.every((token) => this.hasToken(document, token))
      )
      .map((document) => {
        const matches: Record<string, number> = {}
        tokens.included.forEach((token) => {
          matches[token] = this.frequency(document, token)
        })
        return { summary: document.summary, matches }
      })
      .filter(({ matches }) =>
        Object.values(matches).reduce(
          (hasMatches, match) => hasMatches || match > 0,
          false
        )
      )
      .reduce<Result<Document, SummaryField>[]>(
        (all, result, _, results) =>
          all.concat({
            ...result,
            score: countIdf(
              result.matches,
              results.map(({ matches }) => matches),
              totalDocuments
            ),
          }),
        []
      )
      .sort((a, b) => compare(a.score, b.score))
      .map(({ summary }) => summary)
  }

  private hasToken(
    document: IndexedDocument<Document, SummaryField>,
    token: string
  ): boolean {
    return Object.values(document.signatures).some((signature) =>
      signature.has(token)
    )
  }

  private frequency(
    document: IndexedDocument<Document, SummaryField>,
    token: string
  ): number {
    return (
      entries(document.signatures).find(([, signature]) =>
        signature.has(token)
      )?.[0] ?? 0
    )
  }

  private parseQuery(query: string, language?: string): SearchTokens {
    return queryTerms(query).reduce<SearchTokens>(
      ({ required, included, excluded }, [term, type]) => {
        const token = type === 'phrase' ? term : this.stemmer(term, language)
        return {
          required: ['require', 'phrase'].includes(type)
            ? required.concat(token)
            : required,
          included: type !== 'exclude' ? included.concat(token) : included,
          excluded: type === 'exclude' ? excluded.concat(token) : excluded,
        }
      },
      { required: [], included: [], excluded: [] }
    )
  }
}
