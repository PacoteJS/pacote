class BaseError {
  public readonly causes: Error | BaseError | ReadonlyArray<Error | BaseError>

  constructor(
    public readonly message?: string,
    causes: Error | BaseError | ReadonlyArray<Error | BaseError> = []
  ) {
    this.causes = new Array().concat(causes)
  }
}

export class StatusError<T> extends BaseError {
  public readonly name = 'StatusError'

  constructor(
    public readonly status: number,
    message?: string,
    public readonly body?: T | string | null
  ) {
    super(message)
  }
}

export class ConnectionError extends BaseError {
  public readonly name = 'ConnectionError'
}

export class ParserError extends BaseError {
  public readonly name = 'ParserError'
}

export type FetchError<T> = ConnectionError | ParserError | StatusError<T>
