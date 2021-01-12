import { h32 } from 'xxhashjs'

interface Options {
  readonly size: number
  readonly hashes: number
  readonly seed?: number
  readonly filter?: Uint32Array
}

export class BloomFilter<T extends { toString(): string }> {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: Uint32Array

  private h1: (element: string) => number
  private h2: (element: string) => number

  constructor(options: Options) {
    if (options.hashes < 1) {
      throw Error('BloomFilter requires at least one hash')
    }

    this.size = options.size
    this.hashes = options.hashes
    this.seed = options.seed ?? 0x00c0ffee
    this.filter = options.filter ?? new Uint32Array(Math.ceil(this.size / 32))

    const h32s1 = h32(this.seed + 1)
    const h32s2 = h32(this.seed + 2)

    this.h1 = (element) => h32s1.update(element).digest().toNumber()
    this.h2 = (element) => h32s2.update(element).digest().toNumber()
  }

  static optimal(items: number, errorRate: number): Options {
    const size = Math.ceil(-(items * Math.log(errorRate)) / Math.LN2 ** 2)
    const hashes = Math.round((size / items) * Math.LN2)
    return { size, hashes }
  }

  add(element: T): void {
    this.elementIndices(element).forEach(this.setIndex)
  }

  has(element: T): boolean {
    return this.elementIndices(element).every(this.indexExists)
  }

  private setIndex = (index: number) => {
    const i = Math.floor(index / 32)
    this.filter[i] |= 1 << (index - i * 32)
  }

  private indexExists = (index: number) => {
    const i = Math.floor(index / 32)
    return this.filter[i] & (1 << (index - i * 32))
  }

  private elementIndices(element: T, indices: number[] = [], n = 1): number[] {
    if (indices.length === this.hashes) {
      return indices
    } else {
      const elementString = element.toString()
      const index = Math.abs(
        (this.h1(elementString) + n * this.h2(elementString)) % this.size
      )

      if (!indices.includes(index)) {
        indices.push(index)
      }

      return this.elementIndices(element, indices, n + 1)
    }
  }
}
