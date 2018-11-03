import { BaseError, ComplexError } from '@pacote/error'

export class StatusError<T> extends BaseError {
  constructor(
    public readonly status: number,
    message?: string,
    public readonly body?: T | string
  ) {
    super(message)
    StatusError.imprint(this)
  }
}

export class NetworkError extends ComplexError {
  constructor(
    message: string = '',
    causes: Error | BaseError | ReadonlyArray<Error | BaseError> = []
  ) {
    super(message, causes)
    NetworkError.imprint(this)
  }
}

export class ParserError extends ComplexError {
  constructor(
    message: string = '',
    causes: Error | BaseError | ReadonlyArray<Error | BaseError> = []
  ) {
    super(message, causes)
    ParserError.imprint(this)
  }
}

export type FetchError<T> = NetworkError | ParserError | StatusError<T>
