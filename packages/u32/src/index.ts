import { fromNumber, U32 } from './u32'
import { fromString } from './string'

export { toNumber, U32, ZERO } from './u32'
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

export function from(value: number): U32
export function from(value: string, radix?: number): U32
export function from(value: string | number, radix = 10): U32 {
  if (typeof value === 'number') {
    return fromNumber(value)
  } else {
    return fromString(value, radix)
  }
}
