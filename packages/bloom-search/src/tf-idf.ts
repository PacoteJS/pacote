import { entries } from './object'

function idfSmooth(
  term: string,
  frequencies: Record<string, number>[],
  totalDocuments: number
): number {
  const idfWeight = frequencies.reduce(
    (total, frequency) => total + (frequency[term] > 0 ? 1 : 0),
    1
  )
  return 1 + Math.log(totalDocuments / idfWeight)
}

export function countIdf(
  termFrequencies: Record<string, number>,
  documentTermFrequencies: Record<string, number>[],
  totalDocuments: number
): number {
  return entries(termFrequencies).reduce<number>(
    (tfidf, [term, tf]) =>
      tfidf + tf * idfSmooth(term, documentTermFrequencies, totalDocuments),
    0
  )
}
