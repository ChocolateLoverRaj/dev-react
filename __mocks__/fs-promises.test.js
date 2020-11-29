/* global afterEach, test, expect, describe */

import {
  access,
  stat,
  writeFile,
  unlink,
  readdir,
  mkdir,
  rmdir,
  _frozen,
  _errorFiles,
  _reset,
  _mock
} from './fs-promises.js'
import { reset, getFile, setFile, NormalFile, Dir, topDir } from '../test-lib/files.js'
import tick from '../test-lib/tick.js'
import noResolve from 'no-resolve'
import { constants } from './fs'

afterEach(() => {
  reset()
  _reset()
})

describe('access', () => {
  test('ENOENT', async () => {
    await expect(access('file')).rejects.toMatchSnapshot()
  })

  test('Read Only', async () => {
    const file = new NormalFile('hi')
    file.canWrite = false
    setFile('file', file)
    await access('file', constants.R_OK)
  })

  test('Read and Write', async () => {
    const file = new NormalFile('hi')
    file.canWrite = false
    setFile('file', file)
    await expect(access(file, constants.R_OK | constants.W_OK)).rejects.toMatchSnapshot()
  })
})

describe('stat', () => {
  test('ENOENT', async () => {
    expect(stat('file')).rejects.toMatchSnapshot()
  })

  test('EACCES', async () => {
    const dir = new Dir()
    dir.canRead = false
    setFile('dir', dir)
    expect(stat('dir')).rejects.toMatchSnapshot()
  })

  test('file', async () => {
    setFile('file', new NormalFile('hi'))
    expect((await stat('file')).isDirectory()).toBe(false)
  })

  test('dir', async () => {
    setFile('dir', new Dir())
    expect((await stat('dir')).isDirectory()).toBe(true)
  })
})

test('writeFile', async () => {
  await writeFile('file', 'data')
  expect(getFile('file').content).toBe('data')
})

test('unlink', async () => {
  setFile('file', new NormalFile('something'))
  await unlink('file')
  expect(() => { getFile('file') }).toThrowError()
})

describe('readdir', () => {
  test('normal', async () => {
    setFile('dir', new Dir())
    setFile('dir/subDir', new Dir())
    setFile('dir/file.txt', new NormalFile())
    await expect(readdir('dir')).resolves.toStrictEqual(['subDir', 'file.txt'])
  })

  test('file types', async () => {
    setFile('dir', new Dir())
    setFile('dir/subDir', new Dir())
    setFile('dir/file.txt', new NormalFile())
    const files = await readdir('dir', { withFileTypes: true })
    expect(files[0].name).toBe('subDir')
    expect(files[0].isDirectory()).toBe(true)
    expect(files[1].name).toBe('file.txt')
    expect(files[1].isDirectory()).toBe(false)
  })
})

test('mkdir', async () => {
  await mkdir('dir')
  expect(getFile('dir')).toBeInstanceOf(Dir)
  expect(mkdir.calledOnceWith('dir')).toBe(true)
})

test('rmdir', async () => {
  setFile('dir', new Dir())
  await rmdir('dir')
  expect(topDir.files.has('dir')).toBe(false)
  expect(rmdir.calledOnceWith('dir')).toBe(true)
})

test('freezing', async () => {
  _frozen.add('file')
  const freezePromise = (async () => {
    await tick()
    _mock.emit('unfreeze', 'file')
  })()
  await noResolve(writeFile('file', 'data'), freezePromise)
  expect(getFile('file').content).toBe('data')
})

describe('_errorFiles', () => {
  test('writeFile', async () => {
    _errorFiles.add('file')
    await expect(writeFile('file')).rejects.toMatchSnapshot()
  })

  test('unlink', async () => {
    _errorFiles.add('file')
    await expect(unlink('file')).rejects.toMatchSnapshot()
  })
})

test('_reset', async () => {
  _errorFiles.add('file')
  _frozen.add('file')
  await mkdir('dir')
  await rmdir('dir')
  _reset()
  expect(_errorFiles.size).toBe(0)
  expect(_frozen.size).toBe(0)
  expect(mkdir.notCalled).toBe(true)
  expect(rmdir.notCalled).toBe(true)
})

test('ENOENT', async () => {
  let threw = false
  try {
    await unlink('file')
  } catch (e) {
    threw = true
    expect(e.code).toBe('ENOENT')
    expect(e).toMatchSnapshot()
  }
  if (!threw) {
    throw new Error('Unlink did not throw')
  }
})
