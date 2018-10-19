import { StatusError, ParserError, NetworkError } from '../src/errors'

describe('StatusError', () => {
  const status = 500

  it('is an instance of Error', () => {
    const error = new StatusError(status)
    expect(error).toBeInstanceOf(Error)
  })

  it('is an instance of StatusError', () => {
    const error = new StatusError(status)
    expect(error).toBeInstanceOf(StatusError)
  })

  it('records a stack', () => {
    const error = new StatusError(status)
    expect(error.stack).toBeTruthy()
  })

  it('has the response status code', () => {
    const error = new StatusError(status)
    expect(error.status).toBe(status)
  })

  it('has a message', () => {
    const message = 'Internal server error'
    const error = new StatusError(status, message)
    expect(error.message).toBe(message)
  })

  it('has a response body', () => {
    const body = {
      content: 'parsed'
    }
    const error = new StatusError<{}>(status, '', body)
    expect(error.body).toEqual(body)
  })
})

describe('NetworkError', () => {
  it('is an instance of Error', () => {
    const error = new NetworkError()
    expect(error).toBeInstanceOf(Error)
  })

  it('is an instance of NetworkError', () => {
    const error = new NetworkError()
    expect(error).toBeInstanceOf(NetworkError)
  })

  it('records a stack', () => {
    const error = new NetworkError()
    expect(error.stack).toBeTruthy()
  })

  it('has a message', () => {
    const message = 'test error'
    const error = new NetworkError(message)
    expect(error.message).toBe(message)
  })

  it('references originating errors', () => {
    const cause = new Error('')
    const error = new NetworkError('', [cause])
    expect(error.causes).toEqual([cause])
  })
})

describe('ParserError', () => {
  it('is an instance of Error', () => {
    const error = new ParserError()
    expect(error).toBeInstanceOf(Error)
  })

  it('is an instance of ParserError', () => {
    const error = new ParserError()
    expect(error).toBeInstanceOf(ParserError)
  })

  it('records a stack', () => {
    const error = new ParserError()
    expect(error.stack).toBeTruthy()
  })

  it('has a message', () => {
    const message = 'test error'
    const error = new NetworkError(message)
    expect(error.message).toBe(message)
  })

  it('references originating errors', () => {
    const cause = new Error('')
    const error = new ParserError('', [cause])
    expect(error.causes).toEqual([cause])
  })
})
