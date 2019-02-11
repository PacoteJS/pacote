import { isPlainObject } from '@pacote/is-plain-object'
import { Either } from 'fp-ts/lib/Either'
import { equals, map, where, F } from 'ramda'

export interface AsymmetricMatcher {
  asymmetricMatch(other: any): boolean
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

export function isAsymmetricMatcher(
  matcher: any
): matcher is AsymmetricMatcher {
  return isFunction(matcher.asymmetricMatch)
}

export const matchObject = (s: any) => (o: any) =>
  isPlainObject(o) ? where(map(matchObject, s), o) : equals(s, o)

export const matchString = (s: RegExp) => (o: any) => s.test(o)

export function leftPredicate(
  actual: Either<any, any>,
  predicate: (left: any) => boolean
): boolean {
  return actual.fold(predicate, F)
}

export function rightPredicate(
  actual: Either<any, any>,
  predicate: (right: any) => boolean
): boolean {
  return actual.fold(F, predicate)
}
