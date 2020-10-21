/* global afterEach, describe, test, expect */

import { File, NormalFile, Dir, topDir, getFile, reset } from './index.js'

afterEach(reset)

describe('inheritance', () => {
  test('File', () => {
    const file = new File()
    expect(file).toBeInstanceOf(File)
    expect(file).not.toBeInstanceOf(NormalFile)
    expect(file).not.toBeInstanceOf(Dir)
  })

  test('NormalFile', () => {
    const file = new NormalFile('content')
    expect(file).toBeInstanceOf(File)
    expect(file).toBeInstanceOf(NormalFile)
    expect(file).not.toBeInstanceOf(Dir)
  })

  test('Dir', () => {
    const file = new Dir()
    expect(file).toBeInstanceOf(File)
    expect(file).not.toBeInstanceOf(NormalFile)
    expect(file).toBeInstanceOf(Dir)
  })
})

const testFiles = (createFile) => {
  function topLevel () {
    const file = createFile()
    topDir.files.set('file', file)
    expect(getFile('file')).toBe(file)
  }
  function subDir () {
    const file = createFile()
    const dir = new Dir()
    dir.files.set('file', file)
    topDir.files.set('dir', dir)
    expect(getFile('dir/file')).toBe(file)
  }
  function subSubDir () {
    const file = createFile()
    const subDir = new Dir()
    subDir.files.set('file', file)
    const dir = new Dir()
    dir.files.set('subDir', subDir)
    topDir.files.set('dir', dir)
    expect(getFile('dir/subDir/file')).toBe(file)
  }
  topLevel()
  subDir()
  subSubDir()
}

describe('getFile', () => {
  describe('nonexistent file', () => {
    test('in topDir', () => {
      expect(() => {
        getFile('file')
      }).toThrowErrorMatchingSnapshot()
    })

    test('in subDir', () => {
      topDir.files.set('dir', new Dir())
      expect(() => {
        getFile('dir/file')
      }).toThrowErrorMatchingSnapshot()
    })

    test('in nonexistent subDir', () => {
      expect(() => {
        getFile('dir/file')
      }).toThrowErrorMatchingSnapshot()
    })
  })

  test('get NormalFile', () => {
    testFiles(() => new NormalFile('hi'))
  })

  test('get Dir', () => {
    testFiles(() => new Dir())
  })
})
