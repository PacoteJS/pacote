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

export function createAction<P = void, M = void>(
  type: string,
): ActionCreator<P, M> {
  const creator = (payload: P, meta?: M) => ({ type, payload, meta })
  return Object.assign(creator, { type }) as ActionCreator<P, M>
}

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

export function reducerFromState<S>(initialState: S): EnhancedReducer<S> {
  return createReducer(initialState, [])
}
