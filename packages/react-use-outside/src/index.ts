import { type RefObject, useEffect, useRef } from 'react'

type EventType = keyof DocumentEventMap

/**
 * Returns a ref for an element and calls a handler when selected document
 * events occur outside that element.
 *
 * @param type - One or more document event names to observe.
 * @param handler - Listener called for events whose target is outside the element.
 * @returns A ref to attach to the element treated as inside.
 * @example
 * ```tsx
 * import { useOutside } from '@pacote/react-use-outside'
 *
 * function Modal({ onClose }: { onClose: () => void }) {
 *   const ref = useOutside<HTMLDivElement>('click', () => {
 *     console.log('Clicked outside')
 *     onClose()
 *   })
 *
 *   return <div ref={ref}>Click outside this element</div>
 * }
 * ```
 */
export function useOutside<E extends HTMLElement>(
  type: EventType | EventType[],
  handler: EventListener,
): RefObject<E | null> {
  const inside = useRef<E>(null)

  useEffect(() => {
    const listener = (evt: Event) => {
      if (
        inside.current &&
        evt.target &&
        !inside.current.contains(evt.target as Node)
      ) {
        handler(evt)
      }
    }

    const types = ([] as ReadonlyArray<EventType>).concat(type)
    const controller = new AbortController()
    const options = { signal: controller.signal }

    for (const t of types) {
      document.addEventListener(t, listener, options)
    }

    return () => {
      controller.abort()
    }
  }, [type, handler])

  return inside
}
