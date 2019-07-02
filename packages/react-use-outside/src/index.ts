import { useRef, RefObject, useEffect } from 'react'

export function useOutside<E extends HTMLElement>(
  type: keyof DocumentEventMap | (keyof DocumentEventMap)[],
  handler: EventListener
): RefObject<E> {
  const types = Array<keyof DocumentEventMap>().concat(type)
  const inside = useRef<E>(null)

  const listener = (evt: Event) => {
    if (
      inside.current &&
      evt.target &&
      !inside.current.contains(evt.target as Node)
    ) {
      handler(evt)
    }
  }

  useEffect(() => {
    types.forEach(t => document.addEventListener(t, listener, true))

    return () => {
      types.forEach(t => document.removeEventListener(t, listener, true))
    }
  }, [handler])

  return inside
}
