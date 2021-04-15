import { flow } from '@pacote/pipe'
import { ofPromise } from '@pacote/result'
import { RequestBody, RequestInfo } from './request'
import { foldC } from './result'

export const body = (data: RequestBody) => (request: RequestInfo) => ({
  ...request,
  body: data,
})

const asyncMap = <T, U>(fn: (value: T) => Promise<U>) =>
  foldC(flow(fn, ofPromise), Promise.reject)

export const json = asyncMap<Response, unknown>((response) => response.json())

export const text = asyncMap<Response, string>((response) => response.text())
