/* global test, expect */

import isBadDir from './is-bad-dir.js'

test('index', () => {
  expect(isBadDir('_index')).toBe(false)
})

test('common', () => {
  expect(isBadDir('_common')).toBe(false)
})

test('page', () => {
  expect(isBadDir('page')).toBe(false)
})

test('subpage', () => {
  expect(isBadDir('page subpage')).toBe(false)
})

test('bad', () => {
  expect(isBadDir('_bad')).toBe(true)
})
