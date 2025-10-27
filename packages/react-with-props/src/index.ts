import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  createElement,
  type ElementType,
} from 'react'

function getDisplayName<C extends ElementType>(Component: C): string {
  return typeof Component === 'string'
    ? Component
    : Component.displayName || Component.name || 'Component'
}

export type ExternalProps<
  C extends ElementType,
  P extends object,
  I extends object = {},
> = Omit<ComponentPropsWithoutRef<C>, keyof P> & I

export type Injector<
  C extends ElementType,
  P extends object,
  I extends object,
> = (props: ExternalProps<C, P, I>) => P

function isInjector<
  P extends object,
  C extends ElementType,
  I extends object = {},
>(injector: P | Injector<C, P, I>): injector is Injector<C, P, I> {
  return typeof injector === 'function'
}

export function withProps<
  C extends ElementType,
  P extends object,
  I extends object = {},
>(
  inject: P | Injector<C, P, I>,
  BaseComponent: C,
): ComponentType<ExternalProps<C, P, I>> {
  const EnhancedComponent = (props: ExternalProps<C, P, I>) =>
    createElement(BaseComponent, {
      ...props,
      ...(isInjector(inject) ? inject(props) : inject),
    })
  EnhancedComponent.displayName = `WithProps(${getDisplayName(BaseComponent)})`
  return EnhancedComponent
}

export type Defaultize<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export function withDefaultProps<
  C extends ElementType,
  P extends Partial<ComponentPropsWithoutRef<C>>,
>(
  inject: P,
  BaseComponent: C,
): ComponentType<Defaultize<ComponentPropsWithoutRef<C>, keyof P>> {
  const EnhancedComponent = (
    props: Defaultize<ComponentPropsWithoutRef<C>, keyof P>,
  ) => createElement(BaseComponent, { ...inject, ...props })
  EnhancedComponent.displayName = `WithDefaultProps(${getDisplayName(
    BaseComponent,
  )})`
  return EnhancedComponent
}
