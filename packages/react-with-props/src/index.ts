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
  I extends object = object,
> = Omit<ComponentPropsWithoutRef<C>, keyof P> & I

export type Injector<
  C extends ElementType,
  P extends object,
  I extends object,
> = (props: ExternalProps<C, P, I>) => P

function isInjector<
  P extends object,
  C extends ElementType,
  I extends object = object,
>(injector: P | Injector<C, P, I>): injector is Injector<C, P, I> {
  return typeof injector === 'function'
}

/**
 * Creates a component that injects preset props into another component.
 *
 * The injected props may be an object or a function of the props supplied by
 * the caller. Caller props are spread first, so injected values take precedence.
 *
 * @param inject - Props to inject, or a function that derives them from caller props.
 * @param BaseComponent - Component or DOM element type to enhance.
 * @returns A component whose props exclude the injected keys.
 * @example
 * ```tsx
 * import { withProps } from '@pacote/react-with-props'
 *
 * type ComponentProps = { name: string; value: string }
 * const NameValue = (props: ComponentProps) => (
 *   <div>{props.name}: {props.value}</div>
 * )
 *
 * const ExampleValue = withProps({ name: 'Example' }, NameValue)
 * render(<ExampleValue value="with props" />)
 * // => <div>Example: with props</div>
 *
 * const FieldValue = withProps(
 *   ({ field = '' }) => ({ name: `[${field}]` }),
 *   NameValue,
 * )
 * render(<FieldValue field="Example" value="with props" />)
 * // => <div>[Example]: with props</div>
 *
 * const PasswordInput = withProps({ type: 'password' }, 'input')
 * render(<PasswordInput name="secret" />)
 * // => <input type="password" name="secret" />
 * ```
 */
export function withProps<
  C extends ElementType,
  P extends object,
  I extends object = object,
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

/**
 * Creates a component with default props that callers may override.
 *
 * @param inject - Default prop values.
 * @param BaseComponent - Component or DOM element type to enhance.
 * @returns A component whose injected props are optional.
 * @example
 * ```tsx
 * import { withDefaultProps } from '@pacote/react-with-props'
 *
 * type ComponentProps = { name: string; value: string }
 * const NameValue = (props: ComponentProps) => (
 *   <div>{props.name}: {props.value}</div>
 * )
 *
 * const Example = withDefaultProps({ name: 'Example' }, NameValue)
 * render(<Example value="with props" />)
 * // => <div>Example: with props</div>
 *
 * const PasswordInput = withDefaultProps(
 *   { type: 'password', placeholder: 'Password' },
 *   'input',
 * )
 * render(<PasswordInput name="secret" placeholder="API Key" />)
 * // => <input type="password" name="secret" placeholder="API Key" />
 * ```
 */
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
