import { test, expect } from 'vitest'
import { BaseError, ComplexError } from '../src'

test('BaseError is an instance of Error', () => {
  const error = new BaseError()
  expect(error).toBeInstanceOf(Error)
})

test('BaseError is an instance of BaseError', () => {
  const error = new BaseError()
  expect(error).toBeInstanceOf(BaseError)
})

test('BaseError is named BaseError', () => {
  const error = new BaseError()
  expect(error.name).toBe('BaseError')
})

test('BaseError records a stack', () => {
  const error = new BaseError()
  expect(error.stack).toBeTruthy()
})

test('BaseError has a message', () => {
  const message = 'Internal server error'
  const error = new BaseError(message)
  expect(error.message).toBe(message)
})

test('BaseError creation from string', () => {
  const message = 'Internal server error'
  const actual = BaseError.fromString(message)
  const expected = new BaseError(message)
  expect(actual).toEqual(expected)
})

test('BaseError creation from null string', () => {
  const actual = BaseError.fromString()
  const expected = new BaseError('')
  expect(actual).toEqual(expected)
})

test('ComplexError is an instance of Error', () => {
  const error = new ComplexError()
  expect(error).toBeInstanceOf(Error)
})

test('ComplexError is an instance of ComplexError', () => {
  const error = new ComplexError()
  expect(error).toBeInstanceOf(ComplexError)
})

test('ComplexError is named ComplexError', () => {
  const error = new ComplexError()
  expect(error.name).toBe('ComplexError')
})

test('ComplexError records a stack', () => {
  const error = new ComplexError()
  expect(error.stack).toBeTruthy()
})

test('ComplexError has a message', () => {
  const message = 'Internal server error'
  const error = new ComplexError(message)
  expect(error.message).toBe(message)
})

test('ComplexError creation from string', () => {
  const message = 'Internal server error'
  const actual = ComplexError.fromString(message)
  const expected = new ComplexError(message)
  expect(actual).toEqual(expected)
})

test('ComplexError creation from null string', () => {
  const actual = ComplexError.fromString()
  const expected = new ComplexError('')
  expect(actual).toEqual(expected)
})

test('ComplexError references originating errors', () => {
  const causes = [new Error('')]
  const error = new ComplexError('', causes)
  expect(error.causes).toEqual(causes)
})

test('ComplexError creation from errors', () => {
  const errors = [new Error('test')]
  const actual = ComplexError.fromErrors(errors)
  const expected = new ComplexError(undefined, errors)
  expect(actual).toEqual(expected)
  expect(actual.causes).toEqual(expected.causes)
})
