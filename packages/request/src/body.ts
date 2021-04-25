import { flow } from '@pacote/pipe'
import { fold, ofPromise } from '@pacote/result'
import { RequestBody, RequestInfo } from './request'

export const body = (data: RequestBody) => (request: RequestInfo) => ({
  ...request,
  body: data,
})

const asyncMap = <T, U>(fn: (value: T) => Promise<U>) =>
  fold(flow(fn, ofPromise), Promise.reject)

export const json = asyncMap<Response, unknown>((response) => response.json())

export const text = asyncMap<Response, string>((response) => response.text())
