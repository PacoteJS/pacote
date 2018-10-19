import { BaseError, ComplexError, inherits } from '@pacote/error'

export class StatusError<T> extends BaseError {
  constructor(
    public readonly status: number,
    message?: string,
    public readonly body?: T | string
  ) {
    super(message)
    inherits(this, StatusError)
  }
}

export class NetworkError extends ComplexError {
  constructor(
    message: string = '',
    causes: Error | BaseError | ReadonlyArray<Error | BaseError> = []
  ) {
    super(message, causes)
    inherits(this, NetworkError)
  }
}

export class ParserError extends ComplexError {
  constructor(
    message: string = '',
    causes: Error | BaseError | ReadonlyArray<Error | BaseError> = []
  ) {
    super(message, causes)
    inherits(this, ParserError)
  }
}

export type FetchError<T> = NetworkError | ParserError | StatusError<T>
