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

interface Reducer<S, P> {
  (state: S | undefined, action: Action<P>): S
}

interface ReduceHandler<S, P> {
  (state: S, action: Action<P>): S
}

interface ReducerMethods<S> {
  on: <P>(
    creator: ActionCreator<P> | ReadonlyArray<ActionCreator<P>>,
    handler: ReduceHandler<S, P>
  ) => ReducerMethods<S>
  run: Reducer<S, any>
}

interface EnhancedReducer<S> extends Reducer<S, any> {
  on: <P>(
    creator: ActionCreator<P> | ReadonlyArray<ActionCreator<P>>,
    handler: ReduceHandler<S, P>
  ) => EnhancedReducer<S>
  run: Reducer<S, any>
}

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

export function reducerFromState<S>(initialState: S): EnhancedReducer<S> {
  const matches: Array<[ActionCreator<any>, ReduceHandler<S, any>]> = []

  const reducer: Reducer<S, any> = (state = initialState, action) =>
    matches.reduce(
      (currentState, [type, handle]) =>
        isType(type, action) ? handle(currentState, action) : currentState,
      state
    )

  return Object.assign<Reducer<S, any>, ReducerMethods<S>>(reducer, {
    on(creators, handler) {
      Array()
        .concat(creators)
        .forEach(creator => matches.push([creator, handler]))
      return this
    },
    run: reducer
  }) as EnhancedReducer<S>
}
