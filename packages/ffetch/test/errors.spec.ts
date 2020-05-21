import { StatusError, ParserError, NetworkError } from '../src/errors'

const status = 500

test('StatusError is an instance of Error', () => {
  const error = new StatusError(status)
  expect(error).toBeInstanceOf(Error)
})

test('StatusError is an instance of StatusError', () => {
  const error = new StatusError(status)
  expect(error).toBeInstanceOf(StatusError)
})

test('StatusError is named StatusError', () => {
  const error = new StatusError(status)
  expect(error.name).toBe('StatusError')
})

test('StatusError records a stack', () => {
  const error = new StatusError(status)
  expect(error.stack).toBeTruthy()
})

test('StatusError has the response status code', () => {
  const error = new StatusError(status)
  expect(error.status).toBe(status)
})

test('StatusError has a message', () => {
  const message = 'Internal server error'
  const error = new StatusError(status, message)
  expect(error.message).toBe(message)
})

test('StatusError has a response body', () => {
  const body = { content: 'parsed' }
  const error = new StatusError(status, '', body)
  expect(error.body).toEqual(body)
})

test('NetworkError is an instance of Error', () => {
  const error = new NetworkError()
  expect(error).toBeInstanceOf(Error)
})

test('NetworkError is an instance of NetworkError', () => {
  const error = new NetworkError()
  expect(error).toBeInstanceOf(NetworkError)
})

test('NetworkError is named NetworkError', () => {
  const error = new NetworkError()
  expect(error.name).toBe('NetworkError')
})

test('NetworkError records a stack', () => {
  const error = new NetworkError()
  expect(error.stack).toBeTruthy()
})

test('NetworkError has a message', () => {
  const message = 'test error'
  const error = new NetworkError(message)
  expect(error.message).toBe(message)
})

test('NetworkError references originating error', () => {
  const cause = new Error('')
  const error = new NetworkError('', cause)
  expect(error.causes).toEqual([cause])
})

test('NetworkError references originating errors', () => {
  const causes = [new Error('')]
  const error = new NetworkError('', causes)
  expect(error.causes).toEqual(causes)
})

test('ParserError is an instance of Error', () => {
  const error = new ParserError()
  expect(error).toBeInstanceOf(Error)
})

test('ParserError is an instance of ParserError', () => {
  const error = new ParserError()
  expect(error).toBeInstanceOf(ParserError)
})

test('ParserError is named ParserError', () => {
  const error = new ParserError()
  expect(error.name).toBe('ParserError')
})

test('ParserError records a stack', () => {
  const error = new ParserError()
  expect(error.stack).toBeTruthy()
})

test('ParserError has a message', () => {
  const message = 'test error'
  const error = new NetworkError(message)
  expect(error.message).toBe(message)
})

test('ParserError references originating error', () => {
  const cause = new Error('')
  const error = new ParserError('', cause)
  expect(error.causes).toEqual([cause])
})

test('ParserError references originating errors', () => {
  const causes = [new Error('')]
  const error = new ParserError('', causes)
  expect(error.causes).toEqual(causes)
})
