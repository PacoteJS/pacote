export interface AsymmetricMatcher {
  asymmetricMatch(other: any): boolean
}

export function isAsymmetricMatcher(
  matcher: any
): matcher is AsymmetricMatcher {
  return typeof matcher.asymmetricMatch === 'function'
}
