import type { MatchersObject } from './shared/types'
import { toBeEither } from './toBeEither'
import { toBeLeft } from './toBeLeft'
import { toBeRight } from './toBeRight'
import { toEqualLeft } from './toEqualLeft'
import { toEqualRight } from './toEqualRight'
import { toMatchLeft } from './toMatchLeft'
import { toMatchRight } from './toMatchRight'

export { toBeEither } from './toBeEither'
export { toBeLeft } from './toBeLeft'
export { toBeRight } from './toBeRight'
export { toEqualLeft } from './toEqualLeft'
export { toEqualRight } from './toEqualRight'
export { toMatchLeft } from './toMatchLeft'
export { toMatchRight } from './toMatchRight'

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
