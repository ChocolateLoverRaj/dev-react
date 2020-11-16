import chokidar, { FSWatcher, _reset } from './chokidar.js'

afterEach(_reset)

test('chokidar.watch', () => {
  const args = ['a', 'b']
  chokidar.watch(...args)
  expect(chokidar.watch.calledOnceWith(...args)).toBe(true)
})

test('FSWatcher.prototype.close', () => {
  const args = ['a', 'b']
  const watcher = chokidar.watch()
  watcher.close(...args)
  expect(FSWatcher.prototype.close.calledOnceWith(...args)).toBe(true)
})
