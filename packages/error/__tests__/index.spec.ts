import { BaseError, ComplexError } from '../src/index'

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

test('ComplexError references originating errors', () => {
  const causes = [new Error('')]
  const error = new ComplexError('', causes)
  expect(error.causes).toEqual(causes)
})
