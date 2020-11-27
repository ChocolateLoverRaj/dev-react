/* global afterEach, test, expect */

import DisplayTask from './display-task.js'
import getFakeTask from '../../test-lib/tasks/fake-task.js'
import Display, { _reset } from './__mocks__/display.js'
import noResolve from '../../test-lib/no-resolve.js'

afterEach(_reset)

test('constructor', async () => {
  const task = getFakeTask(['some', 'lines'])
  const display = new DisplayTask(task)
  expect(task.emitter._events.update.fn).toBe(display.updateHandler)
  expect(process.stdout._events.resize).toBe(display.updateHandler)
  expect(Display.prototype.update.calledOnceWith(['some', 'lines'])).toBe(true)
  Display.prototype.update.resetHistory()
  display.updateHandler()
  expect(Display.prototype.update.calledOnceWith(['some', 'lines'])).toBe(true)
  await display.close()
})

test('close', async () => {
  const task = getFakeTask(['some', 'lines'])
  const display = new DisplayTask(task)
  const close = display.close()
  expect(task.emitter._events.update).toBe(undefined)
  expect(process.stdout._events.resize).toBe(undefined)
  expect(Display.prototype.close.calledOnce).toBe(true)
  await noResolve(close, Display.prototype.close.getCall(0).returnValue)
})
