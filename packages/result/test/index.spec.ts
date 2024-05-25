import * as O from '@pacote/option'
import { assert, anything, func, property } from 'fast-check'
import { describe, expect, test } from 'vitest'
import * as R from '../src/index'

describe('ofNullable()', () => {
  test('creates Err on null', () => {
    expect(R.ofNullable('error', null)).toEqual(R.Err('error'))
  })

  test('creates Err on undefined', () => {
    expect(R.ofNullable('error', undefined)).toEqual(R.Err('error'))
  })

  test('returns Ok(T) on non-null value', () => {
    expect(R.ofNullable('error', 'ok')).toEqual(R.Ok('ok'))
  })
})

describe('tryCatch()', () => {
  test('creates an Err() from thrown errors', () => {
    const error = Error('rejected')
    expect(
      R.tryCatch(() => {
        throw error
      }),
    ).toEqual(R.Err(error))
  })

  test('creates an Ok() from a return value', () => {
    const value = 'success'
    expect(R.tryCatch(() => value)).toEqual(R.Ok(value))
  })
})

describe('ofPromise()', () => {
  test('creates Err(E) for rejected promises', async () => {
    const error = Error('rejected')
    await expect(R.ofPromise(Promise.reject(error))).resolves.toEqual(
      R.Err(error),
    )
  })

  test('returns Ok(T) for resolved promises', async () => {
    const value = 'resolved'
    await expect(R.ofPromise(Promise.resolve(value))).resolves.toEqual(
      R.Ok(value),
    )
  })
})

describe('isOk()', () => {
  test('returns false on Err', () => {
    expect(R.isOk(R.Err('error'))).toBe(false)
  })

  test('returns true on Ok', () => {
    expect(R.isOk(R.Ok('ok'))).toBe(true)
  })
})

describe('isErr()', () => {
  test('returns true on Err', () => {
    expect(R.isErr(R.Err('error'))).toBe(true)
  })

  test('returns false on Ok', () => {
    expect(R.isErr(R.Ok('ok'))).toBe(false)
  })
})

describe('ok()', () => {
  test('returns None on Err', () => {
    expect(R.ok(R.Err('error'))).toEqual(O.None)
  })

  test('returns Some() on Ok', () => {
    expect(R.ok(R.Ok('ok'))).toEqual(O.Some('ok'))
  })
})

describe('err()', () => {
  test('returns Some() on Err', () => {
    expect(R.err(R.Err('error'))).toEqual(O.Some('error'))
  })

  test('returns None on Ok', () => {
    expect(R.err(R.Ok('ok'))).toEqual(O.None)
  })
})

describe('getOrElse()', () => {
  test('returns the wrapped value on Ok', () => {
    expect(R.getOrElse(() => 'default')(R.Ok('ok'))).toBe('ok')
  })

  test('evaluates the function and returns its result on Err', () => {
    expect(R.getOrElse((err) => `default: ${err}`)(R.Err('error'))).toBe(
      'default: error',
    )
  })
})

describe('map()', () => {
  test('leaves Err unchanged', () => {
    expect(R.map((s: string) => s.length, R.Err('error'))).toEqual(
      R.Err('error'),
    )
  })

  test('maps Ok result', () => {
    expect(R.map((s) => s.length, R.Ok('ok'))).toEqual(R.Ok(2))
  })
})

describe('mapErr()', () => {
  test('leaves Ok unchanged', () => {
    expect(R.mapErr((s: string) => s.length, R.Ok('ok'))).toEqual(R.Ok('ok'))
  })

  test('maps Err result', () => {
    expect(R.mapErr((s) => s.length, R.Err('error'))).toEqual(R.Err(5))
  })
})

describe('bimap()', () => {
  test('applies mapping function to Err(E)', () => {
    expect(
      R.bimap(
        () => 0,
        (e) => e + 1,
        R.Err(0),
      ),
    ).toEqual(R.Err(1))
  })

  test('applies mapping function to Ok(T)', () => {
    expect(
      R.bimap(
        (t) => t + 1,
        () => 0,
        R.Ok(1),
      ),
    ).toEqual(R.Ok(2))
  })
})

describe('flatMap()', () => {
  test('leaves Err unchanged', () => {
    expect(
      R.flatMap<string, string, number>((s) => R.Ok(s.length), R.Err('error')),
    ).toEqual(R.Err('error'))
  })

  test('chains Ok result', () => {
    expect(R.flatMap((s) => R.Ok(s.length), R.Ok('ok'))).toEqual(R.Ok(2))
  })
})

describe('flatten()', () => {
  test('returns Ok(T) on Ok(Ok(T))', () => {
    expect(R.flatten(R.Ok(R.Ok(1)))).toEqual(R.Ok(1))
  })

  test('returns Err on Err(E)', () => {
    expect(R.flatten(R.Err(0))).toEqual(R.Err(0))
  })

  test('returns Err on Ok(Err(E))', () => {
    expect(R.flatten(R.Ok(R.Err(0)))).toEqual(R.Err(0))
  })
})

describe('fold()', () => {
  test('applies mapping function to Err(E)', () => {
    expect(
      R.fold(
        (t) => `Ok(${t})`,
        (e) => `Err(${e})`,
        R.Err(0),
      ),
    ).toEqual('Err(0)')
  })

  test('applies mapping function to Ok(T)', () => {
    expect(
      R.fold(
        (t) => `Ok(${t})`,
        (e) => `Err(${e})`,
        R.Ok(1),
      ),
    ).toEqual('Ok(1)')
  })
})

describe('or()', () => {
  test('returns result if result is Ok', () => {
    expect(R.or(R.Ok(100), R.Ok(2))).toEqual(R.Ok(2))
    expect(R.or<number, string>(R.Err('late error'), R.Ok(2))).toEqual(R.Ok(2))
  })

  test('returns alternative if result is Err', () => {
    expect(R.or(R.Ok(2), R.Err('early error'))).toEqual(R.Ok(2))
    expect(R.or(R.Err('late error'), R.Err('early error'))).toEqual(
      R.Err('late error'),
    )
  })
})

describe('and()', () => {
  test('returns alternative if result is Ok', () => {
    expect(R.and(R.Ok('ok'), R.Ok(2))).toEqual(R.Ok('ok'))
    expect(R.and(R.Err('late error'), R.Ok(2))).toEqual(R.Err('late error'))
  })

  test('returns result if result is Err', () => {
    expect(R.and(R.Err('late error'), R.Err('early error'))).toEqual(
      R.Err('early error'),
    )
    expect(
      R.and<string, string, string>(R.Ok('ok'), R.Err('early error')),
    ).toEqual(R.Err('early error'))
  })
})

describe('monad laws', () => {
  test('left identity', () => {
    assert(
      property(func(anything()), anything(), (fn, value) => {
        expect(R.flatMap((x) => R.Ok(fn(x)), R.Ok(value))).toEqual(
          R.Ok(fn(value)),
        )
      }),
    )
  })

  test('right identity', () => {
    assert(
      property(anything(), (value) => {
        expect(R.flatMap(R.Ok, R.Ok(value))).toEqual(R.Ok(value))
      }),
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
            R.flatMap(
              (x) => R.Ok(g(x)),
              R.flatMap((x) => R.Ok(f(x)), R.Ok(value)),
            ),
          ).toEqual(R.flatMap((x) => R.Ok(g(f(x))), R.Ok(value)))
        },
      ),
    )
  })
})
