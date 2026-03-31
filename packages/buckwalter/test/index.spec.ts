import { expect, test } from 'vitest'
import { transliterate, transliterateReverse } from '../src/index'

test('transliterates the Buckwalter character set', () => {
  expect(transliterate('ءآأؤإئابةتثجحخدذرزسشصضطظعغـفقكلمنهوىيًٌٍَُِّْٰٱ')).toBe(
    "'|>&<}AbptvjHxd*rzs$SDTZEg_fqklmnhwYyFNKaui~o`{",
  )
})

test('reverse transliterates the Buckwalter character set', () => {
  expect(
    transliterateReverse("'|>&<}AbptvjHxd*rzs$SDTZEg_fqklmnhwYyFNKaui~o`{"),
  ).toBe('ءآأؤإئابةتثجحخدذرزسشصضطظعغـفقكلمنهوىيًٌٍَُِّْٰٱ')
})
