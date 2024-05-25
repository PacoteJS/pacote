import { range } from '@pacote/array'
import { defaultHash } from './hash'
import type { Options } from './options'

export class BloomFilter<T extends { toString(): string }> {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: Uint32Array
  private readonly hash: (index: number, element: string) => number

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
    this.hash = options.hash ?? defaultHash(this.seed)
  }

  add(element: T): void {
    range(0, this.hashes).forEach((i) => {
      const hashedValue = this.hash(i, element.toString()) % this.size
      const position = Math.floor(hashedValue / 32)
      this.filter[position] |= 1 << (hashedValue - position * 32)
    })
  }

  has(element: T): boolean {
    return range(0, this.hashes).every((i) => {
      const hashedValue = this.hash(i, element.toString()) % this.size
      const position = Math.floor(hashedValue / 32)
      return this.filter[position] & (1 << (hashedValue - position * 32))
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

export type SerialisedBloomFilter = {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: number[]
}
