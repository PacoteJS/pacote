const NORMAL = Symbol('normal')
export const EXCLUDE = Symbol('exclude')
export const PHRASE = Symbol('phrase')
export const REQUIRE = Symbol('require')

type SearchTerm = [
  string,
  typeof NORMAL | typeof EXCLUDE | typeof REQUIRE | typeof PHRASE,
]

const joinPhrase = (term: string) => term.replace(/\s+/g, '_')
const splitPhrase = (term: string) => term.replace(/_+/g, ' ')
const removeOperators = (term: string) => term.replace(/(^\+|^-|^"|"$)/g, '')

export function queryTerms(query: string): SearchTerm[] {
  return query
    .replace(/"[^"]+"/g, joinPhrase)
    .split(/\s/)
    .map<SearchTerm>((term) => [
      removeOperators(splitPhrase(term)).toLowerCase(),
      term.startsWith('"')
        ? PHRASE
        : term.startsWith('+')
          ? REQUIRE
          : term.startsWith('-')
            ? EXCLUDE
            : NORMAL,
    ])
    .filter(([term]) => term.length)
}
