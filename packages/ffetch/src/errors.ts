import { BaseError, ComplexError } from '@pacote/error'

export class StatusError<T> extends BaseError {
  constructor(
    public readonly status: number,
    message?: string,
    public readonly body?: T | string
  ) {
    super(message)
    StatusError.inherits(this)
  }
}

export class NetworkError extends ComplexError {
  constructor(
    message: string = '',
    causes: Error | BaseError | ReadonlyArray<Error | BaseError> = []
  ) {
    super(message, causes)
    NetworkError.inherits(this)
  }
}

export class ParserError extends ComplexError {
  constructor(
    message: string = '',
    causes: Error | BaseError | ReadonlyArray<Error | BaseError> = []
  ) {
    super(message, causes)
    ParserError.inherits(this)
  }
}

export type FetchError<T> = NetworkError | ParserError | StatusError<T>
