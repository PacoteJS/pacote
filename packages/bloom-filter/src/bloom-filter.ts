import { hashLocations } from './hash'
import { Options } from './options'

export class BloomFilter<T extends { toString(): string }> {
  readonly size: number
  readonly hashes: number
  readonly seed: number
  readonly filter: Uint32Array

  private getHashLocations: (element: string) => number[]

  constructor(options: Options) {
    if (options.hashes < 1) {
      throw Error('BloomFilter requires at least one hash')
    }

    this.size = options.size
    this.hashes = options.hashes
    this.seed = options.seed ?? 0x00c0ffee
    this.filter = options.filter ?? new Uint32Array(Math.ceil(this.size / 32))

    this.getHashLocations = hashLocations(this.size, this.hashes, this.seed)
  }

  add(element: T): void {
    this.getHashLocations(element.toString()).forEach((index) => {
      const i = Math.floor(index / 32)
      this.filter[i] |= 1 << (index - i * 32)
    })
  }

  has(element: T): boolean {
    return this.getHashLocations(element.toString()).every((index) => {
      const i = Math.floor(index / 32)
      return this.filter[i] & (1 << (index - i * 32))
    })
  }
}
