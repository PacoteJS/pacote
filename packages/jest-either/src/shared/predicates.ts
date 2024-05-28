import { isPlainObject } from '@pacote/is-plain-object'
import { pipe } from 'fp-ts/function'
import { type Either, fold } from 'fp-ts/lib/Either'
import { F, equals, map, where } from 'ramda'

export interface AsymmetricMatcher {
  asymmetricMatch(other: unknown): boolean
}

export function isAsymmetricMatcher(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  matcher: any,
): matcher is AsymmetricMatcher {
  return typeof matcher.asymmetricMatch === 'function'
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const matchObject = (s: any) => (o: unknown) =>
  isPlainObject(o) ? where(map(matchObject, s), o) : equals(s, o)

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
