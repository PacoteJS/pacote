import { fromNumber, U64 } from './u64'
import { fromString } from './string'

export { toNumber, U64, ZERO } from './u64'
export { xor, shiftLeft, shiftRight, rotateLeft } from './bitwise'
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

export function from(value: number): U64
export function from(value: string, radix?: number): U64
export function from(value: string | number, radix = 10): U64 {
  if (typeof value === 'number') {
    return fromNumber(value)
  } else {
    return fromString(value, radix)
  }
}
