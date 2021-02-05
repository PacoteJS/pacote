type SearchTerm = [string, 'include' | 'require' | 'phrase']

const joinPhrase = (term: string) => term.replace(/\s+/g, '_')
const splitPhrase = (term: string) => term.replace(/_+/g, ' ')
const removeOperators = (term: string) => term.replace(/(^\+|^"|"$)/g, '')

export function queryTerms(query: string): SearchTerm[] {
  return query
    .replace(/"[^"]+"/g, joinPhrase)
    .split(/\s/)
    .map<SearchTerm>((term) => [
      removeOperators(splitPhrase(term)).toLowerCase(),
      term.startsWith('"')
        ? 'phrase'
        : term.startsWith('+')
        ? 'require'
        : 'include',
    ])
    .filter(([term]) => term.length)
}
