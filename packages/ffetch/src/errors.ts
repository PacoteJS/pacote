enum ErrorTypes {
  ConnectionError = 'ConnectionError',
  StatusError = 'StatusError',
  ParserError = 'ParserError'
}

class BaseError {
  constructor(public message: string) {}
}

export class ConnectionError extends BaseError {
  public readonly type = ErrorTypes.ConnectionError
  constructor(message: string) {
    super(message)
  }
}

export class StatusError<T> extends BaseError {
  public readonly type = ErrorTypes.StatusError
  constructor(
    message: string,
    public status: number,
    public body?: T | string | null
  ) {
    super(message)
  }
}

export class ParserError extends BaseError {
  public readonly type = ErrorTypes.ParserError
  constructor(message: string) {
    super(message)
  }
}

export type FetchError<T> = ConnectionError | ParserError | StatusError<T>
