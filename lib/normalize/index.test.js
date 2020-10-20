/* global test, expect */

import normalize from './index.js'

test('convert backslashes', () => {
  expect(normalize('a\\b\\c\\d')).toBe('a/b/c/d')
})

test('multiple slashes', () => {
  expect(normalize('a//b///c////d')).toBe('a/b/c/d')
})

test('dot slash', () => {
  expect(normalize('a/./b/c/./d')).toBe('a/b/c/d')
})

test('dot dot slash', () => {
  expect(normalize('a/../b/c/../d')).toBe('b/d')
})

test('trailing slashes', () => {
  expect(normalize('a/b/c/d/')).toBe('a/b/c/d')
})
