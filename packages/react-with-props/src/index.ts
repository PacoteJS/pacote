import {
  type ComponentType,
  createElement,
  type DetailedHTMLFactory,
  type DOMFactory,
  type FunctionComponent,
  type ReactHTML,
  type ReactNode,
  type ReactSVG
} from 'react'

type UnknownProps = Record<string, unknown>

type Injector<Props, InjectedProps> = (props?: Props) => InjectedProps

type InnerComponent<Props = UnknownProps> =
  | ComponentType<Props>
  | keyof ReactHTML
  | keyof ReactSVG

type Enhanced<I, P extends I> = Omit<P & { children?: ReactNode }, keyof I>

// biome-ignore lint/suspicious/noExplicitAny: TODO
type InnerProps<Component extends InnerComponent<any>> =
  Component extends keyof ReactHTML
    ? // biome-ignore lint/suspicious/noExplicitAny: TODO
      ReactHTML[Component] extends DetailedHTMLFactory<infer HTMLProps, any>
      ? HTMLProps
      : Component extends keyof ReactSVG
        ? ReactSVG[Component] extends DOMFactory<infer SVGProps, SVGElement>
          ? SVGProps
          : never
        : never
    : Component extends ComponentType<infer Props>
      ? Props
      : // biome-ignore lint/suspicious/noExplicitAny: TODO
        any

// biome-ignore lint/suspicious/noExplicitAny: TODO
function getDisplayName(Component: InnerComponent<any>): string {
  return typeof Component === 'string'
    ? Component
    : Component.displayName || Component.name || 'Component'
}

function isInjector<OuterProps, InjectedProps>(
  injector: unknown,
): injector is Injector<OuterProps, InjectedProps> {
  return typeof injector === 'function'
}

export function withProps<
  OuterProps extends Record<string, unknown>,
  InjectedProps extends Record<string, unknown>,
  ComponentProps extends InjectedProps,
  Component extends InnerComponent<ComponentProps>,
  EnhancedProps = Enhanced<InjectedProps, InnerProps<Component>>,
>(
  injected: Injector<OuterProps, InjectedProps> | InjectedProps,
  BaseComponent: Component,
): ComponentType<OuterProps & EnhancedProps> {
  const EnhancedComponent: FunctionComponent<OuterProps & EnhancedProps> = (
    props,
  ) =>
    createElement(
      BaseComponent,
      Object.assign<ComponentProps, EnhancedProps, InjectedProps>(
        {} as ComponentProps,
        props,
        isInjector<OuterProps, InjectedProps>(injected)
          ? injected(props)
          : injected,
      ),
    )
  EnhancedComponent.displayName = `WithProps(${getDisplayName(BaseComponent)})`
  return EnhancedComponent
}

export function withDefaultProps<
  InjectedProps extends Record<string, unknown>,
  ComponentProps extends InjectedProps,
  Component extends InnerComponent<ComponentProps>,
  EnhancedProps = Enhanced<InjectedProps, InnerProps<Component>> &
    Partial<InjectedProps>,
>(
  injectedProps: InjectedProps,
  BaseComponent: Component,
): ComponentType<EnhancedProps> {
  const EnhancedComponent: FunctionComponent<EnhancedProps> = (props) =>
    createElement(
      BaseComponent,
      Object.assign<ComponentProps, InjectedProps, EnhancedProps>(
        {} as ComponentProps,
        injectedProps,
        props,
      ),
    )
  EnhancedComponent.displayName = `WithDefaultProps(${getDisplayName(
    BaseComponent,
  )})`
  return EnhancedComponent
}
