export interface MatcherResult {
  pass: boolean
  message: () => string
  actual?: unknown
  expected?: unknown
}

export type MatcherFn = (
  this: unknown,
  received: unknown,
  ...expected: Array<unknown>
) => MatcherResult | Promise<MatcherResult>

export type MatchersObject = Record<string, MatcherFn>
