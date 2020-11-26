import chokidar, { FSWatcher, _reset } from './chokidar.js'

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

test('_reset', async () => {
  await chokidar.watch().close()
  _reset()
  expect(FSWatcher.prototype.close.notCalled).toBe(true)
  expect(chokidar.watch.notCalled).toBe(true)
})
