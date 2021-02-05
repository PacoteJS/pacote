import { CountingBloomFilter, optimal } from '@pacote/bloom-filter'
import { range, windowed } from '@pacote/array'
import { queryTerms } from './query'
import { entries, keys, pick } from './object'

type PreprocessFunction<Document, Field extends keyof Document> = (
  value: Document[Field],
  field: Field
) => string
type StopwordsFunction = (token: string, language?: string) => boolean
type StemmerFunction = (token: string, language?: string) => string

export type DocumentIndex<
  Document,
  SummaryField extends keyof Document
> = Record<
  string,
  {
    readonly summary: Pick<Document, SummaryField>
    readonly filter: CountingBloomFilter<string>
  }
>

type SearchTokens = {
  required: string[]
  included: string[]
}

function repeat(times: number, fn: () => void) {
  if (times > 0) {
    fn()
    repeat(times - 1, fn)
  }
}

const compare = (a: number, b: number) => (a === b ? 0 : a > b ? -1 : 1)

const tokenizer = (text: string): string[] =>
  text
    .split(/\s/)
    .map((token) => token.normalize('NFD').replace(/\W/gi, '').toLowerCase())

export class BloomSearch<
  Document extends Record<string, unknown>,
  SummaryField extends keyof Document,
  IndexField extends keyof Document
> {
  public index: DocumentIndex<Document, SummaryField> = {}
  public readonly fields: Record<IndexField, number>
  public readonly summary: SummaryField[]
  public readonly errorRate: number
  public readonly ngrams: number
  private readonly preprocess: PreprocessFunction<Document, IndexField>
  private readonly stemmer: StemmerFunction
  private readonly stopwords: StopwordsFunction

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

  load(index: DocumentIndex<Document, SummaryField>): void {
    this.index = entries(index).reduce((acc, [ref, entry]) => {
      acc[ref] = {
        summary: entry.summary,
        filter: new CountingBloomFilter(entry.filter),
      }
      return acc
    }, {} as DocumentIndex<Document, SummaryField>)
  }

  add(ref: string, document: Document, language?: string): void {
    const allTokens = keys(this.fields).reduce((tokens, field) => {
      if (document[field] !== undefined) {
        const fieldText = this.preprocess(document[field], field)
        const fieldTokens = tokenizer(fieldText)

        const unigrams = fieldTokens
          .filter((token) => token.length && this.stopwords(token, language))
          .map((token) => this.stemmer(token, language))

        const ngrams = range(2, this.ngrams + 1).map((i) =>
          windowed(i, fieldTokens).map((ngram) => ngram.join(' '))
        )

        tokens[field] = unigrams.concat(...ngrams)
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
        repeat(weight, () => filter.add(token))
      )
    )

    this.index[ref] = { summary, filter }
  }

  remove(ref: string): void {
    delete this.index[ref]
  }

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
