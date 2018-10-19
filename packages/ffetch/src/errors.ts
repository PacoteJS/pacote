// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

function inherits(instance: Object, fromClass: Function): void {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(instance, fromClass.prototype)
  }
}

function captureStackTrace(instance: Object): void {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, instance.constructor)
  }
}

class BaseError extends Error {
  public name = 'BaseError'

  constructor(public readonly message: string = '') {
    super(message)

    inherits(this, BaseError)
    captureStackTrace(this)
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

    inherits(this, ComplexError)
    captureStackTrace(this)
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

    inherits(this, StatusError)
    captureStackTrace(this)
  }
}

export class NetworkError extends ComplexError {
  public name = 'NetworkError'

  constructor(
    message: string = '',
    causes: Error | BaseError | ReadonlyArray<Error | BaseError> = []
  ) {
    super(message, causes)

    inherits(this, NetworkError)
    captureStackTrace(this)
  }
}

export class ParserError extends ComplexError {
  public name = 'ParserError'

  constructor(
    message: string = '',
    causes: Error | BaseError | ReadonlyArray<Error | BaseError> = []
  ) {
    super(message, causes)

    inherits(this, ParserError)
    captureStackTrace(this)
  }
}

export type FetchError<T> = NetworkError | ParserError | StatusError<T>
