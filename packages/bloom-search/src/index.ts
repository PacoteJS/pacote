import { CountingBloomFilter, optimal } from '@pacote/bloom-filter'
import { range, times, windowed } from '@pacote/array'
import { queryTerms } from './query'
import { entries, keys, pick } from './object'

type PreprocessFunction<Document, Field extends keyof Document> = (
  value: Document[Field],
  field: Field,
  document: Document
) => string
type StopwordsFunction = (token: string, language?: string) => boolean
type StemmerFunction = (token: string, language?: string) => string

export type DocumentIndex<
  Document,
  SummaryField extends keyof Document
> = Record<
  string,
  {
    /**
     * Summary fields for the document. These are preserved as-is.
     */
    readonly summary: Pick<Document, SummaryField>
    /**
     * Counting Bloom filter for the document. All words added to the filter are
     * searchable but not retrievable.
     */
    readonly filter: CountingBloomFilter<string>
  }
>

type SearchTokens = {
  required: string[]
  included: string[]
}

const compare = (a: number, b: number) => (a === b ? 0 : a > b ? -1 : 1)

const tokenizer = (text: string): string[] =>
  text
    .split(/\s/)
    .map((token) => token.normalize('NFD').replace(/\W/gi, '').toLowerCase())

/**
 * Encapsulates search functionality based on counting Bloom filters.
 */
export class BloomSearch<
  Document extends Record<string, unknown>,
  SummaryField extends keyof Document = keyof Document,
  IndexField extends keyof Document = keyof Document
> {
  /**
   * Collection containing document summaries and counting Bloom filters used to
   * search, with document shorthand reference identifier used as keys.
   */
  public index: DocumentIndex<Document, SummaryField> = {}
  /**
   * A record containing the name of all indexable fields and their relative
   * weight used to rank search results.
   */
  public readonly fields: Record<IndexField, number>
  /**
   * Aan array with the names of fields to preserve as summary, and which are
   * returned as search results for the matching documents. It is recommended to
   * keep only fields necessary to identify a document (e.g. title, URL, short
   * description) to keep space requirements down.
   */
  public readonly summary: SummaryField[]
  /**
   * Error rate used for all counting Bloom filters.
   */
  public readonly errorRate: number
  /**
   * The _n_-grams to store in the index. Defaults to `1` (no _n_-grams).
   */
  public readonly ngrams: number
  private readonly preprocess: PreprocessFunction<Document, IndexField>
  private readonly stemmer: StemmerFunction
  private readonly stopwords: StopwordsFunction

  /**
   * Creates a new Bloom search instance based on counting Bloom filters, which
   * can be used to add documents and test the membership of search terms in the
   * added set.
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
   * @param options.stopwords   - Filters tokens so that words that are too
   *                              short or too common may be excluded from the
   *                              index. By default, no stopwords are excluded.
   * @param options.stemmer     - Allows plugging in a custom stemming function.
   *                              By default, this class does not change text
   *                              tokens.
   */
  constructor(options: {
    fields: IndexField[] | Record<IndexField, number>
    summary: SummaryField[]
    errorRate?: number
    ngrams?: number
    preprocess?: PreprocessFunction<Document, IndexField>
    stemmer?: StemmerFunction
    stopwords?: StopwordsFunction
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
  load(index: DocumentIndex<Document, SummaryField>): void {
    this.index = entries(index).reduce((acc, [ref, entry]) => {
      acc[ref] = {
        summary: entry.summary,
        filter: new CountingBloomFilter(entry.filter),
      }
      return acc
    }, {} as DocumentIndex<Document, SummaryField>)
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
    const allTokens = keys(this.fields).reduce((tokens, field) => {
      if (document[field] !== undefined) {
        const fieldText = this.preprocess(document[field], field, document)
        const fieldTokens = tokenizer(fieldText)

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

    const uniqTokens = new Set(Object.values(allTokens).flat()).size

    if (uniqTokens === 0) {
      return
    }

    const summary = pick(this.summary, document)
    const filter = new CountingBloomFilter(optimal(uniqTokens, this.errorRate))

    entries(this.fields).forEach(([field, weight = 1]) =>
      (allTokens[field] || []).forEach((token) =>
        times(weight, () => filter.add(token))
      )
    )

    this.index[ref] = { summary, filter }
  }

  /**
   * Removes an indexed document.
   *
   * @param ref - Reference identifier of the document to remove.
   */
  remove(ref: string): void {
    delete this.index[ref]
  }

  /**
   * Scans the document index and returns a list of documents summaries (with
   * only the properties declared in the `summary` option) that possibly match
   * one or more terms in the query.
   *
   * Each search term is run through the provided `stemmer` function to ensure
   * terms are processed in the same way as the tokens previously added to the
   * index's Bloom filters.
   *
   * @param query       - Terms to search.
   *
   * Individual words are matched against the filter of
   * each indexed document. You may prefix each word with
   * the `+` operator to intersect results that (probably)
   * contain the required word.
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
    const searchTokens = this.parseQuery(query, language)

    const searchSpace =
      searchTokens.required.length === 0
        ? Object.keys(this.index)
        : searchTokens.required.reduce(
            (results, token) => results.filter((ref) => this.count(ref, token)),
            Object.keys(this.index)
          )

    return searchSpace
      .map((ref) => ({
        ref,
        matches: searchTokens.included.reduce(
          (count, token) => count + this.count(ref, token),
          0
        ),
      }))
      .filter(({ matches }) => matches > 0)
      .sort((a, b) => compare(a.matches, b.matches))
      .map(({ ref }) => this.index[ref].summary)
  }

  private count(ref: string, token: string): number {
    return this.index[ref].filter.has(token)
  }

  private parseQuery(query: string, language?: string): SearchTokens {
    return queryTerms(query).reduce<SearchTokens>(
      ({ required, included }, [term, type]) => {
        const token = type === 'phrase' ? term : this.stemmer(term, language)
        return {
          required: ['require', 'phrase'].includes(type)
            ? required.concat(token)
            : required,
          included: included.concat(token),
        }
      },
      { required: [], included: [] }
    )
  }
}
