import {
  createFactory,
  ReactSVG,
  ReactHTML,
  ComponentType,
  ReactNode,
  FunctionComponent,
  HTMLAttributes,
  SVGAttributes
} from 'react'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type InnerComponent<P = any> =
  | ComponentType<P>
  | keyof ReactHTML
  | keyof ReactSVG

type Enhanced<P extends I, I> = Omit<P & { children?: ReactNode }, keyof I>

type InnerProps<C, P> = C extends keyof ReactHTML
  ? any
  : C extends keyof ReactSVG
  ? any
  : P

function getDisplayName(Component: InnerComponent): string {
  return typeof Component === 'string'
    ? Component
    : Component.displayName || Component.name || 'Component'
}

/**
 * Development notes:
 *
 * P = Inner (wrapped) component props.
 * I = Injected props.
 * E = Enhanced component props (E = P - I)
 *
 * Mmmm... pie.
 *
 * TODO: Infer P for DOM components.
 */

export function withProps<
  I extends {},
  P extends I = InnerProps<InnerComponent, P>,
  E = Enhanced<P, I>
>(injectedProps: I, BaseComponent: InnerComponent<P>): FunctionComponent<E> {
  const factory = createFactory(BaseComponent as FunctionComponent<P>)
  const EnhancedComponent: FunctionComponent<E> = props =>
    factory(Object.assign<P, E, I>({} as any, props, injectedProps))
  EnhancedComponent.displayName = `WithProps(${getDisplayName(BaseComponent)})`
  return EnhancedComponent
}
