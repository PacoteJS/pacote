// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

class BaseError extends Error {
  public name = 'BaseError'

  constructor(public readonly message: string = '') {
    super(message)

    Object.setPrototypeOf(this, BaseError.prototype)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

class ComplexError extends BaseError {
  public name = 'ComplexError'
  public readonly causes: ReadonlyArray<Error | BaseError>

  constructor(
    public readonly message: string = '',
    causes: Error | ReadonlyArray<Error> = []
  ) {
    super(message)
    this.causes = new Array().concat(causes)
  }
}

export class StatusError<T> extends BaseError {
  public name = 'StatusError'

  constructor(
    public readonly status: number,
    message?: string,
    public readonly body?: T | string
  ) {
    super(message)

    Object.setPrototypeOf(this, StatusError.prototype)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class NetworkError extends ComplexError {
  public name = 'NetworkError'

  constructor(
    message: string = '',
    causes: Error | BaseError | ReadonlyArray<Error | BaseError> = []
  ) {
    super(message, causes)

    Object.setPrototypeOf(this, NetworkError.prototype)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class ParserError extends ComplexError {
  public name = 'ParserError'

  constructor(
    message: string = '',
    causes: Error | BaseError | ReadonlyArray<Error | BaseError> = []
  ) {
    super(message, causes)

    Object.setPrototypeOf(this, ParserError.prototype)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export type FetchError<T> = NetworkError | ParserError | StatusError<T>
