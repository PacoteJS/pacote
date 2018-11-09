import { createAction, reducerFromState } from '../src/index'
import { Either, left, right } from 'fp-ts/lib/Either'

test('complex paylaods', () => {
  type Payload = Either<Error, number>

  type State = {
    year: number
    error: Error | null
  }

  const changeYear = createAction<Payload>('CHANGE_YEAR')

  const reducer = reducerFromState<State>({ year: 1985, error: null }).on(
    changeYear,
    (s, a) =>
      a.payload.fold<State>(
        error => ({ ...s, error }),
        year => ({ year, error: null })
      )
  ).run

  expect(reducer(undefined, changeYear(right<Error, number>(1955)))).toEqual({
    year: 1955,
    error: null
  })

  expect(reducer(undefined, changeYear(left<Error, number>(Error())))).toEqual({
    year: 1985,
    error: Error()
  })
})
