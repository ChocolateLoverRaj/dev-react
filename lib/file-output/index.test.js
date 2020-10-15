/* global jest, afterEach, describe, test, expect */

jest.mock('fs/promises')

const { _files, _errorFiles, _reset, _mock, _frozen } = require('fs/promises')
const noResolve = require('./test-lib/no-resolve')
const tick = require('./test-lib/tick')

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
      const builder = async () => {
        await tick()
        return 'code'
      }
      const fileOutput = new FileOutput(outputPath)
      fileOutput.update(builder)
      await tick()
      const update2 = fileOutput.update(async () => 'new code')
      expect((await once(_mock, 'wrote'))[1]).toBe('new code')
      await noResolve(once(_mock, 'wrote'), update2)
    })

    test('mid-write', async () => {
      // TODO: still working on this
      const fileOutput = new FileOutput(outputPath)
      const update1 = fileOutput.update(codeBuilder)
      _frozen.add(outputPath)
      await fileOutput.buildPromise
      const update2 = fileOutput.update(codeBuilder)
      _mock.emit('unfreeze', outputPath)
      await update1
      // console.log(_files, fileOutput.buildPromise)
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
