import { pixels } from '../src'

afterEach(() => {
  window.document.documentElement.style.fontSize = '16px'
  window.document.body.textContent = ''
})

test(`no unit conversion`, () => {
  expect(pixels('0')).toBe(0)
})

test(`px unit conversion`, () => {
  expect(pixels('1px')).toBe(1)
})

describe(`rem unit conversion`, () => {
  test(`relative to default root element font size`, () => {
    window.document.documentElement.style.fontSize = '16px'

    expect(pixels('1rem')).toBe(16)
  })

  test(`relative to custom root element font size`, () => {
    window.document.documentElement.style.fontSize = '10px'

    expect(pixels('1rem')).toBe(10)
  })
})

describe(`em unit conversion`, () => {
  test(`relative to px font size`, () => {
    const element = document.createElement('div')
    element.style.fontSize = '16px'

    expect(pixels('2em', element)).toBe(32)
  })

  test(`relative to rem font size`, () => {
    const element = document.createElement('div')
    window.document.documentElement.style.fontSize = '16px'
    element.style.fontSize = '2rem'

    expect(pixels('2em', element)).toBe(64)
  })

  test(`relative to em font size in one element`, () => {
    const element = document.createElement('div')
    window.document.body.appendChild(element)
    window.document.documentElement.style.fontSize = '16px'
    element.style.fontSize = '2em'

    expect(pixels('2em', element)).toBe(64)
  })

  test(`relative to em font size in multiple elements`, () => {
    const parentElement = document.createElement('div')
    const element = document.createElement('div')
    parentElement.appendChild(element)
    window.document.body.appendChild(parentElement)
    window.document.documentElement.style.fontSize = '16px'
    parentElement.style.fontSize = '2em'
    element.style.fontSize = '2em'

    expect(pixels('2em', element)).toBe(128)
  })
})

test(`in unit conversion`, () => {
  expect(pixels('1in')).toBe(96)
})

test(`q unit conversion`, () => {
  expect(pixels('1q')).toBe(0.9448818897637796)
})

test(`mm unit conversion`, () => {
  expect(pixels('1mm')).toBe(3.7795275590551185)
})

test(`cm unit conversion`, () => {
  expect(pixels('1cm')).toBe(37.795275590551185)
})

test(`pt unit conversion`, () => {
  expect(pixels('1pt')).toBe(1.3333333333333333)
})

test(`pc unit conversion`, () => {
  expect(pixels('1pc')).toBe(16)
})

test.todo(`ex unit conversion`)

test.todo(`ch unit conversion`)

test.todo(`vh unit conversion`)

test.todo(`vw unit conversion`)

// Extremely complicated to convert, depends on the property being converted
// (e.g. font-size: 50% is relative to the parent element's font-height value
// but max-height: 50% is relative to the containing element's height.)
test.todo(`% unit conversion`)
