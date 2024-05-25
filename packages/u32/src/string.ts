import { type U32, toNumber } from './u32'

export function fromString(value: string, radix: number): U32 {
  const result = Number.parseInt(value, radix)
  return [result & 0xffff, result >>> 16]
}

const PADDING: Record<number, number | undefined> = {
  2: 32,
  16: 8,
}

export function toString(value: U32, radix = 10): string {
  return toNumber(value)
    .toString(radix)
    .padStart(PADDING[radix] ?? 0, '0')
}
