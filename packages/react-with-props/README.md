# @pacote/react-with-props

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/react-with-props)
![minified](https://badgen.net/bundlephobia/min/@pacote/react-with-props)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/react-with-props)

Enhance component with preset properties.

## Installation

```bash
yarn add @pacote/react-with-props
```

## Usage

### `withProps(props: {} | (outer: {}) => {}, component: Component | string)`

Creates a new component with the provided props applied to an existing component.

```tsx
import React from 'react'
import { withProps } from '@pacote/react-with-props'

type ComponentProps = {
  name: string
  value: string
}

const NameValue = (props: ComponentProps) => (
  <div>
    {props.name}: {props.value}
  </div>
)

// Enhance component:
const ExampleValue = withProps({ name: 'Example' }, NameValue)

render(<ExampleValue value="with props" />)
// => <div>Example: with props</div>

// Enhance component with function:
const FieldValue = withProps(
  ({ field = '' }) => ({ name: `[${field}]` }),
  NameValue
)

render(<FieldValue field="Example" value="with props" />)
// => <div>[Example]: with props</div>

// Enhance DOM component:
const PasswordInput = withProps({ type: 'password' }, 'input')

render(<PasswordInput name="secret" />)
// => <input type='password' name='secret' />
```

### `withDefaultProps(props: {}, component: Component | string)`

Like `withProps()`, but provided properties can be overridden.

```tsx
import React from 'react'
import { withDefaultProps } from '@pacote/react-with-props'

type ComponentProps = {
  name: string
  value: string
}

const NameValue = (props: ComponentProps) => (
  <div>
    {props.name}: {props.value}
  </div>
)

// Enhance component:
const Example = withDefaultProps(
  { name: 'Example', value: 'default value' },
  NameValue
)

render(<Example value="with props" />)
// => <div>Example: with props</div>

// Enhance DOM component:
const PasswordInput = withProps(
  { type: 'password', placeholder: 'Password' },
  'input'
)

render(<PasswordInput name="secret" placeholder="API Key" />)
// => <input type='password' name='secret' placeholder='API Key' />
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
