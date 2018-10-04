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
  constructor(
    public readonly status: number,
    message?: string,
    public readonly body?: T | string
  ) {
    super(message)
  }
}

export class ConnectionError extends BaseError {}

export class ParserError extends BaseError {}

export type FetchError<T> = ConnectionError | ParserError | StatusError<T>
