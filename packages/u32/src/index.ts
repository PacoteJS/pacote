import { fromString } from './string'
import { fromNumber, type U32 } from './u32'

export { add, divide, multiply, remainder, subtract } from './arithmetic'
export {
  and,
  negate,
  or,
  rotateLeft,
  rotateRight,
  shiftLeft,
  shiftRight,
  xor,
} from './bitwise'
export { equals, greaterThan, lessThan } from './comparison'
export { toString } from './string'
export { toNumber, type U32, ZERO } from './u32'

export function from(value: number): U32
export function from(value: string, radix?: number): U32
export function from(value: string | number, radix = 10): U32 {
  if (typeof value === 'number') {
    return fromNumber(value)
  }

  return fromString(value, radix)
}
