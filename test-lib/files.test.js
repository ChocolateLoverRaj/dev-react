/* global test, expect */

import files from './files.js'

test('is a Map', () => {
  expect(Object.getPrototypeOf(files)).toBe(Map.prototype)
})
