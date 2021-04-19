import { assert, property, anything, func } from 'fast-check'
import { pipe } from '@pacote/pipe'
import * as O from '../src/index'

describe('isSome()', () => {
  test('returns false on None', () => {
    expect(O.isSome(O.None)).toBe(false)
  })

  test('returns true on Some', () => {
    expect(O.isSome(O.Some(0))).toBe(true)
  })
})

describe('isNone()', () => {
  test('returns true on None', () => {
    expect(O.isNone(O.None)).toBe(true)
  })

  test('returns false on Some', () => {
    expect(O.isNone(O.Some(1))).toBe(false)
  })
})

describe('ofNullable()', () => {
  test('creates None on null', () => {
    expect(O.ofNullable(null)).toEqual(O.None)
  })

  test('creates None on undefined', () => {
    expect(O.ofNullable(undefined)).toEqual(O.None)
  })

  test('returns Some(T) on non-null value', () => {
    expect(O.ofNullable('test')).toEqual(O.Some('test'))
  })
})

describe('tryCatch()', () => {
  test('creates None from thrown exceptions', () => {
    expect(
      O.tryCatch(() => {
        throw Error()
      })
    ).toEqual(O.None)
  })

  test('returns Some(T) from successfully executed functions', () => {
    expect(O.tryCatch(() => 'test')).toEqual(O.Some('test'))
  })
})

describe('contains()', () => {
  test('returns true if wrapped value is the same', () => {
    expect(pipe(O.Some('test'), O.contains('test'))).toBe(true)
  })

  test('returns false if wrapped value is not the same', () => {
    expect(pipe(O.Some('test'), O.contains('different'))).toBe(false)
  })

  test('returns false on None', () => {
    expect(pipe(O.None, O.contains('test'))).toBe(false)
  })
})

describe('flatten()', () => {
  test('returns O.Some(T) on O.Some(O.Some(T))', () => {
    expect(O.flatten(O.Some(O.Some(1)))).toEqual(O.Some(1))
  })

  test('returns None on None', () => {
    expect(O.flatten(O.None)).toEqual(O.None)
  })
})

describe('getOrElse()', () => {
  test('returns the wrapped value on Some', () => {
    expect(
      pipe(
        O.None,
        O.getOrElse(() => 'default')
      )
    ).toBe('default')
  })

  test('evaluates the function and returns its result on None', () => {
    expect(
      pipe(
        O.Some(1),
        O.getOrElse(() => 0)
      )
    ).toBe(1)
  })
})

describe('map()', () => {
  test('maps None to None', () => {
    expect(
      pipe(
        O.None,
        O.map((x: number) => x + 1)
      )
    ).toEqual(O.None)
  })

  test('maps Some using the provided function', () => {
    expect(
      pipe(
        O.Some(1),
        O.map((x: number) => x + 1)
      )
    ).toEqual(O.Some(2))
  })
})

describe('flatMap()', () => {
  test('binds None to None', () => {
    expect(
      pipe(
        O.None,
        O.flatMap((x: number) => O.Some(x + 1))
      )
    ).toEqual(O.None)
  })

  test('binds Some using the provided function', () => {
    expect(
      pipe(
        O.Some(1),
        O.flatMap((x) => O.Some(x + 1))
      )
    ).toEqual(O.Some(2))
  })
})

describe('filter()', () => {
  const isEven = (n: number) => n % 2 === 0

  test('returns option if predicate is true', () => {
    expect(pipe(O.Some(4), O.filter(isEven))).toEqual(O.Some(4))
  })

  test('returns None if predicate is true', () => {
    expect(pipe(O.Some(3), O.filter(isEven))).toEqual(O.None)
  })

  test('returns None if option is None', () => {
    expect(pipe(O.None, O.filter(isEven))).toEqual(O.None)
  })
})

describe('or()', () => {
  test('returns option if O.Some(T)', () => {
    expect(pipe(O.Some('option'), O.or(O.Some('alt')))).toEqual(
      O.Some('option')
    )
  })

  test('returns alternative if None', () => {
    expect(pipe(O.None, O.or(O.Some('alt')))).toEqual(O.Some('alt'))
  })
})

describe('and()', () => {
  test('returns alternative if O.Some(T)', () => {
    expect(pipe(O.Some('option'), O.and(O.Some('alt')))).toEqual(O.Some('alt'))
  })

  test('returns None if None', () => {
    expect(pipe(O.None, O.and(O.Some('alt')))).toEqual(O.None)
  })
})

describe('fold()', () => {
  test('applies mapping function to None', () => {
    expect(
      pipe(
        O.None,
        O.fold(
          (s: string) => s.length,
          () => 0
        )
      )
    ).toEqual(0)
  })

  test('applies mapping function to O.Some(T)', () => {
    expect(
      pipe(
        O.Some('test'),
        O.fold(
          (s) => s.length,
          () => 0
        )
      )
    ).toEqual(4)
  })
})

describe('monad laws', () => {
  test('left identity', () => {
    assert(
      property(func(anything()), anything(), (fn, value) => {
        expect(
          pipe(
            O.Some(value),
            O.flatMap((x) => O.Some(fn(x)))
          )
        ).toEqual(O.Some(fn(value)))
      })
    )
  })

  test('right identity', () => {
    assert(
      property(anything(), (value) => {
        expect(pipe(O.Some(value), O.flatMap(O.Some))).toEqual(O.Some(value))
      })
    )
  })

  test('associativity', () => {
    assert(
      property(
        func(anything()),
        func(anything()),
        anything(),
        (f, g, value) => {
          expect(
            pipe(
              O.Some(value),
              O.flatMap((x) => O.Some(f(x))),
              O.flatMap((x) => O.Some(g(x)))
            )
          ).toEqual(
            pipe(
              O.Some(value),
              O.flatMap((x) => O.Some(g(f(x))))
            )
          )
        }
      )
    )
  })
})
