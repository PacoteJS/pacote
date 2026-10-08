/** A typed Flux action containing its type, payload, and optional metadata. */
// biome-ignore lint/suspicious/noExplicitAny: ignore
export interface Action<P = any, M = any> {
  type: string
  payload: P
  meta: M
}

// biome-ignore lint/suspicious/noExplicitAny: ignore
type ActionCreator<P = any, M = any> = {
  type: string
  (payload: P, meta?: M): Action<P, M>
} & (P extends void
  ? (payload?: P, meta?: M) => Action<P, M>
  : Record<string, unknown>)

type Reducer<S> = (state: S | undefined, action: Action) => S

// biome-ignore lint/suspicious/noExplicitAny: ignore
type ReduceHandler<S, P = any, M = any> = (state: S, action: Action<P, M>) => S

type ReducerMatch<S> = [ActionCreator, ReduceHandler<S>]

interface ReducerMethods<S> {
  on: <P, M>(
    creators: ActionCreator<P, M> | ActionCreator<P, M>[],
    handler: ReduceHandler<S, P, M>,
  ) => EnhancedReducer<S>
}

type EnhancedReducer<S> = Reducer<S> & ReducerMethods<S>

/**
 * Creates a typed action creator for a fixed action type.
 *
 * The returned function accepts a payload and optional metadata. Use `void`
 * payloads for actions that need no payload; errors should be wrapped in a
 * value such as `Either` when they are part of the action data.
 * Metadata is stored on the `meta` field of the action object.
 *
 * @typeParam P - Action payload type.
 * @typeParam M - Action metadata type.
 * @param type - Stable action type string.
 * @returns An action creator carrying the supplied `type` property.
 * @example
 * ```typescript
 * import { createAction } from '@pacote/flux-actions'
 * import { type Either, tryCatch } from 'fp-ts/lib/Either'
 *
 * const changeYear = createAction<number>('CHANGE_YEAR')
 * changeYear(1955) // { type: 'CHANGE_YEAR', payload: 1955, meta: undefined }
 * changeYear(1955, { test: true })
 * // { type: 'CHANGE_YEAR', payload: 1955, meta: { test: true } }
 *
 * const changeYearWithError = createAction<Either<Error, number>>('CHANGE_YEAR')
 * changeYearWithError(tryCatch(() => Number('1985'), (error) => error as Error))
 * ```
 */
export function createAction<P = void, M = void>(
  type: string,
): ActionCreator<P, M> {
  const creator = (payload: P, meta?: M) => ({ type, payload, meta })
  return Object.assign(creator, { type }) as ActionCreator<P, M>
}

/**
 * Checks an action's type and narrows its payload and metadata types.
 *
 * @typeParam P - Payload type of the action creator.
 * @typeParam M - Metadata type of the action creator.
 * @param match - Action creator whose type to match.
 * @param action - Action to check.
 * @returns `true` when the action type matches the creator.
 * @example
 * ```typescript
 * import { createAction, isType } from '@pacote/flux-actions'
 *
 * const changeYear = createAction<number>('CHANGE_YEAR')
 * const action = changeYear(1955)
 *
 * if (isType(changeYear, action)) {
 *   action.payload // number
 * }
 * ```
 */
export function isType<P, M>(
  match: ActionCreator<P, M>,
  action: Action,
): action is Action<P, M> {
  return action.type === match.type
}

function createReducer<S>(
  initialState: S,
  matches: readonly ReducerMatch<S>[],
): EnhancedReducer<S> {
  const reducer: Reducer<S> = (currentState, action) =>
    matches.reduce(
      (state, [creator, handler]) =>
        isType(creator, action) ? handler(state, action) : state,
      currentState ?? initialState,
    )

  return Object.assign<Reducer<S>, ReducerMethods<S>>(reducer, {
    on(creators, handler) {
      return createReducer(initialState, [
        ...matches,
        ...([] as ActionCreator[])
          .concat(creators)
          .map<ReducerMatch<S>>((creator) => [creator, handler]),
      ])
    },
  })
}

/**
 * Creates a reducer with an initial state and no handlers.
 *
 * Chain `.on()` calls to register one or more action creators and their
 * corresponding state update handlers.
 *
 * @typeParam S - State type.
 * @param initialState - State used when the reducer receives `undefined`.
 * @returns A reducer with an `.on()` method for adding typed handlers.
 * @example
 * ```typescript
 * import { createAction, reducerFromState } from '@pacote/flux-actions'
 *
 * const person = createAction<{ name: string }>('PERSON')
 * const dog = createAction<{ name: string }>('DOG')
 * const car = createAction<{ brand: string }>('CAR')
 *
 * const reducer = reducerFromState({ now: 'None', then: '' })
 *   .on([person, dog], (state, action) => ({
 *     now: action.payload.name,
 *     then: state.now,
 *   }))
 *   .on(car, (state, action) => ({
 *     now: action.payload.brand,
 *     then: state.now,
 *   }))
 *
 * const s2 = reducer(undefined, person({ name: 'Marty McFly' }))
 * // { now: 'Marty McFly', then: 'None' }
 * const s3 = reducer(s2, dog({ name: 'Einstein' }))
 * // { now: 'Einstein', then: 'Marty McFly' }
 * const s4 = reducer(s3, car({ brand: 'DeLorean' }))
 * // { now: 'DeLorean', then: 'Einstein' }
 * ```
 * Reducing actions with errors wrapped in `Either` can store the error in
 * state while handling a successful payload:
 * ```typescript
 * import { type Either, tryCatch } from 'fp-ts/lib/Either'
 *
 * type State = { year: number; error?: Error }
 * const changeYear = createAction<Either<Error, number>>('CHANGE_YEAR')
 * const reducer = reducerFromState<State>({ year: 1985 }).on(
 *   changeYear,
 *   (state, { payload }) =>
 *     payload.fold(
 *       (error) => ({ ...state, error }),
 *       (year) => ({ year, error: undefined }),
 *     ),
 * )
 *
 * reducer(undefined, changeYear(tryCatch(() => 2025, (error) => error as Error)))
 * ```
 */
export function reducerFromState<S>(initialState: S): EnhancedReducer<S> {
  return createReducer(initialState, [])
}

/**
 * Creates a reducer whose state type is supplied explicitly.
 * @typeParam S - State type produced by the reducer.
 * @returns A reducer with an `.on()` method for adding typed handlers.
 */
export function reducer<S>() {
  return createReducer<S>({} as S, [])
}
