import { defaultHash } from './hash'
import type { Options } from './options'

export class CountingBloomFilter<T extends { toString(): string }> {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: Uint32Array
  private hash: (i: number, element: string) => number

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
    this.filter = options.filter ?? new Uint32Array(this.size)
    this.hash = options.hash ?? defaultHash(this.seed)
  }

  add(element: T): void {
    for (let i = 0; i < this.hashes; i++) {
      const position = this.hashPosition(i, element)
      this.filter[position] += 1
    }
  }

  remove(element: T): void {
    for (let i = 0; i < this.hashes; i++) {
      const position = this.hashPosition(i, element)
      if (this.filter[position] > 0) {
        this.filter[position] -= 1
      }
    }
  }

  has(element: T): number {
    let min = Number.POSITIVE_INFINITY
    for (let i = 0; i < this.hashes; i++) {
      const position = this.hashPosition(i, element)
      min = Math.min(min, this.filter[position])
    }
    return min
  }

  toJSON(): SerialisedCountingBloomFilter {
    return {
      filter: Array.from(this.filter),
      hashes: this.hashes,
      seed: this.seed,
      size: this.size,
    }
  }

  private hashPosition(i: number, element: T): number {
    return this.hash(i, element.toString()) % this.size
  }
}

export type SerialisedCountingBloomFilter = {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: number[]
}
