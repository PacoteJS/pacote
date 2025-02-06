export type U32 = readonly [number, number]

export function fromNumber(value: number): U32 {
  return [value & 0xffff, value >>> 16]
}

export function toNumber(value: U32): number {
  return value[1] * 2 ** 16 + value[0]
}

export const ZERO = fromNumber(0)
