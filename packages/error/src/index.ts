export class BaseError extends Error {
  constructor(public readonly message: string = '') {
    super(message)
    BaseError.imprint(this)
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
   */
  static imprint(instance: BaseError): void {
    instance.name = this.name

    if (Error.captureStackTrace) {
      Error.captureStackTrace(instance, this)
    }

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(instance, this.prototype)
    }
  }
}

export class ComplexError extends BaseError {
  public readonly causes: ReadonlyArray<Error | BaseError>

  constructor(message: string = '', causes: Error | ReadonlyArray<Error> = []) {
    super(message)
    ComplexError.imprint(this)
    this.causes = new Array().concat(causes)
  }
}
