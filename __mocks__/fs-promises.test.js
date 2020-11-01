/* global afterEach, test, expect, describe */

import { access, writeFile, unlink, _frozen, _errorFiles, _reset, _mock } from './fs-promises.js'
import { reset, getFile, setFile, NormalFile } from '../test-lib/files.js'
import tick from '../test-lib/tick.js'
import noResolve from '../test-lib/no-resolve.js'
import { constants } from './fs'

afterEach(() => {
  reset()
})
afterEach(_reset)

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

test('writeFile', async () => {
  await writeFile('file', 'data')
  expect(getFile('file').content).toBe('data')
})

test('unlink', async () => {
  setFile('file', new NormalFile('something'))
  await unlink('file')
  expect(() => { getFile('file') }).toThrowError()
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

test('_reset', () => {
  _errorFiles.add('file')
  _reset()
  expect(_errorFiles.size).toBe(0)
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
