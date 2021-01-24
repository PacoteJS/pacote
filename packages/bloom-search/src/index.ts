import { CountingBloomFilter, optimal } from '@pacote/bloom-filter'

type UnknownDocument = Record<string, unknown>
type PreprocessFunction<
  Document extends UnknownDocument,
  IndexField extends keyof Document
> = (value: Document[IndexField], field?: IndexField) => string
type StopwordsFunction = (token: string, language?: string) => boolean
type StemmerFunction = (token: string, language?: string) => string

interface IndexedDocument<Summary> {
  readonly summary: Summary
  readonly filter: CountingBloomFilter<string>
}

const repeat = (times: number, fn: () => void) =>
  Array(times).fill(null).forEach(fn)

const compare = (a: number, b: number) => (a === b ? 0 : a > b ? -1 : 1)

const nonEmpty = (text: string) => text.length > 0

const keys = <O extends UnknownDocument>(o: O) => Object.keys(o) as (keyof O)[]

const entries = <O extends UnknownDocument>(o: O) =>
  Object.entries(o) as [keyof O, O[keyof O]][]

export class BloomSearch<
  Document extends UnknownDocument,
  SummaryField extends keyof Document,
  IndexField extends keyof Document
> {
  public readonly errorRate: number
  public readonly fields: Record<IndexField, number>
  public readonly summary: SummaryField[]
  public readonly index: IndexedDocument<Pick<Document, SummaryField>>[]
  private readonly preprocess: PreprocessFunction<Document, IndexField> = String
  private readonly stemmer: StemmerFunction = (token) => token
  private readonly stopwords: StopwordsFunction = () => true

  constructor(
    options: Readonly<{
      errorRate: number
      fields: IndexField[] | Record<IndexField, number>
      summary: SummaryField[]
      index?: IndexedDocument<Pick<Document, SummaryField>>[]
      preprocess?: PreprocessFunction<Document, IndexField>
      stemmer?: StemmerFunction
      stopwords?: StopwordsFunction
    }>
  ) {
    this.errorRate = options.errorRate
    this.fields = Array.isArray(options.fields)
      ? options.fields.reduce(
          (acc, field) => ({ ...acc, [field]: 1 }),
          {} as Record<IndexField, number>
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

  add<T extends Document>(document: T, language?: string): void {
    const tokens = keys(this.fields).reduce((acc, field) => {
      if (document[field] !== undefined) {
        acc[field] = this.tokenizer(this.preprocess(document[field], field))
          .filter((token) => nonEmpty(token) && this.stopwords(token, language))
          .map((token) => this.stemmer(token, language))
      }
      return acc
    }, {} as Record<IndexField, string[]>)

    const uniqueTokens = new Set(Object.values(tokens).flat()).size

    if (uniqueTokens === 0) {
      return
    }

    const filter = new CountingBloomFilter(
      optimal(uniqueTokens, this.errorRate)
    )

    entries(this.fields).forEach(([field, weight]) =>
      tokens[field].forEach((token) =>
        repeat(weight ?? 1, () => filter.add(token))
      )
    )

    const entry = this.summary.reduce(
      (acc, name) => {
        acc.summary[name] = document[name]
        return acc
      },
      { summary: {} as Pick<Document, SummaryField>, filter }
    )

    this.index.push(entry)
  }

  search(terms: string, language?: string): Pick<Document, SummaryField>[] {
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
