/* global test, expect */

import TextAddon from './text.js'

test('getText', () => {
  expect(new TextAddon('text').getText()).toBe('text')
})
