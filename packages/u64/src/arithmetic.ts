import { shiftLeft, shiftRight } from './bitwise'
import { equals, greaterThan, lessThan } from './comparison'
import { type U64, ZERO, clamp, clampBlocks, overflow } from './u64'

/**
 * Adds two `U64` values. Equivalent to the numeric `+` operator.
 *
 * @param augend - Augend.
 * @param addend - Addend.
 *
 * @returns The sum of both values.
 *
 * @category Arithmetic
 */
export function add(augend: U64, addend: U64): U64 {
  const r0 = augend[0] + addend[0]
  const r1 = overflow(r0) + augend[1] + addend[1]
  const r2 = overflow(r1) + augend[2] + addend[2]
  const r3 = overflow(r2) + augend[3] + addend[3]

  return clampBlocks([r0, r1, r2, r3])
}

/**
 * Negates the supplied `U64` value. Equivalent to the numeric unary `-`
 * operator.
 *
 * @param value - Value to negate.
 *
 * @returns Negated value.
 *
 * @category Arithmetic
 */
export function negate(value: U64): U64 {
  const r0 = clamp(~value[0]) + 1
  const r1 = clamp(~value[1]) + overflow(r0)
  const r2 = clamp(~value[2]) + overflow(r1)
  const r3 = ~value[3] + overflow(r2)

  return clampBlocks([r0, r1, r2, r3])
}

/**
 * Subtracts two `U64` values. Equivalent to the numeric `-` operator.
 *
 * @param minuend     - Minuend.
 * @param subtrahend  - Subtrahend.
 *
 * @returns The total of the second value subtracted from the first.
 *
 * @category Arithmetic
 */
export function subtract(minuend: U64, subtrahend: U64): U64 {
  return add(minuend, negate(subtrahend))
}

/**
 * Multiplies two `U64` values. Equivalent to the numeric `*` operator.
 *
 * @param multiplier    - Multiplier.
 * @param multiplicand  - Multiplicand.
 *
 * @returns The product of the two values.
 *
 * @category Arithmetic
 */
export function multiply(multiplier: U64, multiplicand: U64): U64 {
  const r0 = multiplier[0] * multiplicand[0]

  let r1 = overflow(r0) + multiplier[0] * multiplicand[1]
  let r2 = overflow(r1)
  r1 = clamp(r1) + multiplier[1] * multiplicand[0]

  r2 = overflow(r1) + r2 + multiplier[0] * multiplicand[2]
  let r3 = overflow(r2)
  r2 = clamp(r2) + multiplier[1] * multiplicand[1]
  r3 = overflow(r2) + r3
  r2 = clamp(r2) + multiplier[2] * multiplicand[0]

  r3 = overflow(r2) + r3 + multiplier[0] * multiplicand[3]
  r3 = clamp(r3) + multiplier[1] * multiplicand[2]
  r3 = clamp(r3) + multiplier[2] * multiplicand[1]
  r3 = clamp(r3) + multiplier[3] * multiplicand[0]

  return clampBlocks([r0, r1, r2, r3])
}

/**
 * Divides two `U64` values. Since these are integers, this operation will round
 * towards zero (which is to say, it will not return any fractional digits).
 *
 * @param dividend  - Dividend.
 * @param divisor   - Divisor.
 *
 * @returns The first value divided by the second, rounded towards zero.
 *
 * @category Arithmetic
 */
export function divide(dividend: U64, divisor: U64): U64 {
  if (divisor[1] === 0 && divisor[2] === 0 && divisor[3] === 0) {
    if (divisor[0] === 0) throw Error('division by zero')

    if (divisor[0] === 1) {
      return dividend
    }
  }

  if (equals(dividend, divisor)) {
    return [1, 0, 0, 0]
  }

  if (greaterThan(divisor, dividend)) {
    return ZERO
  }

  let shiftedDivisor: U64 = divisor
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
      if (shifts >= 48) {
        result = [
          result[0],
          result[1],
          result[2],
          result[3] | (1 << (shifts - 48)),
        ]
      } else if (shifts >= 32) {
        result = [
          result[0],
          result[1],
          result[2] | (1 << (shifts - 32)),
          result[3],
        ]
      } else if (shifts >= 16) {
        result = [
          result[0],
          result[1] | (1 << (shifts - 16)),
          result[2],
          result[3],
        ]
      } else {
        result = [result[0] | (1 << shifts), result[1], result[2], result[3]]
      }
    }
  }

  return result
}

/**
 * The remainder of the division of two `U64` values. Equivalent to the
 * numeric `%` operator.
 *
 * @param dividend  - Dividend.
 * @param divisor   - Divisor.
 *
 * @returns The remainder of the division of the two values.
 *
 * @category Arithmetic
 */
export function remainder(dividend: U64, divisor: U64): U64 {
  if (divisor[1] === 0 && divisor[2] === 0 && divisor[3] === 0) {
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

  let shiftedDivisor: U64 = divisor
  let shifts = 0

  while (!lessThan(dividend, shiftedDivisor)) {
    shiftedDivisor = shiftLeft(shiftedDivisor, 1, true)
    shifts++
  }

  let result: U64 = dividend

  while (shifts-- > 0) {
    shiftedDivisor = shiftRight(shiftedDivisor, 1)

    if (!lessThan(result, shiftedDivisor)) {
      result = subtract(result, shiftedDivisor)
    }
  }

  return result
}
