import { memoize } from '@pacote/memoize'
import { hashLocations } from './hash'
import { Options } from './options'

export class BloomFilter<T extends { toString(): string }> {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: Uint32Array

  private computeHashLocations: (element: string) => number[]

  constructor(options: Options) {
    if (options.size < 1) {
      throw Error('size must be greater than 0')
    }

    if (options.hashes < 1) {
      throw Error('number of hashes must be greater than 0')
    }

    this.size = options.size
    this.hashes = options.hashes
    this.seed = options.seed ?? 0x00c0ffee
    this.filter = options.filter ?? new Uint32Array(Math.ceil(this.size / 32))

    this.computeHashLocations = memoize(
      (i) => i,
      hashLocations(this.size, this.hashes, this.seed)
    )
  }

  add(element: T): void {
    this.computeHashLocations(element.toString()).forEach((index) => {
      const i = Math.floor(index / 32)
      this.filter[i] |= 1 << (index - i * 32)
    })
  }

  has(element: T): boolean {
    return this.computeHashLocations(element.toString()).every((index) => {
      const i = Math.floor(index / 32)
      return this.filter[i] & (1 << (index - i * 32))
    })
  }

  toJSON(): SerialisedBloomFilter {
    return {
      filter: Array.from(this.filter),
      hashes: this.hashes,
      seed: this.seed,
      size: this.size,
    }
  }
}

type SerialisedBloomFilter = {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: number[]
}
