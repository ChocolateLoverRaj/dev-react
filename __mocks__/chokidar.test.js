/* eslint-env jest */

import chokidar, { FSWatcher, _reset, _failClose } from './chokidar.js'

afterEach(_reset)

test('chokidar.watch', () => {
  const args = ['a', 'b']
  chokidar.watch(...args)
  expect(chokidar.watch.calledOnceWith(...args)).toBe(true)
})

test('FSWatcher.prototype.close', async () => {
  const watcher = chokidar.watch()
  await watcher.close()
  expect(FSWatcher.prototype.close.calledOnce).toBe(true)
})

test('_failClose', async () => {
  _failClose()
  const watcher = chokidar.watch()
  await expect(watcher.close()).rejects.toMatchSnapshot()
})

test('_reset', async () => {
  await chokidar.watch().close()
  _failClose()
  _reset()
  expect(FSWatcher.prototype.close.notCalled).toBe(true)
  expect(chokidar.watch.notCalled).toBe(true)
  await chokidar.watch().close()
})
