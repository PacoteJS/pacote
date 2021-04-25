import { ofNullable, Option } from '@pacote/option'
import { map } from '@pacote/result'
import { RequestInfo } from './request'

const requestHeader = (name: string, value: string) => ({
  headers,
  ...request
}: RequestInfo): RequestInfo => {
  return { ...request, headers: headers.concat([[name, value]]) }
}

const responseHeader = (name: string) =>
  map<Response, Error, Option<string>>(({ headers }) =>
    ofNullable(headers.get(name))
  )

export function header(name: string): ReturnType<typeof responseHeader>
export function header(
  name: string,
  value: string
): ReturnType<typeof requestHeader>
export function header(
  name: string,
  value?: string
): ReturnType<typeof responseHeader | typeof requestHeader> {
  return value !== undefined ? requestHeader(name, value) : responseHeader(name)
}
