import { Err, Ok } from '@pacote/result'
import { validation, lift } from '../src/index'

test('lift() transforms Result functions into Validation functions', () => {
  const error = lift<number, string>(() => Err('test'))
  expect(error(0)).toEqual(Err(['test']))
})

describe('validation()', () => {
  const hasLetter = lift((value: string) =>
    value.match(/[a-z]/i) ? Ok(value) : Err('no letters')
  )

  const hasDigit = lift((value: string) =>
    value.match(/[0-9]/) ? Ok(value) : Err('no digits')
  )

  it('composes validators and returns a success when no checks fail', () => {
    const validate = validation(hasLetter, hasDigit)
    expect(validate('0a')).toEqual(Ok('0a'))
  })

  it('composes validators and returns an error for a failed first check', () => {
    const validate = validation(hasLetter, hasDigit)
    expect(validate('0')).toEqual(Err(['no letters']))
  })

  it('composes validators and returns an error for a failed second check', () => {
    const validate = validation(hasLetter, hasDigit)
    expect(validate('a')).toEqual(Err(['no digits']))
  })

  it('composes validators and returns an error for each failed check in order', () => {
    const validate = validation(hasLetter, hasDigit)
    expect(validate('')).toEqual(Err(['no letters', 'no digits']))
  })
})
