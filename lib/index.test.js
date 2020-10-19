/* global test */

import DevReact from './index.js'

test('constructor', () => {
  const devReact = new DevReact()
  expect(devReact).toBeInstanceOf(DevReact)
})
