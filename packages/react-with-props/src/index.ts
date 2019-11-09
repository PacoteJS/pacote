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
  ComponentProps extends InjectedProps,
  Component extends InnerComponent<ComponentProps>,
  EnhancedProps = Enhanced<InnerProps<Component>, InjectedProps>
>(
  injected: Injector<OuterProps, InjectedProps> | InjectedProps,
  BaseComponent: Component
): ComponentType<OuterProps & EnhancedProps> {
  const factory = createFactory(
    BaseComponent as FunctionComponent<ComponentProps>
  )
  const EnhancedComponent: FunctionComponent<OuterProps &
    EnhancedProps> = props =>
    factory(
      Object.assign<ComponentProps, EnhancedProps, InjectedProps>(
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
  ComponentProps extends InjectedProps,
  Component extends InnerComponent<ComponentProps>,
  EnhancedProps = Enhanced<InnerProps<Component>, InjectedProps> &
    Partial<InjectedProps>
>(
  injectedProps: InjectedProps,
  BaseComponent: Component
): ComponentType<EnhancedProps> {
  const factory = createFactory(
    BaseComponent as FunctionComponent<ComponentProps>
  )
  const EnhancedComponent: FunctionComponent<EnhancedProps> = props =>
    factory(
      Object.assign<ComponentProps, InjectedProps, EnhancedProps>(
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
