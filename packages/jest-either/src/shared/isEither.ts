import type { Either } from 'fp-ts/lib/Either'

interface TaggedValue {
  _tag?: unknown
}

export function isEither(value: unknown): value is Either<unknown, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const { _tag } = value as TaggedValue

  return _tag === 'Left' || _tag === 'Right'
}
