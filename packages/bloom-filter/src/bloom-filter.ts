import { elementIndexHasher } from './hash'
import { optimal } from './optimal'

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

  private elementIndices: (element: T) => number[]

  constructor(options: Options) {
    if (options.hashes < 1) {
      throw Error('BloomFilter requires at least one hash')
    }

    this.size = options.size
    this.hashes = options.hashes
    this.seed = options.seed ?? 0x00c0ffee
    this.filter = options.filter ?? new Uint32Array(Math.ceil(this.size / 32))

    this.elementIndices = elementIndexHasher(this.size, this.hashes, this.seed)
  }

  static optimal = optimal

  add(element: T): void {
    this.elementIndices(element).forEach((index: number) => {
      const i = Math.floor(index / 32)
      this.filter[i] |= 1 << (index - i * 32)
    })
  }

  has(element: T): boolean {
    return this.elementIndices(element).every((index: number) => {
      const i = Math.floor(index / 32)
      return this.filter[i] & (1 << (index - i * 32))
    })
  }
}
