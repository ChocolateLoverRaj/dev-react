/* global afterEach, test, expect */

import DisplayTask, { _reset } from './display-task.js'

afterEach(_reset)

test('constructor', () => {
  const displayTask = new DisplayTask('a')
  expect(displayTask.constructorArgs[0]).toBe('a')
})

test('close', callback => {
  const close = new DisplayTask().close()
  expect(DisplayTask.prototype.close.calledOnce).toBe(true)
  close.then(callback)
})

test('_reset', () => {
  new DisplayTask().close()
  _reset()
  expect(DisplayTask.prototype.close.notCalled).toBe(true)
})
