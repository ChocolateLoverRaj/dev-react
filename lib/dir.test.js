/* global test, expect */

import dirDotDot from './dir.js'

test('loop', () => {
  const path = 'a/b/c/d'
  expect(dirDotDot(0, path)).toBe('a/b/c/d')
  expect(dirDotDot(1, path)).toBe('a/b/c')
  expect(dirDotDot(2, path)).toBe('a/b')
  expect(dirDotDot(3, path)).toBe('a')
})
