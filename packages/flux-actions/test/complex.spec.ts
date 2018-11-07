import { createAction, reducerFromState } from '../src/index'
import { Either, left, right } from 'fp-ts/lib/Either'

type State = {
  year: number
  error: Error | null
}

test('complex paylaods', () => {
  const changeYear = createAction<Either<Error, number>>('CHANGE_YEAR')

  const reducer = reducerFromState<State>({ year: 1985, error: null })
    // CHANGE_YEAR
    .on(changeYear, (state, { payload }) =>
      payload.fold<State>(
        error => ({ ...state, error }),
        year => ({ year, error: null })
      )
    )

  expect(
    reducer.run(undefined, changeYear(right<Error, number>(1955)))
  ).toEqual({
    year: 1955,
    error: null
  })

  expect(
    reducer.run(undefined, changeYear(left<Error, number>(Error())))
  ).toEqual({
    year: 1985,
    error: Error()
  })
})
