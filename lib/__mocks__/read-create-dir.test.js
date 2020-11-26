import readDir, { _reset } from './read-create-dir.js'

afterEach(_reset)

test('spies', async () => {
  await expect(readDir('dir')).resolves.toStrictEqual([])
  expect(readDir.calledOnceWith('dir')).toBe(true)
})

test('_reset', async () => {
  await readDir('dir')
  _reset()
  expect(readDir.notCalled).toBe(true)
})
