import {
  createFactory,
  ReactSVG,
  ReactHTML,
  ComponentType,
  ReactNode,
  FunctionComponent,
  DetailedHTMLFactory,
  DOMFactory
} from 'react'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type Injector<Props, InjectedProps> = (props?: Props) => InjectedProps

type InnerComponent<Props = any> =
  | ComponentType<Props>
  | keyof ReactHTML
  | keyof ReactSVG

type Enhanced<P extends I, I> = Omit<P & { children?: ReactNode }, keyof I>

type InnerProps<
  Component extends InnerComponent<any>
> = Component extends keyof ReactHTML
  ? ReactHTML[Component] extends DetailedHTMLFactory<infer HTMLProps, any>
    ? HTMLProps
    : Component extends keyof ReactSVG
    ? ReactSVG[Component] extends DOMFactory<infer SVGProps, SVGElement>
      ? SVGProps
      : never
    : never
  : Component extends ComponentType<infer Props>
  ? Props
  : any

function getDisplayName(Component: InnerComponent<any>): string {
  return typeof Component === 'string'
    ? Component
    : Component.displayName || Component.name || 'Component'
}

function isInjector<OuterProps, InjectedProps>(
  injector: any
): injector is Injector<OuterProps, InjectedProps> {
  return typeof injector === 'function'
}

export function withProps<
  OuterProps extends {},
  InjectedProps extends {},
  Props extends InjectedProps,
  Component extends InnerComponent<Props>,
  ExposedProps = Enhanced<InnerProps<Component>, InjectedProps>
>(
  injected: Injector<OuterProps, InjectedProps> | InjectedProps,
  BaseComponent: Component
): ComponentType<OuterProps & ExposedProps> {
  const factory = createFactory(BaseComponent as FunctionComponent<Props>)
  const EnhancedComponent: FunctionComponent<
    OuterProps & ExposedProps
  > = props =>
    factory(
      Object.assign<Props, ExposedProps, InjectedProps>(
        {} as any,
        props,
        isInjector<OuterProps, InjectedProps>(injected)
          ? injected(props)
          : injected
      )
    )
  EnhancedComponent.displayName = `WithProps(${getDisplayName(BaseComponent)})`
  return EnhancedComponent
}

export function withDefaultProps<
  InjectedProps extends {},
  Props extends InjectedProps,
  Component extends InnerComponent<Props>,
  ExposedProps = Enhanced<InnerProps<Component>, InjectedProps> &
    Partial<InjectedProps>
>(
  injectedProps: InjectedProps,
  BaseComponent: Component
): ComponentType<ExposedProps> {
  const factory = createFactory(BaseComponent as FunctionComponent<Props>)
  const EnhancedComponent: FunctionComponent<ExposedProps> = props =>
    factory(
      Object.assign<Props, InjectedProps, ExposedProps>(
        {} as any,
        injectedProps,
        props
      )
    )
  EnhancedComponent.displayName = `WithDefaultProps(${getDisplayName(
    BaseComponent
  )})`
  return EnhancedComponent
}
