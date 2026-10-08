import { BaseError, ComplexError } from '@pacote/error'

type ErrorCauses = Error | BaseError | readonly (Error | BaseError)[]

export class StatusError<T> extends BaseError {
  public readonly status: number

  public readonly body: T | string | undefined

  /**
   * Creates an HTTP status error with an optional response body.
   * @param status - HTTP status code.
   * @param message - Optional error message.
   * @param body - Optional response body.
   * @returns The new status error.
   */
  public constructor(status: number, message?: string, body?: T | string) {
    super(message)
    this.status = status
    this.body = body
    StatusError.imprint(this)
  }
}

export class NetworkError extends ComplexError {
  /**
   * Creates an error for a failed network request.
   * @param message - Error message; defaults to an empty string.
   * @param causes - Underlying errors; defaults to an empty list.
   * @returns The new network error.
   */
  public constructor(message = '', causes: ErrorCauses = []) {
    super(message, causes)
    NetworkError.imprint(this)
  }
}

export class ParserError extends ComplexError {
  /**
   * Creates an error raised while parsing a response.
   * @param message - Error message; defaults to an empty string.
   * @param causes - Underlying errors; defaults to an empty list.
   * @returns The new parser error.
   */
  public constructor(message = '', causes: ErrorCauses = []) {
    super(message, causes)
    ParserError.imprint(this)
  }
}

export type FetchError<T> = NetworkError | ParserError | StatusError<T>
