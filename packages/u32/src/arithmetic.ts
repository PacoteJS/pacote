import { shiftLeft, shiftRight } from './bitwise'
import { equals, greaterThan, lessThan } from './comparison'
import { clamp, clampBlocks, overflow, U32, ZERO } from './u32'

export function add(augend: U32, addend: U32): U32 {
  const r0 = augend[0] + addend[0]
  const r1 = overflow(r0) + augend[1] + addend[1]

  return clampBlocks([r0, r1])
}

export function negate(value: U32): U32 {
  const r0 = clamp(~value[0]) + 1
  const r1 = clamp(~value[1]) + overflow(r0)

  return clampBlocks([r0, r1])
}

export function subtract(minuend: U32, subtrahend: U32): U32 {
  return add(minuend, negate(subtrahend))
}

export function multiply(multiplier: U32, multiplicand: U32): U32 {
  const r0 = multiplier[0] * multiplicand[0]

  let r1 = overflow(r0) + multiplier[0] * multiplicand[1]
  r1 = clamp(r1) + multiplier[1] * multiplicand[0]

  return clampBlocks([r0, r1])
}

export function divide(dividend: U32, divisor: U32): U32 {
  if (divisor[1] === 0) {
    if (divisor[0] === 0) throw Error('division by zero')

    if (divisor[0] === 1) {
      return dividend
    }
  }

  if (equals(dividend, divisor)) {
    return [1, 0]
  }

  if (greaterThan(divisor, dividend)) {
    return ZERO
  }

  let shiftedDivisor: U32 = divisor
  let shifts = 0

  while (!lessThan(dividend, shiftedDivisor)) {
    shiftedDivisor = shiftLeft(shiftedDivisor, 1, true)
    shifts++
  }

  let _remainder = dividend
  let result = ZERO

  while (shifts-- > 0) {
    shiftedDivisor = shiftRight(shiftedDivisor, 1)

    if (!lessThan(_remainder, shiftedDivisor)) {
      _remainder = subtract(_remainder, shiftedDivisor)
      if (shifts >= 16) {
        result = [result[0], result[1] | (1 << (shifts - 16))]
      } else {
        result = [result[0] | (1 << shifts), result[1]]
      }
    }
  }

  return result
}

export function remainder(dividend: U32, divisor: U32): U32 {
  if (divisor[1] === 0) {
    if (divisor[0] === 0) throw Error('division by zero')

    if (divisor[0] === 1) {
      return ZERO
    }
  }

  if (equals(dividend, divisor)) {
    return ZERO
  }

  if (greaterThan(divisor, dividend)) {
    return dividend
  }

  let shiftedDivisor: U32 = divisor
  let shifts = 0

  while (!lessThan(dividend, shiftedDivisor)) {
    shiftedDivisor = shiftLeft(shiftedDivisor, 1, true)
    shifts++
  }

  let result: U32 = dividend

  while (shifts-- > 0) {
    shiftedDivisor = shiftRight(shiftedDivisor, 1)

    if (!lessThan(result, shiftedDivisor)) {
      result = subtract(result, shiftedDivisor)
    }
  }

  return result
}
