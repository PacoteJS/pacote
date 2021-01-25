import { CountingBloomFilter, optimal } from '@pacote/bloom-filter'

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
  public index: DocumentIndex<Document, SummaryField> = {}
  public readonly fields: Record<IndexField, number>
  public readonly summary: SummaryField[]
  public readonly errorRate: number
  private readonly preprocess: PreprocessFunction<Document, IndexField>
  private readonly stemmer: StemmerFunction
  private readonly stopwords: StopwordsFunction

  constructor(options: {
    fields: IndexField[] | Record<IndexField, number>
    summary: SummaryField[]
    errorRate?: number
    preprocess?: PreprocessFunction<Document, IndexField>
    stemmer?: StemmerFunction
    stopwords?: StopwordsFunction
  }) {
    this.fields = Array.isArray(options.fields)
      ? options.fields.reduce((acc, field) => {
          acc[field] = 1
          return acc
        }, {} as Record<IndexField, number>)
      : options.fields
    this.summary = options.summary
    this.errorRate = options.errorRate ?? 0.0001
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
      (tokens[field] || []).forEach((token) =>
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

    this.index[ref] = entry
  }

  remove(ref: string): void {
    delete this.index[ref]
  }

  search(terms: string, language?: string): Pick<Document, SummaryField>[] {
    return Object.values(this.index)
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
