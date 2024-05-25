import { fromString } from './string'
import { type U64, fromNumber } from './u64'

export { toNumber, U64, ZERO } from './u64'
export {
  and,
  or,
  xor,
  shiftLeft,
  shiftRight,
  rotateLeft,
  rotateRight,
} from './bitwise'
export { equals, greaterThan, lessThan } from './comparison'
export {
  add,
  subtract,
  multiply,
  divide,
  remainder,
  negate,
} from './arithmetic'
export { toString } from './string'

/**
 * Creates a new `U64` from a number.
 *
 * @param value - Number to convert.
 *
 * @category Creation
 */
export function from(value: number): U64
/**
 * Creates a new `U64` from a numeric string in any base.
 *
 * @param value   - Numerical string to convert.
 * @param [radix] - Base radix, defaults to `10`.
 *
 * @category Creation
 */
export function from(value: string, radix?: number): U64
export function from(value: string | number, radix = 10): U64 {
  if (typeof value === 'number') {
    return fromNumber(value)
  }
  return fromString(value, radix)
}
