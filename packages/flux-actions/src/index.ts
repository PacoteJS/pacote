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

interface Reducer<S1, S2, P> {
  (state: S1, action: Action<P>): S2
}

interface ReducerBuilder<S> {
  on: <P>(
    creator: ActionCreator<P> | ReadonlyArray<ActionCreator<P>>,
    handler: Reducer<S, S, P>
  ) => ReducerBuilder<S>
  run: Reducer<S | undefined, S, any>
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

export function reducerFromState<S>(initialState: S): ReducerBuilder<S> {
  const matches: Array<[ActionCreator<any>, Reducer<S, S, any>]> = []

  return {
    on(creators, handler) {
      Array()
        .concat(creators)
        .forEach(creator => matches.push([creator, handler]))
      return this
    },

    run(state = initialState, action) {
      return matches.reduce(
        (currentState, [type, handle]) =>
          isType(type, action) ? handle(currentState, action) : currentState,
        state
      )
    }
  }
}
