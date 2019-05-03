import { pixels } from '../src'

afterEach(() => {
  window.document.documentElement.style.fontSize = '16px'
  window.document.body.textContent = ''
})

test(`no unit conversion`, () => {
  expect(pixels('0')).toBe(0)
})

describe(`absolute units`, () => {
  test(`px unit conversion`, () => {
    expect(pixels('1px')).toBe(1)
  })

  test(`cm unit conversion`, () => {
    expect(pixels('1cm')).toBe(37.795275590551185)
  })

  test(`mm unit conversion`, () => {
    expect(pixels('1mm')).toBe(3.7795275590551185)
  })

  test(`Q unit conversion`, () => {
    expect(pixels('1Q')).toBe(0.9448818897637796)
  })

  test(`in unit conversion`, () => {
    expect(pixels('1in')).toBe(96)
  })

  test(`pc unit conversion`, () => {
    expect(pixels('1pc')).toBe(16)
  })

  test(`pt unit conversion`, () => {
    expect(pixels('1pt')).toBe(1.3333333333333333)
  })
})

describe(`font-relative units`, () => {
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
})

describe(`viewport-relative units`, () => {
  test(`vh unit conversion`, () => {
    expect(pixels('50vh')).toBe(384)
  })

  test(`vw unit conversion`, () => {
    expect(pixels('50vw')).toBe(512)
  })

  test(`vmin unit conversion`, () => {
    expect(pixels('50vmin')).toBe(384)
  })

  test(`vmax unit conversion`, () => {
    expect(pixels('50vmax')).toBe(512)
  })
})
