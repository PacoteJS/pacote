export class BaseError extends Error {
  public override readonly message: string

  public constructor(message = '') {
    super(message)
    this.message = message
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

  public static fromString(message?: string): BaseError {
    return new this(message)
  }
}

export class ComplexError extends BaseError {
  public readonly causes: readonly (Error | BaseError)[]

  public constructor(
    message = '',
    causes: Error | BaseError | readonly (Error | BaseError)[] = []
  ) {
    super(message)
    ComplexError.imprint(this)
    this.causes = Array<Error | BaseError>().concat(causes)
  }

  public static fromErrors(
    errors: readonly (Error | BaseError)[]
  ): ComplexError {
    return new this(undefined, errors)
  }
}
