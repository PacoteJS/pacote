import { StatusError, ParserError, NetworkError } from '../src/errors'

describe('StatusError', () => {
  it('is instance of Error', () => {
    const error = new StatusError(500, 'Internal server error')
    expect(error).toBeInstanceOf(Error)
  })

  it('is instance of StatusError', () => {
    const error = new StatusError(500, 'Internal server error')
    expect(error).toBeInstanceOf(StatusError)
  })

  it('records a stack', () => {
    const error = new StatusError(500, 'Internal server error')
    expect(error.stack).toBeTruthy()
  })

  it('holds the response status code', () => {
    const error = new StatusError(500, 'Internal server error')
    expect(error.status).toBe(500)
  })

  it('holds the response body', () => {
    const body = {
      content: 'parsed'
    }
    const error = new StatusError<{}>(500, 'Internal server error', body)
    expect(error.body).toEqual(body)
  })
})

describe('NetworkError', () => {
  it('is instance of Error', () => {
    const error = new NetworkError()
    expect(error).toBeInstanceOf(Error)
  })

  it('is instance of NetworkError', () => {
    const error = new NetworkError()
    expect(error).toBeInstanceOf(NetworkError)
  })

  it('records a stack', () => {
    const error = new NetworkError()
    expect(error.stack).toBeTruthy()
  })

  it('holds the response status code', () => {
    const message = 'test error'
    const error = new NetworkError(message)
    expect(error.message).toBe(message)
  })

  it('holds any causing errors', () => {
    const cause = new Error('cause error')
    const error = new NetworkError('test error', [cause])
    expect(error.causes).toEqual([cause])
  })
})

describe('ParserError', () => {
  it('is instance of Error', () => {
    const error = new ParserError()
    expect(error).toBeInstanceOf(Error)
  })

  it('is instance of ParserError', () => {
    const error = new ParserError()
    expect(error).toBeInstanceOf(ParserError)
  })

  it('records a stack', () => {
    const error = new ParserError()
    expect(error.stack).toBeTruthy()
  })

  it('holds the response status code', () => {
    const message = 'test error'
    const error = new ParserError(message)
    expect(error.message).toBe(message)
  })

  it('holds any causing errors', () => {
    const cause = new Error('cause error')
    const error = new ParserError('test error', [cause])
    expect(error.causes).toEqual([cause])
  })
})
