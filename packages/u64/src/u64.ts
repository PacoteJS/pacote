export type U64 = readonly [number, number, number, number]

export const overflow = (value: number) => value >>> 16
export const clamp = (value: number) => value & 0xffff

export function fromNumber(value: number): U64 {
  return [clamp(value), overflow(value), 0, 0]
}

export function toNumber(value: U64): number {
  return value[1] * 2 ** 16 + value[0]
}

export const ZERO = fromNumber(0)

export function clampBlocks([v0, v1, v2, v3]: U64): U64 {
  return [clamp(v0), clamp(v1), clamp(v2), clamp(v3)]
}
