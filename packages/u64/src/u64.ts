export type U64 = readonly [number, number, number, number]

const BITS_PER_CHUNK = 16

export const overflow = (value: number) => value >>> BITS_PER_CHUNK
export const clamp = (value: number) => value & 0xffff

export function fromNumber(value: number): U64 {
  return [clamp(value), overflow(value), 0, 0]
}

export function toNumber(value: U64): number {
  return value[1] * Math.pow(2, BITS_PER_CHUNK) + value[0]
}

export const ZERO = fromNumber(0)

export function clampChunks([v0, v1, v2, v3]: U64): U64 {
  return [clamp(v0), clamp(v1), clamp(v2), clamp(v3)]
}
