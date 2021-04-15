import { ofNullable, Option } from '@pacote/option'
import { RequestInfo } from './request'
import { mapC } from './result'

const requestHeader = (name: string, value: string) => ({
  headers,
  ...request
}: RequestInfo): RequestInfo => {
  return { ...request, headers: headers.concat([[name, value]]) }
}

const responseHeader = (name: string) =>
  mapC<Response, Error, Option<string>>(({ headers }) =>
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
