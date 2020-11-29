/* global afterEach, test, expect, describe */

import OutputDir from './output-dir.js'
import normalize from './normalize.js'
import { setFile, Dir, NormalFile, reset, getFile } from '../test-lib/files.js'
import tick from '../test-lib/tick.js'
import noResolve from 'no-resolve'
import readDir, { _reset } from './__mocks__/read-create-dir.js'
import fsExtra, { _reset as resetFsExtra } from '../__mocks__/fs-extra.js'
import { mkdir, rmdir, _reset as resetFsPromises } from '../__mocks__/fs-promises.js'

afterEach(() => {
  reset()
  _reset()
  resetFsExtra()
  resetFsPromises()
})

test('initial task', () => {
  const outputDir = new OutputDir('dev')
  expect(outputDir.task.getLines()).toMatchSnapshot()
})

test('empty', async () => {
  setFile('dev', new Dir())
  setFile('dev/dir', new Dir())
  setFile('dev/file', new NormalFile())
  const outputDir = new OutputDir('dev')
  let updateLines
  outputDir.task.emitter.on('update', () => {
    updateLines = outputDir.task.getLines()
  })
  outputDir.empty()
  expect(readDir.calledOnceWith('dev')).toBe(true)
  await outputDir.read
  const readLines = outputDir.task.getLines()
  expect(updateLines).toStrictEqual(readLines)
  expect(readLines).toMatchSnapshot()
  expect(fsExtra.remove.calledTwice).toBe(true)
  expect(normalize(fsExtra.remove.firstCall.firstArg)).toBe('dev/dir')
  expect(normalize(fsExtra.remove.secondCall.firstArg)).toBe('dev/file')
  await outputDir.deletePromise
  const deleteLines = outputDir.task.getLines()
  expect(updateLines).toStrictEqual(deleteLines)
  expect(deleteLines).toMatchSnapshot()
  expect(getFile('dev').files.size).toBe(0)
})

describe('createDir', () => {
  describe('before read', () => {
    test('no delete', async () => {
      setFile('dev', new Dir())
      setFile('dev/page', new Dir())
      const outputDir = new OutputDir('dev')
      outputDir.empty()
      await outputDir.createDir('page')
      expect(fsExtra.remove.notCalled).toBe(true)
    })

    test('file to dir', async () => {
      setFile('dev', new Dir())
      setFile('dev/page', new NormalFile())
      const outputDir = new OutputDir('dev')
      outputDir.empty()
      await outputDir.createDir('page')
      expect(fsExtra.remove.calledOnce).toBe(true)
      expect(normalize(fsExtra.remove.firstCall.firstArg)).toBe('dev/page')
      expect(mkdir.calledOnce).toBe(true)
      expect(normalize(mkdir.firstCall.firstArg)).toBe('dev/page')
    })

    test('create dir', async () => {
      setFile('dev', new Dir())
      const outputDir = new OutputDir('dev')
      outputDir.empty()
      await outputDir.createDir('page')
      expect(mkdir.calledOnce).toBe(true)
      expect(normalize(mkdir.firstCall.firstArg)).toBe('dev/page')
    })
  })

  describe('after read', () => {
    test('deletes, then creates', async () => {
      setFile('dev', new Dir())
      setFile('dev/page', new Dir())
      const outputDir = new OutputDir('dev')
      outputDir.empty()
      await outputDir.read
      await outputDir.createDir('page')
      expect(fsExtra.remove.calledOnce).toBe(true)
      expect(mkdir.calledAfter(fsExtra.remove)).toBe(true)
      expect(mkdir.calledOnce).toBe(true)
      expect(normalize(mkdir.firstCall.firstArg)).toBe('dev/page')
    })

    test('creates', async () => {
      setFile('dev', new Dir())
      const outputDir = new OutputDir('dev')
      outputDir.empty()
      await outputDir.read
      await outputDir.createDir('page')
      expect(mkdir.calledOnce).toBe(true)
      expect(normalize(mkdir.firstCall.firstArg)).toBe('dev/page')
    })
  })
})

describe('removeDir', () => {
  describe('before read', () => {
    test('after creating', async () => {
      setFile('dev', new Dir())
      const outputDir = new OutputDir('dev')
      outputDir.empty()
      outputDir.createDir('page')
      await outputDir.removeDir('page')
      expect(fsExtra.remove.notCalled).toBe(true)
      expect(mkdir.notCalled).toBe(true)
    })

    test('without creating', async () => {
      setFile('dev', new Dir())
      setFile('dev/page', new Dir())
      const outputDir = new OutputDir('dev')
      outputDir.empty()
      await outputDir.removeDir('page')
      expect(fsExtra.remove.calledOnce).toBe(true)
      expect(normalize(fsExtra.remove.firstCall.firstArg)).toBe('dev/page')
    })
  })

  describe('after read', () => {
    test('already deleting', async () => {
      setFile('dev', new Dir())
      setFile('dev/page', new Dir())
      const outputDir = new OutputDir('dev')
      outputDir.empty()
      await outputDir.read
      await outputDir.removeDir('page')
      expect(fsExtra.remove.calledOnce).toBe(true)
    })

    test('delete', async () => {
      setFile('dev', new Dir())
      const outputDir = new OutputDir('dev')
      outputDir.empty()
      await outputDir.read
      await outputDir.createDir('page')
      await outputDir.removeDir('page')
      expect(fsExtra.remove.notCalled).toBe(true)
      expect(rmdir.calledOnce).toBe(true)
      expect(normalize(rmdir.firstCall.firstArg)).toBe('dev/page')
    })
  })
})

test('destroy', async () => {
  const outputDir = new OutputDir('dev')
  let linesUpdate
  outputDir.task.emitter.on('update', () => {
    linesUpdate = outputDir.task.getLines()
  })
  outputDir.empty()
  await outputDir.destroy()
  await noResolve(tick(), Promise.all([outputDir.read, outputDir.deletePromise]))
  const lines = outputDir.task.getLines()
  expect(linesUpdate).toStrictEqual(lines)
  expect(lines).toMatchSnapshot()
})
