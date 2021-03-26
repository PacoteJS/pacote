type Fn<Argument, Result> = (value: Argument) => Result

type PipeFunctor<Argument> = {
  then<Result>(fn: Fn<Argument, Result>): PipeFunctor<Result>
  readonly value: Argument
}

export function pipe<Argument>(value: Argument): PipeFunctor<Argument> {
  return {
    then: (fn) => pipe(fn(value)),
    value,
  }
}

type FlowFunctor<Initial, Next> = Fn<Initial, Next> & FlowMap<Initial, Next>

type FlowMap<Initial, Current> = {
  then: <Next>(fn: Fn<Current, Next>) => FlowFunctor<Initial, Next>
}

export function flow<Initial, Next>(
  initial: Fn<Initial, Next>
): FlowFunctor<Initial, Next> {
  return Object.assign<Fn<Initial, Next>, FlowMap<Initial, Next>>(
    (value) => initial(value),
    { then: (fn) => flow((value) => fn(initial(value))) }
  )
}
