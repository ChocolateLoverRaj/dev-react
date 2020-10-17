/* global jest, afterEach, describe, test, expect */

jest.mock('fs/promises')
jest.mock('fs')

const { _errorFiles, _reset: _fsPromisesReset, _mock, _frozen } = require('fs/promises')
const { _readStreamErrorFiles, _reset: _fsReset } = require('fs')
const files = require('../../test-lib/files')
const noResolve = require('../../test-lib/no-resolve')
const tick = require('../../test-lib/tick')
const chunks = require('../../test-lib/chunks')
const unsafeOnce = require('../../test-lib/unsafe-once')

const FileOutput = require('./index')

const { once } = require('events')

const codeBuilder = async () => 'code'
const newCodeBuilder = async () => 'new code'
const errorBuilder = async () => {
  throw new Error('A build error.')
}
const outputPath = 'output'

afterEach(_fsPromisesReset)
afterEach(_fsReset)

describe('update', () => {
  test('write', async () => {
    const fileOutput = new FileOutput(outputPath)
    await fileOutput.update(codeBuilder)
    expect(files.get(outputPath)).toBe('code')
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
      const update2 = fileOutput.update(newCodeBuilder)
      expect((await once(_mock, 'wrote'))[1]).toBe('new code')
      await noResolve(once(_mock, 'wrote'), update2)
    })

    test('mid-write', async () => {
      const fileOutput = new FileOutput(outputPath)
      const update1 = fileOutput.update(codeBuilder)
      _frozen.add(outputPath)
      await fileOutput.buildPromise
      const update2 = fileOutput.update(async () => {
        await tick()
        return 'new code'
      })
      _mock.emit('unfreeze', outputPath)
      await update1
      expect(files.get(outputPath)).toBe('code')
      expect(fileOutput.buildPromise).not.toBe(null)
      await update2
      expect(files.get(outputPath)).toBe('new code')
      expect(fileOutput.buildPromise).toBe(null)
    })
  })
})

describe('read', () => {
  const newCodeArray = ['new code']
  test('file stream no destroy', async () => {
    const fileOutput = new FileOutput(outputPath)
    await fileOutput.update(codeBuilder)
    expect(await chunks(fileOutput.read())).toStrictEqual(['c', 'o', 'd', 'e'])
  })

  describe('build', () => {
    test('promise', async () => {
      const fileOutput = new FileOutput(outputPath)
      fileOutput.update(codeBuilder)
      expect(await chunks(fileOutput.read())).toStrictEqual(['code'])
    })

    test('overwrite promise', async () => {
      const fileOutput = new FileOutput('2')
      fileOutput.update(codeBuilder)
      const readStream = fileOutput.read()
      fileOutput.update(newCodeBuilder)
      expect(await chunks(readStream)).toStrictEqual(newCodeArray)
    })
  })

  describe('file stream destroy', () => {
    test('pre-stream', async () => {
      const fileOutput = new FileOutput(outputPath)
      await fileOutput.update(codeBuilder)
      const fileChunks = chunks(fileOutput.read())
      fileOutput.update(newCodeBuilder)
      expect(await fileChunks).toStrictEqual(newCodeArray)
    })

    test('mid-stream', async () => {
      const fileOutput = new FileOutput(outputPath)
      await fileOutput.update(codeBuilder)
      const stream = fileOutput.read()
      expect((await once(stream, 'data'))[0]).toBe('c')
      const update2 = fileOutput.update(newCodeBuilder)
      const errorEvent = once(stream, 'error')
      await noResolve(unsafeOnce(stream, 'data'), errorEvent)
      expect((await errorEvent)[0]).toBeInstanceOf(FileOutput.OutdatedError)
      await update2
      expect(await chunks(fileOutput.read())).toStrictEqual(['n', 'e', 'w', ' ', 'c', 'o', 'd', 'e'])
    })
  })
})

describe('errors', () => {
  describe('update', () => {
    test('builder', async () => {
      const fileOutput = new FileOutput(outputPath)
      await expect(fileOutput.update(errorBuilder)).rejects.toMatchSnapshot()
    })

    test('write', async () => {
      const fileOutput = new FileOutput(outputPath)
      _errorFiles.add(outputPath)
      await expect(fileOutput.update(codeBuilder)).rejects.toMatchSnapshot()
    })
  })

  describe('read', () => {
    describe('from build promise', () => {
      test('no overwrite', async () => {
        const fileOutput = new FileOutput(outputPath)
        fileOutput.update(errorBuilder).catch(() => { })
        await expect(chunks(fileOutput.read())).rejects.toMatchSnapshot()
      })

      test('overwrite', async () => {
        const fileOutput = new FileOutput(outputPath)
        fileOutput.update(codeBuilder)
        const readChunks = chunks(fileOutput.read())
        fileOutput.update(errorBuilder).catch(() => { })
        await expect(readChunks).rejects.toMatchSnapshot()
      })
    })

    describe('from read stream', () => {
      test('no overwrite', async () => {
        const fileOutput = new FileOutput(outputPath)
        await fileOutput.update(codeBuilder)
        _readStreamErrorFiles.add(outputPath)
        await expect(chunks(fileOutput.read())).rejects.toMatchSnapshot()
      })

      test('overwrite', async () => {
        const fileOutput = new FileOutput(outputPath)
        await fileOutput.update(codeBuilder)
        const streamChunks = chunks(fileOutput.read())
        fileOutput.update(errorBuilder).catch(() => { })
        await expect(streamChunks).rejects.toMatchSnapshot()
      })
    })
  })
})
