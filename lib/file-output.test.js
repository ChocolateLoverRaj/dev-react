/* global afterEach, describe, test, expect */
import FileOutput from './file-output.js'

import * as fsPromises from 'fs/promises'
import * as fs from 'fs'
import { getFile } from '../test-lib/files.js'
import noResolve from '../test-lib/no-resolve.js'
import tick from '../test-lib/tick.js'
import chunks from '../test-lib/chunks.js'
import unsafeOnce from '../test-lib/unsafe-once.js'

import { once } from 'events'

const codeBuilder = async () => 'code'
const newCodeBuilder = async () => 'new code'
const errorBuilder = async () => {
  throw new Error('A build error.')
}
const outputPath = 'output'

afterEach(fsPromises._reset)
afterEach(fs._reset)

describe('static', () => {
  test('OutdatedError', () => {
    expect(new FileOutput.OutdatedError()).toMatchSnapshot()
  })

  test('DestroyedError', () => {
    expect(new FileOutput.DestroyedError()).toMatchSnapshot()
  })
})

describe('update', () => {
  describe('canceling', () => {
    test('overwrite', async () => {
      const fileOutput = new FileOutput(outputPath)
      let canceled = false
      fileOutput.update(async emitter => {
        emitter.once('cancel', () => {
          canceled = true
        })
        await noResolve(tick(), once(emitter, 'cancel'))
      })
      const update2 = fileOutput.update(codeBuilder)
      expect(canceled).toBe(true)
      await update2
    })

    test('destroy', async () => {
      const fileOutput = new FileOutput(outputPath)
      let canceled = false
      fileOutput.update(async emitter => {
        emitter.once('cancel', () => {
          canceled = true
        })
        await noResolve(tick(), once(emitter, 'cancel'))
      })
      const destroyPromise = fileOutput.destroy()
      expect(canceled).toBe(true)
      await destroyPromise
    })
  })

  test('write', async () => {
    const fileOutput = new FileOutput(outputPath)
    await fileOutput.update(codeBuilder)
    expect(getFile(outputPath).content).toBe('code')
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
      expect((await once(fsPromises._mock, 'wrote'))[1]).toBe('new code')
      await noResolve(once(fsPromises._mock, 'wrote'), update2)
    })

    test('mid-write', async () => {
      const fileOutput = new FileOutput(outputPath)
      const update1 = fileOutput.update(codeBuilder)
      fsPromises._frozen.add(outputPath)
      await fileOutput.buildPromise
      const update2 = fileOutput.update(async () => {
        await tick()
        return 'new code'
      })
      fsPromises._mock.emit('unfreeze', outputPath)
      await update1
      expect(getFile(outputPath).content).toBe('code')
      expect(fileOutput.buildPromise).not.toBe(null)
      await update2
      expect(getFile(outputPath).content).toBe('new code')
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

  describe('destroy FileOutput instance', () => {
    test('pre-stream', async () => {
      const fileOutput = new FileOutput(outputPath)
      await fileOutput.update(codeBuilder)
      const stream = fileOutput.read()
      const destroyPromise = fileOutput.destroy()
      const errorEvent = once(stream, 'error')
      await noResolve(unsafeOnce(stream, 'data'), errorEvent)
      expect((await errorEvent)[0]).toBeInstanceOf(FileOutput.DestroyedError)
      await destroyPromise
    })

    test('mid-stream', async () => {
      const fileOutput = new FileOutput(outputPath)
      await fileOutput.update(codeBuilder)
      const stream = fileOutput.read()
      expect((await once(stream, 'data'))[0]).toBe('c')
      const destroyPromise = fileOutput.destroy()
      const errorEvent = once(stream, 'error')
      await noResolve(unsafeOnce(stream, 'data'), errorEvent)
      expect((await errorEvent)[0]).toBeInstanceOf(FileOutput.DestroyedError)
      await destroyPromise
    })
  })
})

describe('destroy', () => {
  test('no errors', async () => {
    const fileOutput = new FileOutput(outputPath)
    await fileOutput.update(codeBuilder)
    getFile(outputPath)
    await fileOutput.destroy()
    expect(() => {
      getFile(outputPath)
    }).toThrowError()
  })

  test('ENOENT', async () => {
    const fileOutput = new FileOutput(outputPath)
    await fileOutput.destroy()
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
      fsPromises._errorFiles.add(outputPath)
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
        fs._readStreamErrorFiles.add(outputPath)
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

  test('destroy', async () => {
    const fileOutput = new FileOutput(outputPath)
    fsPromises._errorFiles.add(outputPath)
    await expect(fileOutput.destroy()).rejects.toMatchSnapshot()
  })
})
