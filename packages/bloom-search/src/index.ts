import { CountingBloomFilter, optimal } from '@pacote/bloom-filter'

type Document<V = unknown> = Record<string, V>
type Preprocess<D extends Document, I extends keyof D> = (
  value: D[I],
  field?: I
) => string
type Stopwords = (token: string, language?: string) => boolean
type Stemmer = (token: string, language?: string) => string

interface IndexedDocument<D extends Document, S extends keyof D> {
  readonly summary: Pick<D, S>
  readonly filter: CountingBloomFilter<string>
}

interface Options<D extends Document, S extends keyof D, I extends keyof D> {
  readonly errorRate: number
  readonly fields: I[] | Record<I, number>
  readonly summary: S[]
  readonly index?: IndexedDocument<D, S>[]
  readonly preprocess?: Preprocess<D, I>
  readonly stemmer?: Stemmer
  readonly stopwords?: Stopwords
}

const repeat = (times: number, fn: () => void) =>
  Array(times).fill(null).forEach(fn)

const compare = (a: number, b: number) => (a === b ? 0 : a > b ? -1 : 1)

const nonEmpty = (text: string) => text.length > 0

const keys = <O extends Record<string, unknown>>(o: O) =>
  Object.keys(o) as (keyof O)[]

const entries = <O extends Record<string, unknown>>(o: O) =>
  Object.entries(o) as [keyof O, O[keyof O]][]

export class BloomSearch<
  T extends Document,
  S extends keyof T,
  I extends keyof T
> {
  public readonly index: IndexedDocument<T, S>[]
  public readonly errorRate: number
  public readonly fields: Record<I, number>
  public readonly summary: S[]
  private readonly preprocess: Preprocess<T, I> = String
  private readonly stemmer: Stemmer = (token) => token
  private readonly stopwords: Stopwords = () => true

  constructor(options: Options<T, S, I>) {
    this.errorRate = options.errorRate
    this.fields = Array.isArray(options.fields)
      ? options.fields.reduce(
          (acc, field) => ({ ...acc, [field]: 1 }),
          {} as Record<I, number>
        )
      : options.fields
    this.summary = options.summary
    this.preprocess = options.preprocess ?? this.preprocess
    this.stemmer = options.stemmer ?? this.stemmer
    this.stopwords = options.stopwords ?? this.stopwords
    this.index =
      options.index?.map((indexedDocument) => ({
        ...indexedDocument,
        filter: new CountingBloomFilter(indexedDocument.filter),
      })) ?? []
  }

  add<D extends T & Pick<T, I | S>>(document: D, language?: string): void {
    const tokens = keys(this.fields).reduce((acc, field) => {
      acc[field] = this.tokenizer(this.preprocess(document[field], field))
        .filter((token) => nonEmpty(token) && this.stopwords(token, language))
        .map((token) => this.stemmer(token, language))
      return acc
    }, {} as Record<I, string[]>)

    const uniqueTokens = new Set(Object.values(tokens).flat()).size

    if (uniqueTokens === 0) {
      return
    }

    const filter = new CountingBloomFilter(
      optimal(uniqueTokens, this.errorRate)
    )

    entries(this.fields).forEach(([field, weight]) =>
      tokens[field].forEach((token) => repeat(weight, () => filter.add(token)))
    )

    const entry = this.summary.reduce(
      (acc, name) => {
        acc.summary[name] = document[name]
        return acc
      },
      { summary: {} as Pick<T, S>, filter }
    )

    this.index.push(entry)
  }

  search(terms: string, language?: string): Pick<T, S>[] {
    return this.index
      .map(({ summary, filter }) => ({
        summary,
        matches: terms
          .split(/\s/)
          .filter(nonEmpty)
          .reduce(
            (matches, term) =>
              matches + filter.has(this.stemmer(term, language)),
            0
          ),
      }))
      .filter(({ matches }) => matches > 0)
      .sort((a, b) => compare(a.matches, b.matches))
      .map(({ summary }) => summary)
  }

  private tokenizer(text: string): string[] {
    return text
      .split(/\s/)
      .map((token) => token.normalize('NFD').replace(/\W/gi, '').toLowerCase())
  }
}
