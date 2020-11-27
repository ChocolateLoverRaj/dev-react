/* global afterEach, test, expect */

import normalize, { _reset } from './normalize.js'

afterEach(_reset)

test('sinon spy', () => {
  const arg = 'a//b'
  normalize(arg)
  expect(normalize.calledOnceWith(arg)).toBe(true)
})
