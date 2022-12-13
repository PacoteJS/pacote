import { assert, property, anything, func } from 'fast-check'
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
    expect(O.contains('test', O.Some('test'))).toBe(true)
  })

  test('returns false if wrapped value is not the same', () => {
    expect(O.contains('different', O.Some('test'))).toBe(false)
  })

  test('returns false on None', () => {
    expect(O.contains('test', O.None)).toBe(false)
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
    expect(O.getOrElse(() => 'default', O.None)).toBe('default')
  })

  test('evaluates the function and returns its result on None', () => {
    expect(O.getOrElse(() => 0, O.Some(1))).toBe(1)
  })
})

describe('map()', () => {
  test('maps None to None', () => {
    expect(O.map((x: number) => x + 1, O.None)).toEqual(O.None)
  })

  test('maps Some using the provided function', () => {
    expect(O.map((x: number) => x + 1, O.Some(1))).toEqual(O.Some(2))
  })
})

describe('flatMap()', () => {
  test('binds None to None', () => {
    expect(O.flatMap((x: number) => O.Some(x + 1), O.None)).toEqual(O.None)
  })

  test('binds Some using the provided function', () => {
    expect(O.flatMap((x) => O.Some(x + 1), O.Some(1))).toEqual(O.Some(2))
  })
})

describe('filter()', () => {
  const isEven = (n: number) => n % 2 === 0

  test('returns option if predicate is true', () => {
    expect(O.filter(isEven, O.Some(4))).toEqual(O.Some(4))
  })

  test('returns None if predicate is true', () => {
    expect(O.filter(isEven, O.Some(3))).toEqual(O.None)
  })

  test('returns None if option is None', () => {
    expect(O.filter(isEven, O.None)).toEqual(O.None)
  })
})

describe('or()', () => {
  test('returns option if O.Some(T)', () => {
    expect(O.or(O.Some('alt'), O.Some('option'))).toEqual(O.Some('option'))
  })

  test('returns alternative if None', () => {
    expect(O.or(O.Some('alt'), O.None)).toEqual(O.Some('alt'))
  })
})

describe('and()', () => {
  test('returns alternative if O.Some(T)', () => {
    expect(O.and(O.Some('alt'), O.Some('option'))).toEqual(O.Some('alt'))
  })

  test('returns None if None', () => {
    expect(O.and(O.Some('alt'), O.None)).toEqual(O.None)
  })
})

describe('fold()', () => {
  test('applies mapping function to None', () => {
    expect(
      O.fold(
        (s: string) => s.length,
        () => 0,
        O.None
      )
    ).toEqual(0)
  })

  test('applies mapping function to O.Some(T)', () => {
    expect(
      O.fold(
        (s) => s.length,
        () => 0,
        O.Some('test')
      )
    ).toEqual(4)
  })
})

describe('monad laws', () => {
  test('left identity', () => {
    assert(
      property(func(anything()), anything(), (fn, value) => {
        expect(O.flatMap((x) => O.Some(fn(x)), O.Some(value))).toEqual(
          O.Some(fn(value))
        )
      })
    )
  })

  test('right identity', () => {
    assert(
      property(anything(), (value) => {
        expect(O.flatMap(O.Some, O.Some(value))).toEqual(O.Some(value))
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
            O.flatMap(
              (x) => O.Some(g(x)),
              O.flatMap((x) => O.Some(f(x)), O.Some(value))
            )
          ).toEqual(O.flatMap((x) => O.Some(g(f(x))), O.Some(value)))
        }
      )
    )
  })
})
