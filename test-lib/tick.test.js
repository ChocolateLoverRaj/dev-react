/* global test, expect */

import tick from './tick.js'

test('with promises', async () => {
  const a = 'Promise.resolve()'
  const b = 'await tick()'
  const log = []
  Promise.resolve().then(() => {
    log.push(a)
  })
  await tick()
  log.push(b)
  expect(log).toStrictEqual([a, b])
})