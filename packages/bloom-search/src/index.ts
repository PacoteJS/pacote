import { CountingBloomFilter, optimal } from '@pacote/bloom-filter'

type PreprocessFunction<Document, Field extends keyof Document> = (
  value: Document[Field],
  field: Field
) => string
type StopwordsFunction = (token: string, language?: string) => boolean
type StemmerFunction = (token: string, language?: string) => string

type DocumentIndex<Document, SummaryField extends keyof Document> = {
  readonly summary: Pick<Document, SummaryField>
  readonly filter: CountingBloomFilter<string>
}

function repeat(times: number, fn: () => void) {
  if (times > 0) {
    fn()
    repeat(times - 1, fn)
  }
}

const compare = (a: number, b: number) => (a === b ? 0 : a > b ? -1 : 1)

const nonEmpty = (text: string) => text.length > 0

const keys = <O>(o: O) => Object.keys(o) as (keyof O)[]

const entries = <O>(o: O) => Object.entries(o) as [keyof O, O[keyof O]][]

export class BloomSearch<
  Document extends Record<string, unknown>,
  SummaryField extends keyof Document,
  IndexField extends keyof Document
> {
  public readonly errorRate: number
  public readonly fields: Record<IndexField, number>
  public readonly summary: SummaryField[]
  public readonly index: DocumentIndex<Document, SummaryField>[]
  private readonly preprocess: PreprocessFunction<Document, IndexField>
  private readonly stemmer: StemmerFunction
  private readonly stopwords: StopwordsFunction

  constructor(options: {
    errorRate: number
    fields: IndexField[] | Record<IndexField, number>
    summary: SummaryField[]
    index?: DocumentIndex<Document, SummaryField>[]
    preprocess?: PreprocessFunction<Document, IndexField>
    stemmer?: StemmerFunction
    stopwords?: StopwordsFunction
  }) {
    this.errorRate = options.errorRate
    this.fields = Array.isArray(options.fields)
      ? options.fields.reduce((acc, field) => {
          acc[field] = 1
          return acc
        }, {} as Record<IndexField, number>)
      : options.fields
    this.summary = options.summary
    this.preprocess = options.preprocess ?? String
    this.stemmer = options.stemmer ?? ((token) => token)
    this.stopwords = options.stopwords ?? (() => true)
    this.index =
      options.index?.map((documentIndex) => ({
        ...documentIndex,
        filter: new CountingBloomFilter(documentIndex.filter),
      })) ?? []
  }

  add(document: Document, language?: string): void {
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
