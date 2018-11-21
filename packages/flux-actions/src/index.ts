type ActionMeta = any

export type Action<P> = {
  type: string
  payload: P
  meta?: ActionMeta
}

type ActionCreator<P, M = ActionMeta> = {
  type: string
  (payload: P, meta?: M): Action<P>
} & (P extends void
  ? {
      (payload?: P, meta?: M): Action<P>
    }
  : {})

interface Reducer<S> {
  (state: S | undefined, action: Action<any>): S
}

interface ReduceHandler<S, P> {
  (state: S, action: Action<P>): S
}

interface ReducerMethods<S> {
  on: <P>(
    creator: ActionCreator<P> | ReadonlyArray<ActionCreator<P>>,
    handler: ReduceHandler<S, P>
  ) => EnhancedReducer<S>
  run: Reducer<S>
}

type EnhancedReducer<S> = Reducer<S> & ReducerMethods<S>

export function createAction<P = void, M = ActionMeta>(
  type: string
): ActionCreator<P, M> {
  const creator = (payload: P, meta?: M) => ({ type, payload, meta })
  return Object.assign(creator, { type }) as ActionCreator<P, M>
}

export function isType<P>(
  match: ActionCreator<P, any>,
  action: Action<any>
): action is Action<P> {
  return action.type === match.type
}

type ReducerMatch<S> = [ActionCreator<any>, ReduceHandler<S, any>]

function createReducer<S>(
  initialState: S,
  matches: ReadonlyArray<ReducerMatch<S>>
): EnhancedReducer<S> {
  const reducer: Reducer<S> = (state = initialState, action) =>
    matches.reduce(
      (currentState, [type, handle]) =>
        isType(type, action) ? handle(currentState, action) : currentState,
      state
    )

  return Object.assign<Reducer<S>, ReducerMethods<S>>(reducer, {
    on(creators, handler) {
      return createReducer(initialState, [
        ...matches,
        ...Array<ActionCreator<any>>()
          .concat(creators)
          .map<ReducerMatch<S>>(creator => [creator, handler])
      ])
    },
    run: reducer
  })
}

export function reducerFromState<S>(initialState: S): EnhancedReducer<S> {
  return createReducer(initialState, [])
}
