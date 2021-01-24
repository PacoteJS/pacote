import { BloomSearch } from '../src/index'

test('searching an empty index yields no results', () => {
  const bs = new BloomSearch({
    errorRate: 0.001,
    fields: ['text'],
    summary: ['id'],
  })

  expect(bs.search('foo')).toEqual([])
})

test('searching for words in a field yields matching results', () => {
  const bs = new BloomSearch({
    errorRate: 0.001,
    fields: ['text'],
    summary: ['id'],
  })

  bs.add({ id: 1, text: 'foo' })
  bs.add({ id: 2, text: 'bar' })

  expect(bs.search('foo')).toEqual([{ id: 1 }])
})

test('searching for words in a field yields matching sorted by number of matches', () => {
  const bs = new BloomSearch({
    errorRate: 0.001,
    fields: ['text'],
    summary: ['id'],
  })

  bs.add({ id: 1, text: 'foo' })
  bs.add({ id: 2, text: 'foo foo' })

  expect(bs.search('foo')).toEqual([{ id: 2 }, { id: 1 }])
})

test('search results return only fields in the summary list', () => {
  const bs = new BloomSearch({
    errorRate: 0.001,
    fields: ['text'],
    summary: ['text'],
  })

  bs.add({ id: 1, text: 'foo' })
  bs.add({ id: 2, text: 'bar' })

  expect(bs.search('foo')).toEqual([{ text: 'foo' }])
})

test('stopwords are passed through a language-aware filter', () => {
  const stopwords = jest.fn((text) => text.length > 1)

  const bs = new BloomSearch({
    errorRate: 0.001,
    fields: ['text'],
    summary: ['text'],
    stopwords,
  })

  bs.add({ text: 'a foo bar' }, 'en-US')

  expect(stopwords).toHaveBeenCalledWith('a', 'en-US')
  expect(stopwords).toHaveBeenCalledWith('foo', 'en-US')
  expect(stopwords).toHaveBeenCalledWith('bar', 'en-US')
  expect(bs.search('a')).toEqual([])
})

test('empty documents are not indexed', () => {
  const bs = new BloomSearch({
    errorRate: 0.001,
    fields: ['text'],
    summary: ['text'],
  })

  bs.add({ text: '' })

  expect(bs.search('')).toEqual([])
})

test('undefined fields are not indexed', () => {
  const bs = new BloomSearch({
    errorRate: 0.001,
    fields: ['text'],
    summary: ['id'],
  })

  bs.add({ id: 1, text: 'undefined' })
  bs.add({ id: 2, text: undefined })
  bs.add({ id: 3 })

  expect(bs.search('undefined')).toEqual([{ id: 1 }])
})

test('tokens are passed through a language-aware stemmer', () => {
  const stemmer = jest.fn((text) => text.substr(0, 3))

  const bs = new BloomSearch({
    errorRate: 0.001,
    fields: ['text'],
    summary: ['text'],
    stemmer,
  })

  bs.add({ text: 'foobar foobaz' }, 'en-US')

  expect(stemmer).toHaveBeenCalledWith('foobar', 'en-US')
  expect(stemmer).toHaveBeenCalledWith('foobaz', 'en-US')
  expect(bs.search('foo', 'en-GB')).toEqual([{ text: 'foobar foobaz' }])
  expect(stemmer).toHaveBeenCalledWith('foo', 'en-GB')
})

test('document fields can be preprocessed for the index', () => {
  const preprocess = jest.fn((text) => text.replace(/-/g, ' '))

  const bs = new BloomSearch({
    errorRate: 0.001,
    fields: ['text'],
    summary: ['text'],
    preprocess,
  })

  bs.add({ text: 'foo-bar' })

  expect(preprocess).toHaveBeenCalledWith('foo-bar', 'text')
  expect(bs.search('foo')).toEqual([{ text: 'foo-bar' }])
})

test('document fields can be preprocessed', () => {
  const bs = new BloomSearch({
    errorRate: 0.001,
    fields: ['text'],
    summary: ['text'],
    preprocess: (text) => String(text).replace(/-/g, ' '),
  })

  bs.add({ text: 'foo-bar' })

  expect(bs.search('foo')).toEqual([{ text: 'foo-bar' }])
})

test('document fields can be weighed', () => {
  const bs = new BloomSearch({
    errorRate: 0.001,
    fields: { title: 2, body: 1 },
    summary: ['title', 'body'],
  })

  bs.add({ title: 'bar', body: 'foo' })
  bs.add({ title: 'foo', body: 'bar' })

  expect(bs.search('foo')).toEqual([
    { title: 'foo', body: 'bar' },
    { title: 'bar', body: 'foo' },
  ])
})

test('index can be searched for multiple terms', () => {
  const bs = new BloomSearch({
    errorRate: 0.001,
    fields: ['text'],
    summary: ['text'],
  })

  bs.add({ text: 'foo bar' })
  bs.add({ text: 'foo baz' })

  expect(bs.search('bar baz')).toEqual([
    { text: 'foo bar' },
    { text: 'foo baz' },
  ])
})

test('index can be loaded from a deserialised instance', () => {
  const options = {
    errorRate: 0.001,
    fields: ['text'],
    summary: ['text'],
  }
  const previous = new BloomSearch(options)
  previous.add({ text: 'previous foo' })
  const current = new BloomSearch(options)

  current.load(JSON.parse(JSON.stringify(previous.index)))
  current.add({ text: 'additional foo' })

  expect(current.search('foo')).toEqual([
    { text: 'previous foo' },
    { text: 'additional foo' },
  ])
})

test('loaded index replaces the instance index', () => {
  const options = {
    errorRate: 0.001,
    fields: ['text'],
    summary: ['text'],
  }

  const previous = new BloomSearch(options)
  previous.add({ text: 'previous' })

  const current = new BloomSearch(options)
  current.add({ text: 'replaced' })
  current.load(JSON.parse(JSON.stringify(previous.index)))

  expect(current.search('previous')).toEqual([{ text: 'previous' }])
  expect(current.search('replaced')).toEqual([])
})
