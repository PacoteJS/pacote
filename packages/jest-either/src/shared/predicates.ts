import { isPlainObject } from '@pacote/is-plain-object'
import { pipe } from 'fp-ts/function'
import { type Either, fold } from 'fp-ts/lib/Either'
import type { MatcherContext } from './types'

const F = () => false

export interface AsymmetricMatcher {
  asymmetricMatch(other: unknown): boolean
}

export function isAsymmetricMatcher(
  // biome-ignore lint/suspicious/noExplicitAny: can be anything
  matcher: any,
): matcher is AsymmetricMatcher {
  return typeof matcher.asymmetricMatch === 'function'
}

export const matchObject =
  (context: MatcherContext, expected: unknown) =>
  (actual: unknown): boolean => {
    if (isAsymmetricMatcher(expected)) {
      return expected.asymmetricMatch(actual)
    }

    if (isPlainObject(expected) && isPlainObject(actual)) {
      return Object.entries(expected).every(([key, value]) =>
        matchObject(context, value)((actual as Record<string, unknown>)[key]),
      )
    }

    return context.equals(actual, expected)
  }

export const matchString = (s: RegExp) => (o: unknown) => s.test(String(o))

export function leftPredicate(
  actual: Either<unknown, unknown>,
  predicate: (left: unknown) => boolean,
): boolean {
  return pipe(actual, fold(predicate, F))
}

export function rightPredicate(
  actual: Either<unknown, unknown>,
  predicate: (right: unknown) => boolean,
): boolean {
  return pipe(actual, fold(F, predicate))
}
