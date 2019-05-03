import { getStyle } from '../src'

afterEach(() => {
  window.document.documentElement.style.fontSize = '16px'
  window.document.body.textContent = ''
})

test(`fetches a property value`, () => {
  window.document.body.style.fontSize = '2rem'
  expect(getStyle(window.document.body, 'fontSize')).toBe('2rem')
})
