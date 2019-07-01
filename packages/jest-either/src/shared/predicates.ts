import { isPlainObject } from '@pacote/is-plain-object'
import { Either, fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { equals, map, where, F } from 'ramda'

export interface AsymmetricMatcher {
  asymmetricMatch(other: any): boolean
}

export function isAsymmetricMatcher(
  matcher: any
): matcher is AsymmetricMatcher {
  return typeof matcher.asymmetricMatch === 'function'
}

export const matchObject = (s: any) => (o: any) =>
  isPlainObject(o) ? where(map(matchObject, s), o) : equals(s, o)

export const matchString = (s: RegExp) => (o: any) => s.test(o)

export function leftPredicate(
  actual: Either<any, any>,
  predicate: (left: any) => boolean
): boolean {
  return pipe(
    actual,
    fold(predicate, F)
  )
}

export function rightPredicate(
  actual: Either<any, any>,
  predicate: (right: any) => boolean
): boolean {
  return pipe(
    actual,
    fold(F, predicate)
  )
}
