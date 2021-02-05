export function windowed<T>(size: number, array: T[]): T[][]
export function windowed<T>(size: number, step: number, array: T[]): T[][]
export function windowed<T>(
  size: number,
  stepOrArray: number | T[],
  arrayOrNothing: T[] = []
): T[][] {
  const [step, array] = Array.isArray(stepOrArray)
    ? [1, stepOrArray]
    : [stepOrArray, arrayOrNothing]

  if (size <= 0) throw Error('size must be a positive integer')
  if (step <= 0) throw Error('step must be a positive integer')

  if (array.length === 0) return []
  if (array.length <= size) return [array]

  const indexLimit = array.length - size
  const snapshots = []
  let index = 0

  while (index <= indexLimit) {
    snapshots.push(array.slice(index, index + size))
    index = index + step
  }

  return snapshots
}
