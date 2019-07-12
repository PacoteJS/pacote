import { useRef, RefObject, useEffect } from 'react'

type EventType = keyof DocumentEventMap

export function useOutside<E extends HTMLElement>(
  type: EventType | EventType[],
  handler: EventListener
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

    types.forEach(t => document.addEventListener(t, listener, true))

    return () => {
      types.forEach(t => document.removeEventListener(t, listener, true))
    }
  }, [type, handler, inside])

  return inside
}
