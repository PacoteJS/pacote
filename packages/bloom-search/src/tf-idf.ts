import { entries } from './object'

export function createIdfLookup(
  frequencies: Record<string, number>[],
  totalDocuments: number,
): Record<string, number> {
  const documentFrequencyByTerm: Record<string, number> = {}

  for (const termFrequencies of frequencies) {
    for (const [term, tf] of entries(termFrequencies)) {
      if (tf <= 0) continue
      documentFrequencyByTerm[term] = (documentFrequencyByTerm[term] ?? 0) + 1
    }
  }

  return entries(documentFrequencyByTerm).reduce<Record<string, number>>(
    (idfByTerm, [term, nt]) => {
      idfByTerm[term] = 1 + Math.log(totalDocuments / (1 + nt))
      return idfByTerm
    },
    {},
  )
}

export function countIdf(
  termFrequencies: Record<string, number>,
  idfByTerm: Record<string, number>,
): number {
  return entries(termFrequencies).reduce((tfidf, [term, tf]) => {
    if (tf <= 0 || idfByTerm[term] == null) return tfidf
    return tfidf + tf * idfByTerm[term]
  }, 0)
}
