export class BaseError extends Error {
  constructor(public readonly message: string = '') {
    super(message)
    BaseError.imprint(this)
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
   */
  public static imprint(instance: BaseError): void {
    instance.name = this.name

    if (Error.captureStackTrace) {
      Error.captureStackTrace(instance, this.constructor)
    }

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(instance, this.prototype)
    }
  }

  public static fromString(message = '') {
    return new this(message)
  }
}

export class ComplexError extends BaseError {
  public readonly causes: ReadonlyArray<Error | BaseError>

  constructor(
    message = '',
    causes: Error | BaseError | ReadonlyArray<Error | BaseError> = []
  ) {
    super(message)
    ComplexError.imprint(this)
    this.causes = new Array().concat(causes)
  }

  public static fromErrors(errors: ReadonlyArray<Error | BaseError>) {
    return new this(undefined, errors)
  }
}
