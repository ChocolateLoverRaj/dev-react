import fsExtra, { _reset } from './fs-extra.js'
import { setFile, Dir, NormalFile, topDir } from '../test-lib/files.js'

afterEach(_reset)

describe('remove', () => {
  test('dir', async () => {
    setFile('dir', new Dir())
    await fsExtra.remove('dir')
    expect(topDir.files.has('dir')).toBe(false)
    expect(fsExtra.remove.calledOnceWith('dir')).toBe(true)
  })

  test('file', async () => {
    setFile('file', new NormalFile())
    await fsExtra.remove('file')
    expect(topDir.files.has('file')).toBe(false)
    expect(fsExtra.remove.calledOnceWith('file')).toBe(true)
  })
})

test('_reset', async () => {
  setFile('dir', new Dir())
  await fsExtra.remove('dir')
  _reset()
  expect(fsExtra.remove.notCalled).toBe(true)
})
