import { isPlainObject } from '@pacote/is-plain-object'
import { pipe } from 'fp-ts/function'
import { type Either, fold } from 'fp-ts/lib/Either'
import { equals, F, map, where } from 'ramda'

export interface AsymmetricMatcher {
  asymmetricMatch(other: unknown): boolean
}

export function isAsymmetricMatcher(
  // biome-ignore lint/suspicious/noExplicitAny: can be anything
  matcher: any,
): matcher is AsymmetricMatcher {
  return typeof matcher.asymmetricMatch === 'function'
}

export const matchObject = (expected: unknown) => (actual: unknown) => {
  if (isAsymmetricMatcher(expected)) {
    return expected.asymmetricMatch(actual)
  }

  if (isPlainObject(expected) && isPlainObject(actual)) {
    return where(
      map(matchObject, expected as Record<string, unknown>),
      actual as Record<string, unknown>,
    )
  }

  return equals(expected, actual)
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
