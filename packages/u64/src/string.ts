import { add, divide, multiply, remainder } from './arithmetic'
import { greaterThan } from './comparison'
import { fromNumber, toNumber, U64, ZERO } from './u64'

const MAX_CHUNK_SIZE = 5

export function fromString(value: string, radix: number): U64 {
  const length = value.length
  let result = ZERO

  for (let i = 0; i < length; i += MAX_CHUNK_SIZE) {
    const size = Math.min(MAX_CHUNK_SIZE, length - i)
    const factor = fromNumber(Math.pow(radix, Math.min(size, MAX_CHUNK_SIZE)))
    const chunk = fromNumber(parseInt(value.slice(i, i + size), radix))
    result = add(chunk, multiply(result, factor))
  }

  return result
}

const PADDING: Record<number, number | undefined> = {
  2: 64,
  16: 16,
}

export function toString(value: U64, radix = 10): string {
  const _radix = fromNumber(radix)

  if (!greaterThan(value, _radix)) {
    return toNumber(value).toString(radix)
  }

  const res = Array(64).fill('')

  let i = 63
  let _value = value

  while (i >= 0) {
    res[i] = toNumber(remainder(_value, _radix)).toString(radix)
    _value = divide(_value, _radix)
    if (!greaterThan(_value, _radix)) {
      res[i - 1] = toNumber(_value).toString(radix)
      break
    }
    i--
  }

  return res.join('').padStart(PADDING[radix] ?? 0, '0')
}
