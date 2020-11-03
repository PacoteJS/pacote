# @pacote/react-use-outside

![version](https://badgen.net/npm/v/@pacote/react-use-outside)
![minified](https://badgen.net/bundlephobia/min/@pacote/react-use-outside)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/react-use-outside)

Hook to handle events outside React components.

## Installation

```bash
yarn add @pacote/react-use-outside
```

## Usage

### `useOutside<T>(type: Array<keyof DocumentEventMap> | keyof DocumentEventMap, listener: EventListener): React.RefObject<T>`

Takes one or more event types to listen and an event listener function and returns a reference which can be applied to a DOM element. The provided function will be called for all listened events triggered outside the component.

```tsx
import React from 'react'
import { useOutside } from '@pacote/react-use-outside'

const Modal = () => {
  const ref = useOutside('click', () => {
    console.log('Clicked outside!')
  })

  return <div ref={ref}>Click outside to show console message.</div>
}
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
