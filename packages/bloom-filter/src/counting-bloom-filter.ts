import { elementIndexHasher } from './hash'
import { optimal } from './optimal'
import { Options } from './options'

export class CountingBloomFilter<T extends { toString(): string }> {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: Uint32Array
  private indices: (element: T) => number[]

  constructor(options: Options) {
    if (options.hashes < 1) {
      throw Error('CountingBloomFilter requires at least one hash')
    }

    this.size = options.size
    this.hashes = options.hashes
    this.seed = options.seed ?? 0x00c0ffee
    this.filter = options.filter ?? new Uint32Array(this.size)

    this.indices = elementIndexHasher(this.size, this.hashes, this.seed)
  }

  static optimal = optimal

  add(element: T): void {
    this.indices(element).forEach((index: number) => {
      this.filter[index] += 1
    })
  }

  remove(element: T): void {
    this.indices(element).forEach((index: number) => {
      if (this.filter[index] > 0) {
        this.filter[index] -= 1
      }
    })
  }

  has(element: T): number {
    return Math.min(
      ...this.indices(element).map((index: number) => this.filter[index])
    )
  }
}
