import readDir from './read-create-dir.js'
import { setFile, getFile, Dir, NormalFile, reset } from '../test-lib/files.js'

afterEach(reset)

test('read', async () => {
  setFile('dir', new Dir())
  setFile('dir/subDir', new Dir())
  setFile('dir/file2.txt', new NormalFile())
  await expect(readDir('dir')).resolves.toStrictEqual(['subDir', 'file2.txt'])
})

test('create', async () => {
  await expect(readDir('dir')).resolves.toStrictEqual([])
  expect(getFile('dir')).toBeInstanceOf(Dir)
})

test('file types', async () => {
  setFile('dir', new Dir())
  setFile('dir/subDir', new Dir())
  setFile('dir/file2.txt', new NormalFile())
  const dir = await readDir('dir', { withFileTypes: true })
  expect(dir[0].name).toBe('subDir')
  expect(dir[0].isDirectory()).toBe(true)
  expect(dir[1].name).toBe('file2.txt')
  expect(dir[1].isDirectory()).toBe(false)
})
