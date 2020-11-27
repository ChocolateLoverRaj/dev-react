/* global test, expect */

import Task from './task.js'

test('update', () => {
  let updateEmitted = false
  const task = new Task()
  task.emitter.once('update', () => {
    updateEmitted = true
  })
  task.update()
  expect(updateEmitted).toBe(true)
})

test('getText', () => {
  expect(new Task().getLines()).toStrictEqual([])
})
