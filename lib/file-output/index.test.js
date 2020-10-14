/* global jest, afterEach, describe, test, expect */

jest.mock('fs/promises')

const { _files, _errorFiles, _reset, _mock } = require('fs/promises')
const noResolve = require('./test-lib/no-resolve')

const FileOutput = require('./index')

const { once } = require('events')

const codeBuilder = async () => 'code'
const outputPath = 'output'

afterEach(_reset)

describe('update', () => {
  test('first', async () => {
    const fileOutput = new FileOutput(outputPath)
    await fileOutput.update(codeBuilder)
    expect(_files.get(outputPath)).toBe('code')
    expect(fileOutput.buildPromise).toBe(null)
  })

  describe('overwrite', () => {
    test('mid-build', async () => {
      const fileOutput = new FileOutput(outputPath)
      fileOutput.update(codeBuilder)
      const wrotePromise = once(_mock, 'wrote')
      await fileOutput.buildPromise
      const update2 = fileOutput.update(codeBuilder)
      const wroteAgainPromise = once(_mock, 'wrote')
      expect((await wrotePromise)[1]).toBe('code')
      await noResolve(wroteAgainPromise, update2)
    })
  })
})

describe('error', () => {
  test('builder', async () => {
    const builder = async () => {
      throw new Error('A build error.')
    }
    const fileOutput = new FileOutput(outputPath)
    let threw = false
    try {
      await fileOutput.update(builder)
    } catch (e) {
      threw = true
      expect(e).toMatchSnapshot()
    }
    if (!threw) {
      throw new Error('FileOutput.prototype.update() didn\'t throw an error.')
    }
  })

  test('write', async () => {
    const fileOutput = new FileOutput(outputPath)
    _errorFiles.add(outputPath)
    await expect(fileOutput.update(codeBuilder)).rejects.toMatchSnapshot()
  })
})
