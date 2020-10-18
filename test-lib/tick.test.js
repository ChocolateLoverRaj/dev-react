/* global test, expect */

const tick = require('./tick')

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
