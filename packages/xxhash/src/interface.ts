export interface XXHash<T> {
  reset(seed?: number | T): void
  digest(encoding: 'hex'): string
  update(input: string | ArrayBuffer): XXHash<T>
}
