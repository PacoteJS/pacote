import {
  createFactory,
  ReactSVG,
  ReactHTML,
  ComponentType,
  ReactNode,
  FunctionComponent
} from 'react'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type InnerComponent<P> = ComponentType<P> | keyof ReactHTML | keyof ReactSVG

type Enhanced<P extends I, I> = Omit<P & { children?: ReactNode }, keyof I>

function getDisplayName(Component: InnerComponent<any>): string {
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

export function withProps<I, P extends I, E = Enhanced<P, I>>(
  injectedProps: I,
  BaseComponent: InnerComponent<P>
): ComponentType<E> {
  const factory = createFactory(BaseComponent as FunctionComponent<P>)
  const EnhancedComponent: ComponentType<E> = props =>
    factory(Object.assign<P, E, I>({} as any, props, injectedProps))
  EnhancedComponent.displayName = `WithProps(${getDisplayName(BaseComponent)})`
  return EnhancedComponent
}
