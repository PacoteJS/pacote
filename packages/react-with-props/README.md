# @pacote/react-with-props

[![Demo](https://badgen.net/badge/codesandbox/demo/yellow)](https://codesandbox.io/s/...)
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
const Example = withProps({ name: 'Example' }, NameValue)

render(<Example value="with props" />)
// => <div>Example: with props</div>

// Enhance DOM component:
const PasswordInput = withProps({ type: 'password' }, 'input')

render(<PasswordInput name="secret" />)
// => <input type='password' name='secret' />
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
