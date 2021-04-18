import { Result, fold, Ok, Err } from '@pacote/result'
import { pipe } from '@pacote/pipe'
import { createAction, reducerFromState } from '../src/index'

test('complex payloads', () => {
  type Payload = Result<number, Error>

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
          (year) => ({ year }),
          (error) => ({ ...s, error })
        )
      )
  )

  expect(reducer(undefined, changeYear(Ok(1955)))) //
    .toEqual({ year: 1955 })

  expect(reducer(undefined, changeYear(Err(Error())))) //
    .toEqual({ year: 1985, error: Error() })
})
