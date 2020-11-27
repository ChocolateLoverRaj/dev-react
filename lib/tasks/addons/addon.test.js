/* global test, expect */

import Addon from './addon.js'

test('update', () => {
  let updateEmitted = false
  const addon = new Addon()
  addon.emitter.once('update', () => {
    updateEmitted = true
  })
  addon.update()
  expect(updateEmitted).toBe(true)
})

test('getText', () => {
  expect(new Addon().getText()).toBe('')
})
