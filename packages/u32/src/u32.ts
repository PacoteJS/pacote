export type U32 = readonly [number, number]

const BITS_PER_CHUNK = 16

export const overflow = (value: number) => value >>> BITS_PER_CHUNK
export const clamp = (value: number) => value & 0xffff

export function fromNumber(value: number): U32 {
  return [clamp(value), overflow(value)]
}

export function toNumber(value: U32): number {
  return value[1] * 2 ** BITS_PER_CHUNK + value[0]
}

export const ZERO = fromNumber(0)

export function clampBlocks([v0, v1]: U32): U32 {
  return [clamp(v0), clamp(v1)]
}
