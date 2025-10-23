import { toBeEither } from './toBeEither'
import { toBeLeft } from './toBeLeft'
import { toBeRight } from './toBeRight'
import { toEqualLeft } from './toEqualLeft'
import { toEqualRight } from './toEqualRight'
import { toMatchLeft } from './toMatchLeft'
import { toMatchRight } from './toMatchRight'
import type { MatchersObject } from './shared/types'

const matchers = {
  toBeEither,
  toBeLeft,
  toBeRight,
  toEqualLeft,
  toEqualRight,
  toMatchLeft,
  toMatchRight,
}

export default matchers as MatchersObject
