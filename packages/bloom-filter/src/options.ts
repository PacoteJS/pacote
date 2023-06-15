export interface Options {
  readonly size: number
  readonly hashes: number
  readonly seed?: number
  readonly filter?: Uint32Array
  readonly hash?: (index: number, data: string) => number
}
