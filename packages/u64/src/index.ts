import { fromString } from './string'
import { fromNumber, type U64 } from './u64'

export {
  add,
  divide,
  multiply,
  negate,
  remainder,
  subtract,
} from './arithmetic'
export {
  and,
  or,
  rotateLeft,
  rotateRight,
  shiftLeft,
  shiftRight,
  xor,
} from './bitwise'
export { equals, greaterThan, lessThan } from './comparison'
export { toString } from './string'
export { toNumber, type U64, ZERO } from './u64'

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
