/* global jest, test */

import { writeFile, unlink, _frozen, _errorFiles, _reset, _mock } from 'fs/promises'
import files from '../files/index.js'
import tick from '../tick/index.js'
import noResolve from '../no-resolve/index.js'

jest.mock('fs/promises')

afterEach(() => {
  files.clear()
})
afterEach(_reset)

test('writeFile', async () => {
  await writeFile('file', 'data')
  expect(files.get('file')).toBe('data')
})

test('unlink', async () => {
  files.set('file', 'something')
  await unlink('file')
  expect(files.has('file')).toBe(false)
})

test('freezing', async () => {
  _frozen.add('file')
  const freezePromise = (async () => {
    await tick()
    _mock.emit('unfreeze', 'file')
  })()
  await noResolve(writeFile('file', 'data'), freezePromise)
  expect(files.get('file')).toBe('data')
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
