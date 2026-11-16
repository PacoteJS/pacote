import type { MatchersObject } from './shared/types.js'
import { toBeEither } from './toBeEither.js'
import { toBeLeft } from './toBeLeft.js'
import { toBeRight } from './toBeRight.js'
import { toEqualLeft } from './toEqualLeft.js'
import { toEqualRight } from './toEqualRight.js'
import { toMatchLeft } from './toMatchLeft.js'
import { toMatchRight } from './toMatchRight.js'

export { toBeEither } from './toBeEither.js'
export { toBeLeft } from './toBeLeft.js'
export { toBeRight } from './toBeRight.js'
export { toEqualLeft } from './toEqualLeft.js'
export { toEqualRight } from './toEqualRight.js'
export { toMatchLeft } from './toMatchLeft.js'
export { toMatchRight } from './toMatchRight.js'

/**
 * Collection of Jest matchers that assert on `Either` values.
 *
 * @returns Matchers ready to be passed into `expect.extend`.
 *
 * @example
 * ```typescript
 * import matchers from '@pacote/jest-either'
 *
 * expect.extend(matchers)
 * ```
 */
export default {
  toBeEither,
  toBeLeft,
  toBeRight,
  toEqualLeft,
  toEqualRight,
  toMatchLeft,
  toMatchRight,
} as MatchersObject
