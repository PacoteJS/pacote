/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export function inherits(instance: Error, customClass: Function): void {
  instance.name = customClass.name

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(instance, customClass.prototype)
  }

  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, instance.constructor)
  }
}

export class BaseError extends Error {
  constructor(public readonly message: string = '') {
    super(message)
    inherits(this, BaseError)
  }
}

export class ComplexError extends BaseError {
  public readonly causes: ReadonlyArray<Error | BaseError>

  constructor(
    public readonly message: string = '',
    causes: Error | ReadonlyArray<Error> = []
  ) {
    super(message)
    inherits(this, ComplexError)
    this.causes = new Array().concat(causes)
  }
}
