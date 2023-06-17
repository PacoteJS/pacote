import { entries } from './object'

function idfSmooth(
  term: string,
  frequencies: Record<string, number>[],
  totalDocuments: number
): number {
  const nt = 1 + frequencies.filter((frequency) => frequency[term] > 0).length
  return 1 + Math.log(totalDocuments / nt)
}

export function countIdf(
  termFrequencies: Record<string, number>,
  documentTermFrequencies: Record<string, number>[],
  totalDocuments: number
): number {
  return entries(termFrequencies).reduce<number>((tfidf, [term, tf]) => {
    const idf = idfSmooth(term, documentTermFrequencies, totalDocuments)
    return tfidf + tf * idf
  }, 0)
}
