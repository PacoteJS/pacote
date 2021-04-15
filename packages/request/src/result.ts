import { Result, map, fold } from '@pacote/result'

export const mapC = <T, E, U>(fn: (value: T) => U) => (result: Result<T, E>) =>
  map(fn, result)

export const foldC = <T, E, R>(
  onOk: (value: T) => R,
  onErr: (value: E) => R
) => (result: Result<T, E>) => fold(onOk, onErr, result)
