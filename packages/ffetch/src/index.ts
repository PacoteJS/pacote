import * as fetch from 'isomorphic-fetch'
import { tryCatch, left, right, TaskEither } from 'fp-ts/lib/TaskEither'
import { task, Task } from 'fp-ts/lib/Task'
import { StatusError, ConnectionError, FetchError, ParserError } from './errors'

interface FRequestInit<E, T> {
  parse(r: Response): Promise<T>
  parseLeft(r: Response): Promise<E>
}

function parse<T>(response: Response): Promise<T | string> {
  const contentType = (response.headers.get('content-type') || '')
    .trim()
    .toLowerCase()
  return contentType.startsWith('application/json')
    ? response.json()
    : response.text()
}

function parseLeft<E>(response: Response): Promise<E | string> {
  return parse<E>(response.clone()).catch(() => response.text())
}

function statusError<E>(
  parseFn: (r: Response) => Promise<E>,
  response: Response
): Task<StatusError<E | string>> {
  return new Task(() =>
    parseFn(response)
      .then(body => new StatusError(response.statusText, response.status, body))
      .catch(({ message }) => new ParserError(message, response.status))
  )
}

export function ffetch<E, T>(
  input?: Request | string,
  init?: RequestInit,
  fInit?: Partial<FRequestInit<E, T>>
): TaskEither<FetchError<E | string>, T | string> {
  const f: FRequestInit<E | string, T | string> = { parse, parseLeft, ...fInit }

  return tryCatch<FetchError<E | string>, Response>(
    () => fetch(input, init),
    error => new ConnectionError((error as Error).message)
  )
    .chain(
      response =>
        response.ok
          ? right(task.of(response))
          : left<StatusError<E | string>, Response>(
              statusError(f.parseLeft, response.clone())
            )
    )
    .chain(response =>
      tryCatch<ParserError, T | string>(
        () => f.parse(response.clone()),
        error => new ParserError((error as Error).message, response.status)
      )
    )
}
