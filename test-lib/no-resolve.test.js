/* global test, expect */

const noResolve = require('./no-resolve')

test('doesn\'t resolve', async () => {
  const testPromise = new Promise(() => undefined)
  const timeoutPromise = Promise.resolve()
  await noResolve(testPromise, timeoutPromise)
})

test('resolves', async () => {
  const testPromise = Promise.resolve()
  const timeoutPromise = Promise.resolve()
  await expect(noResolve(testPromise, timeoutPromise)).rejects.toMatchSnapshot()
})
