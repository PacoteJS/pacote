export interface MatcherResult {
  pass: boolean
  message: () => string
  actual?: unknown
  expected?: unknown
}

export interface MatcherContext {
  equals(a: unknown, b: unknown): boolean
}

export type MatcherFn = (
  this: MatcherContext,
  received: unknown,
  ...expected: Array<unknown>
) => MatcherResult | Promise<MatcherResult>

export type MatchersObject = Record<string, MatcherFn>
