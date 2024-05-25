import { fromString } from './string'
import { type U32, fromNumber } from './u32'

export { toNumber, U32, ZERO } from './u32'
export {
  and,
  or,
  xor,
  negate,
  shiftLeft,
  shiftRight,
  rotateLeft,
  rotateRight,
} from './bitwise'
export { equals, greaterThan, lessThan } from './comparison'
export { add, subtract, multiply, divide, remainder } from './arithmetic'
export { toString } from './string'

export function from(value: number): U32
export function from(value: string, radix?: number): U32
export function from(value: string | number, radix = 10): U32 {
  if (typeof value === 'number') {
    return fromNumber(value)
  }

  return fromString(value, radix)
}
