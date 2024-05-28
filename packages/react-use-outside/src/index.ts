import { type RefObject, useEffect, useRef } from 'react'

type EventType = keyof DocumentEventMap

export function useOutside<E extends HTMLElement>(
  type: EventType | EventType[],
  handler: EventListener,
): RefObject<E> {
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

    const types = Array<EventType>().concat(type)
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
