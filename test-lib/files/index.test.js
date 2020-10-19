/* global test, expect */

import files from './index.js'

test('is a Map', () => {
  expect(Object.getPrototypeOf(files)).toBe(Map.prototype)
})
