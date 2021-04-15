import { stringifyUrl } from 'query-string'
import { RequestInfo, Stringifiable } from './request'

export const query = (
  name: string,
  value: Stringifiable | readonly Stringifiable[]
) => ({ url, ...request }: RequestInfo) => ({
  ...request,
  url: stringifyUrl({ url, query: { [name]: value } }),
})
