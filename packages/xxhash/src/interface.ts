export interface XXHash<T> {
  /**
   * Resets the hasher state with an optional `seed`.
   *
   * @param seed Optional seed value. If a value is not provided, then it
   *             remains the one used the last time the hasher was either
   *             created or reset.
   */
  reset(seed?: number | T): void

  /**
   * Outputs the hexadecimal hash of the provided data.
   *
   * @param encoding Digest encoding. Only `hex` is supported at this time.
   */
  digest(encoding: 'hex'): string

  /**
   * Updates the hasher state with data from a string or buffer to hash.
   *
   * The hasher instance is returned for chaining other methods.
   *
   * @param input Data to hash.
   */
  update(input: string | ArrayBuffer): XXHash<T>
}
