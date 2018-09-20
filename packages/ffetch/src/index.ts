import * as fetch from 'isomorphic-fetch'
import { tryCatch, left, right, TaskEither } from 'fp-ts/lib/TaskEither'
import { task, Task } from 'fp-ts/lib/Task'
import { StatusError, ConnectionError, FetchError, ParserError } from './errors'

function parseBody<T>(response: Response): Promise<T | string> {
  const contentType = response.headers.get('content-type')
  return contentType === 'application/json' ? response.json() : response.text()
}

function statusError<T>(response: Response): Promise<StatusError<T | string>> {
  return parseBody<T>(response.clone())
    .then(body => new StatusError(response.statusText, response.status, body))
    .catch(() =>
      response
        .text()
        .then(
          text => new StatusError(response.statusText, response.status, text)
        )
    )
}

export function ffetch<E = {}, T = {}>(
  input?: Request | string,
  init?: RequestInit
): TaskEither<FetchError<E | string>, T | string> {
  return tryCatch<FetchError<E | string>, Response>(
    () => fetch(input, init),
    error => new ConnectionError((error as Error).message)
  )
    .chain(
      response =>
        response.ok
          ? right(task.of(response))
          : left<StatusError<E | string>, Response>(
              new Task(() => statusError(response))
            )
    )
    .chain(response =>
      tryCatch<ParserError, T | string>(
        () => parseBody<T>(response),
        error => new ParserError((error as Error).message)
      )
    )
}
