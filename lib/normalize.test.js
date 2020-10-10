/* global test, expect */

import normalize from './normalize.js'

const endsWithSlash = str => str.endsWith('/') || str.endsWith('\\')

test('ending with /', () => {
  expect(endsWithSlash(normalize('c:/something//double//ok/'))).toBeFalsy()
})

test('ending with \\', () => {
  expect(endsWithSlash(normalize('c:\\something\\\\double\\\\ok\\'))).toBeFalsy()
})

test('no end trim', () => {
  const res = normalize('c:/something//double//ok')
  expect(res === 'c:/something/double/ok' || res === 'c:\\something\\double\\ok').toEqual(true)
})