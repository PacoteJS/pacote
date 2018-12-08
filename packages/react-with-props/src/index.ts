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

type InnerComponent<P = any> =
  | ComponentType<P>
  | keyof ReactHTML
  | keyof ReactSVG

type Enhanced<P extends I, I> = Omit<P & { children?: ReactNode }, keyof I>

type InnerProps<C extends InnerComponent<any>> = C extends keyof ReactHTML
  ? ReactHTML[C] extends DetailedHTMLFactory<infer H, any>
    ? H
    : C extends keyof ReactSVG
    ? ReactSVG[C] extends DOMFactory<infer S, SVGElement>
      ? S
      : never
    : never
  : C extends ComponentType<infer P>
  ? P
  : any

function getDisplayName(Component: InnerComponent<any>): string {
  return typeof Component === 'string'
    ? Component
    : Component.displayName || Component.name || 'Component'
}

type Injector<P, I> = (props?: P) => I

function isInjector<E, I>(injector: any): injector is Injector<E, I> {
  return typeof injector === 'function'
}

export function withProps<
  I,
  O extends {},
  P extends I,
  C extends InnerComponent<P>,
  E = Enhanced<InnerProps<C>, I>
>(injected: Injector<O, I> | I, BaseComponent: C): ComponentType<O & E> {
  const factory = createFactory(BaseComponent as FunctionComponent<P>)
  const EnhancedComponent: FunctionComponent<O & E> = props =>
    factory(
      Object.assign<P, E, I>(
        {} as any,
        props,
        isInjector<O, I>(injected) ? injected(props) : injected
      )
    )
  EnhancedComponent.displayName = `WithProps(${getDisplayName(BaseComponent)})`
  return EnhancedComponent
}

export function withDefaultProps<
  I,
  P extends I,
  C extends InnerComponent<P>,
  E = Enhanced<InnerProps<C>, I> & Partial<I>
>(injectedProps: I, BaseComponent: C): ComponentType<E> {
  const factory = createFactory(BaseComponent as FunctionComponent<P>)
  const EnhancedComponent: FunctionComponent<E> = props =>
    factory(Object.assign<P, I, E>({} as any, injectedProps, props))
  EnhancedComponent.displayName = `WithDefaultProps(${getDisplayName(
    BaseComponent
  )})`
  return EnhancedComponent
}
