/**
 * Base class for custom errors with repaired subclass prototypes and names.
 *
 * Call `imprint` in subclass constructors on runtimes where extending native
 * `Error` does not preserve the expected prototype chain.
 * @example
 * ```typescript
 * import { BaseError } from '@pacote/error'
 *
 * class StatusError extends BaseError {
 *   constructor(public readonly status: number, message?: string) {
 *     super(message)
 *     StatusError.imprint(this)
 *   }
 * }
 *
 * const error = new StatusError(404, 'Not found')
 * error instanceof StatusError // => true
 * error.name // => 'StatusError'
 * ```
 */
export class BaseError extends Error {
  public override readonly message: string

  /**
   * Creates an error with the provided message.
   * @param message - Error message; defaults to an empty string.
   * @returns The new error instance.
   */
  public constructor(message = '') {
    super(message)
    this.message = message
    BaseError.imprint(this)
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
   */
  /**
   * Repairs an error instance's name, stack trace, and prototype chain.
   * @param instance - Error instance to repair.
   */
  public static imprint(instance: BaseError): void {
    type ConstructorLike = (...args: unknown[]) => unknown

    const captureStackTrace = (
      Error as ErrorConstructor & {
        captureStackTrace?: (
          target: object,
          constructorOpt?: ConstructorLike,
        ) => void
      }
    ).captureStackTrace

    // biome-ignore lint/complexity/noThisInStatic: imprint class name
    instance.name = this.name

    if (captureStackTrace) {
      // biome-ignore lint/complexity/noThisInStatic: imprint stack trace
      captureStackTrace(instance, this.constructor as ConstructorLike)
    }

    if (Object.setPrototypeOf) {
      // biome-ignore lint/complexity/noThisInStatic: imprint class prototype
      Object.setPrototypeOf(instance, this.prototype)
    }
  }

  /**
   * Creates an instance from an optional message string.
   * @param message - Error message; defaults to an empty string.
   * @returns A new `BaseError` instance.
   */
  public static fromString(message?: string): BaseError {
    return new this(message)
  }
}

/**
 * Error that groups several underlying errors under one message.
 *
 * @example
 * ```typescript
 * import { ComplexError } from '@pacote/error'
 *
 * try {
 *   throw new ComplexError('Validation failed', [
 *     new Error('Name is required'),
 *     new Error('Email is invalid'),
 *   ])
 * } catch (error) {
 *   if (error instanceof ComplexError) {
 *     console.error(error.message)
 *     for (const cause of error.causes) console.error(cause.message)
 *   }
 * }
 * ```
 */
export class ComplexError extends BaseError {
  public readonly causes: readonly (Error | BaseError)[]

  /**
   * Creates a complex error from one cause or a list of causes.
   * @param message - Error message; defaults to an empty string.
   * @param causes - One cause or a list of causes; defaults to an empty list.
   * @returns The new `ComplexError` instance.
   */
  public constructor(
    message = '',
    causes: Error | BaseError | readonly (Error | BaseError)[] = [],
  ) {
    super(message)
    ComplexError.imprint(this)
    this.causes = ([] as ReadonlyArray<Error | BaseError>).concat(causes)
  }

  /**
   * Creates a complex error from a list of errors.
   * @param errors - Errors to include as causes.
   * @returns A `ComplexError` containing the provided causes.
   */
  public static fromErrors(
    errors: readonly (Error | BaseError)[],
  ): ComplexError {
    return new this(undefined, errors)
  }
}
