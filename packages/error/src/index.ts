export class BaseError extends Error {
  constructor(public readonly message: string = '') {
    super(message)
    BaseError.inherits(this)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
   */
  static inherits(instance: Error): void {
    instance.name = this.name

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(instance, this.prototype)
    }
  }
}

export class ComplexError extends BaseError {
  public readonly causes: ReadonlyArray<Error | BaseError>

  constructor(
    public readonly message: string = '',
    causes: Error | ReadonlyArray<Error> = []
  ) {
    super(message)
    ComplexError.inherits(this)
    this.causes = new Array().concat(causes)
  }
}
