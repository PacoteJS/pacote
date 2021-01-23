import { CountingBloomFilter, optimal } from '@pacote/bloom-filter'

type Document = Record<string, unknown>
type Result = Record<string, unknown>
type DocumentTokens = Record<string, string[]>
type Preprocess = (value: unknown, field?: string) => string
type Stemmer = (token: string, language?: string) => string
type Stopwords = (token: string, language?: string) => boolean

interface Options {
  readonly errorRate: number
  readonly fields: string[] | Record<string, number>
  readonly summary?: string[]
  readonly index?: IndexedDocument[]
  readonly preprocess?: Preprocess
  readonly stemmer?: Stemmer
  readonly stopwords?: Stopwords
}

interface IndexedDocument {
  readonly summary: Result
  readonly filter: CountingBloomFilter<string>
}

function repeat(times: number, fn: (...args: unknown[]) => void): void {
  return Array(times).fill(null).forEach(fn)
}

function compare(a: number, b: number): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? -1 : 1
}

function nonEmpty(text: string): boolean {
  return text.length > 0
}

export class BloomSearch {
  public readonly index: IndexedDocument[]
  private readonly errorRate: number
  private readonly fields: Record<string, number>
  private readonly summary: string[]
  private readonly preprocess: Preprocess = (text) => String(text)
  private readonly stemmer: Stemmer = (token) => token
  private readonly stopwords: Stopwords = () => true

  constructor(options: Options) {
    this.errorRate = options.errorRate
    this.fields = Array.isArray(options.fields)
      ? options.fields.reduce((acc, field) => ({ ...acc, [field]: 1 }), {})
      : options.fields
    this.summary = options.summary ?? []
    this.preprocess = options.preprocess ?? this.preprocess
    this.stemmer = options.stemmer ?? this.stemmer
    this.stopwords = options.stopwords ?? this.stopwords
    this.index =
      options.index?.map((indexedDocument) => ({
        ...indexedDocument,
        filter: new CountingBloomFilter(indexedDocument.filter),
      })) ?? []
  }

  add(document: Document, language?: string): void {
    const tokens = Object.keys(this.fields).reduce<DocumentTokens>(
      (acc, field) => {
        acc[field] = this.tokenizer(this.preprocess(document[field], field))
          .filter((token) => nonEmpty(token) && this.stopwords(token, language))
          .map((token) => this.stemmer(token, language))
        return acc
      },
      {}
    )

    const uniqTokens = new Set(Object.values(tokens).flat()).size

    if (uniqTokens === 0) {
      return
    }

    const filter = new CountingBloomFilter(optimal(uniqTokens, this.errorRate))

    Object.entries(this.fields).forEach(([field, weight]) => {
      tokens[field].forEach((token) =>
        repeat(weight as number, () => filter.add(token))
      )
    })

    const summaryFields = this.summary.length
      ? this.summary
      : Object.keys(document)

    const entry = summaryFields.reduce<IndexedDocument>(
      (acc, name) => {
        acc.summary[name] = document[name]
        return acc
      },
      { summary: {}, filter }
    )

    this.index.push(entry)
  }

  search(terms: string, language?: string): Result[] {
    return this.index
      .map(({ summary, filter }) => ({
        summary,
        matches: terms
          .split(/\s/)
          .filter(nonEmpty)
          .reduce(
            (acc, term) => acc + filter.has(this.stemmer(term, language)),
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
