/* global test, expect */

import DevReact from './index.js'

test('constructor', () => {
  const devReact = new DevReact()
  expect(devReact).toBeInstanceOf(DevReact)
})

test('no new', () => {
  expect(() => {
    devReact()
  }).toThrow()
})
