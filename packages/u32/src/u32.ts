export type U32 = readonly [number, number]

export const overflow = (value: number) => value >>> 16
export const clamp = (value: number) => value & 0xffff

export function fromNumber(value: number): U32 {
  return [clamp(value), overflow(value)]
}

export function toNumber(value: U32): number {
  return value[1] * 2 ** 16 + value[0]
}

export const ZERO = fromNumber(0)

export function clampBlocks([v0, v1]: U32): U32 {
  return [clamp(v0), clamp(v1)]
}
