import { BaseError, ComplexError } from '@pacote/error'

type ErrorCauses = Error | BaseError | readonly (Error | BaseError)[]

export class StatusError<T> extends BaseError {
  public readonly status: number

  public readonly body?: T | string

  public constructor(status: number, message?: string, body?: T | string) {
    super(message)
    this.status = status
    this.body = body
    StatusError.imprint(this)
  }
}

export class NetworkError extends ComplexError {
  public constructor(message = '', causes: ErrorCauses = []) {
    super(message, causes)
    NetworkError.imprint(this)
  }
}

export class ParserError extends ComplexError {
  public constructor(message = '', causes: ErrorCauses = []) {
    super(message, causes)
    ParserError.imprint(this)
  }
}

export type FetchError<T> = NetworkError | ParserError | StatusError<T>
