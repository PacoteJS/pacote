type Meta = {}

interface Action<P> {
  type: string
  payload: P
  meta?: Meta
  error?: Error
}

type ActionCreator<P = void, M = Meta> = {
  type: string
} & (P extends void
  ? {
      (payload?: P | Error, meta?: M): Action<P>
    }
  : {
      (payload: P | Error, meta?: M): Action<P>
    })

export function createAction<P, M = Meta>(type: string): ActionCreator<P, M> {
  const creator = (payload: P | Error, meta?: M) =>
    payload instanceof Error
      ? { type, payload, meta, error: true }
      : { type, payload, meta }
  return Object.assign(creator, { type }) as ActionCreator<P, M>
}

export function isAction<P>(
  match: ActionCreator<P, any>,
  action: Action<any>
): action is Action<P> {
  return action.type === match.type
}
