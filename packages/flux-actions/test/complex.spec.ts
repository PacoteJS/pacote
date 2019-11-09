import { Either, left, right, fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { createAction, reducerFromState } from '../src/index'

test('complex payloads', () => {
  type Payload = Either<Error, number>

  interface State {
    year: number
    error?: Error
  }

  const changeYear = createAction<Payload>('CHANGE_YEAR')

  const reducer = reducerFromState<State>({ year: 1985 }).on(
    changeYear,
    (s, a) =>
      pipe(
        a.payload,
        fold(
          error => ({ ...s, error }),
          year => ({ year, error: undefined })
        )
      )
  )

  expect(reducer(undefined, changeYear(right<Error, number>(1955)))) //
    .toEqual({ year: 1955 })

  expect(reducer(undefined, changeYear(left<Error, number>(Error())))) //
    .toEqual({ year: 1985, error: Error() })
})
