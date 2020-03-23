export interface Action<P = any, M = any> {
  type: string
  payload: P
  meta: M
}

type ActionCreator<P = any, M = any> = {
  type: string
  (payload: P, meta?: M): Action<P, M>
} & (P extends void
  ? {
      (payload?: P, meta?: M): Action<P, M>
    }
  : {})

type Reducer<S> = (state: S | undefined, action: Action) => S

type ReduceHandler<S, P = any, M = any> = (state: S, action: Action<P, M>) => S

type ReducerMatch<S> = [ActionCreator, ReduceHandler<S>]

interface ReducerMethods<S> {
  on: <P, M>(
    creators: ActionCreator<P, M> | ActionCreator<P, M>[],
    handler: ReduceHandler<S, P, M>
  ) => EnhancedReducer<S>
}

type EnhancedReducer<S> = Reducer<S> & ReducerMethods<S>

export function createAction<P = void, M = void>(
  type: string
): ActionCreator<P, M> {
  const creator = (payload: P, meta?: M) => ({ type, payload, meta })
  return Object.assign(creator, { type }) as ActionCreator<P, M>
}

export function isType<P, M>(
  match: ActionCreator<P, M>,
  action: Action
): action is Action<P, M> {
  return action.type === match.type
}

function createReducer<S>(
  initialState: S,
  matches: readonly ReducerMatch<S>[]
): EnhancedReducer<S> {
  const reducer: Reducer<S> = (currentState = initialState, action) =>
    matches.reduce(
      (state, [creator, handler]) =>
        isType(creator, action) ? handler(state, action) : state,
      currentState
    )

  return Object.assign<Reducer<S>, ReducerMethods<S>>(reducer, {
    on(creators, handler) {
      return createReducer(initialState, [
        ...matches,
        ...Array<ActionCreator>()
          .concat(creators)
          .map<ReducerMatch<S>>((creator) => [creator, handler]),
      ])
    },
  })
}

export function reducerFromState<S>(initialState: S): EnhancedReducer<S> {
  return createReducer(initialState, [])
}
