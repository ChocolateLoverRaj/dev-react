/* eslint-env jest */

import getPage from './get-page.js'

test('index', () => {
  expect(getPage('_index')).toBe('/')
})

test('page', () => {
  expect(getPage('page')).toBe('/page')
})

test('subpage', () => {
  expect(getPage('page subpage')).toBe('/page/subpage')
})
