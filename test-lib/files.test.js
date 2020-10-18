/* global test, expect */

const files = require('./files')

test('is a Map', () => {
  expect(Object.getPrototypeOf(files)).toBe(Map.prototype)
})
