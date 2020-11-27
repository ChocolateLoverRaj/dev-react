/* global test, expect, describe */

import HideTask from './hide-task.js'
import getFakeTask from '../../../test-lib/tasks/fake-task.js'
import sinon from 'sinon'

test('default hidden', () => {
  const fakeTask = getFakeTask()
  expect(new HideTask(fakeTask).hidden).toMatchSnapshot()
})

test('forwards updates', () => {
  const fakeTask = getFakeTask()
  const hideTask = new HideTask(fakeTask)
  expect(typeof fakeTask.emitter._events.update.fn).toBe('function')
  const fake = sinon.fake()
  hideTask.emitter.on('update', fake)
  fakeTask.emitter.emit('update')
  expect(fake.calledOnce).toBe(true)
})

describe('getLines', () => {
  test('shown', () => {
    const fakeTask = getFakeTask(['the', 'lines'])
    const hideTask = new HideTask(fakeTask)
    expect(hideTask.getLines()).toStrictEqual(['the', 'lines'])
  })

  test('hidden', () => {
    const fakeTask = getFakeTask(['the', 'lines'])
    const hideTask = new HideTask(fakeTask)
    hideTask.hidden = true
    expect(hideTask.getLines()).toStrictEqual([])
  })
})
