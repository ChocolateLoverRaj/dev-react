/* global jest, afterEach, describe, test, expect */

jest.mock('fs/promises')
const { _mock, _files } = require('fs/promises')

const FileOutput = require('./file-output')

const once = (emitter, event) => new Promise((resolve, reject) => {
  emitter.once(event, (...args) => resolve([...args]))
})

const aTick = () => new Promise(resolve => process.nextTick(resolve))

const tickAfter = async promise => {
  await promise
  await aTick()
}

const unresolved = promise => new Promise((resolve, reject) => {
  let resolved = false
  promise.then(() => {
    resolved = true
  })
  aTick().then(() => {
    if (resolved) {
      reject(new Error('Given promise was resolved'))
    } else {
      resolve()
    }
  })
})

afterEach(() => {
  _mock.emit('reset')
})

const codeBuilder = async () => 'code'

test('write', async () => {
  const fileOutput = new FileOutput(codeBuilder, 'output')
  expect((await once(_mock, 'wrote'))[1]).toBe('code')
  await aTick()
  expect(fileOutput.buildPromise).toBe(null)
})

describe('read', () => {
  test('cache', async () => {
    const fileOutput = new FileOutput(codeBuilder, 'output')
    expect(await Promise.race([fileOutput.read(), tickAfter(fileOutput.buildPromise)])).toBe('code')
  })

  test('file', async () => {
    const fileOutput = new FileOutput(codeBuilder, 'output')
    await once(_mock, 'wrote')
    await aTick()
    const readFile = once(_mock, 'read')
    const read = fileOutput.read()
    await readFile
    expect(await read).toBe('code')
  })

  test('cache file promise', async () => {
    const fileOutput = new FileOutput(codeBuilder, 'output')
    await once(_mock, 'wrote')
    await aTick()
    const readFile = once(_mock, 'read')
    const originalRead = fileOutput.read()
    const anotherRead = fileOutput.read()
    await readFile
    const anotherReadFile = once(_mock, 'read')
    await unresolved(anotherReadFile)
    expect(await originalRead).toBe('code')
    expect(await anotherRead).toBe('code')
  })
})

describe('errors', () => {
  const recordError = fileOutput => new Promise((resolve, reject) => {
    let errorEmitted = false
    fileOutput.on('error', e => {
      errorEmitted = true
      expect(e).toMatchSnapshot()
    })
    process.nextTick(() => {
      if (!errorEmitted) {
        reject(new Error('Error event wasn\'t emitted'))
      } else {
        resolve()
      }
    })
  })

  test('build', async () => {
    const builder = async () => {
      throw new Error('no work')
    }
    const fileOutput = new FileOutput(builder, 'output')
    await recordError(fileOutput)
  })

  test('write', async () => {
    const fileOutput = new FileOutput(codeBuilder, 'output')
    _mock.emit('throw', 'output')
    await recordError(fileOutput)
  })

  test('read', async () => {
    const fileOutput = new FileOutput(codeBuilder, 'output')
    await once(_mock, 'wrote')
    await aTick()
    _mock.emit('throw', 'output')
    let err
    try {
      await fileOutput.read()
    } catch (e) {
      err = e
    }
    if (err) {
      expect(err).toMatchSnapshot()
    } else {
      throw new Error('No error thrown.')
    }
  })
})

describe('destroying', () => {
  test('build', async () => {
    const builder = async fileOutput => {
      expect(fileOutput.destroyed).toMatchSnapshot()
      await aTick()
      expect(fileOutput.destroyed).toBe(true)
    }
    const fileOutput = new FileOutput(builder, 'output')
    await fileOutput.destroy()
    await fileOutput.buildPromise
  })

  test('write', async () => {
    const fileOutput = new FileOutput(codeBuilder, 'output')
    await fileOutput.destroy()
    await unresolved(once(_mock, 'wrote'))
  })

  test('read cache', async () => {
    const fileOutput = new FileOutput(codeBuilder, 'output')
    await fileOutput.destroy()
    expect(Promise.race([fileOutput.read(), fileOutput.buildPromise])).resolves.toBe(false)
  })

  test('read file', async () => {
    const fileOutput = new FileOutput(codeBuilder, 'output')
    await once(_mock, 'wrote')
    await aTick()
    const read = fileOutput.read()
    await fileOutput.destroy()
    await unresolved(once(_mock, 'read'))
    expect(await read).toBe(false)
  })

  test('remove file', async () => {
    const fileOutput = new FileOutput(codeBuilder, 'output')
    await once(_mock, 'wrote')
    await aTick()
    expect(_files.has('output')).toBe(true)
    await fileOutput.destroy()
    expect(_files.has('output')).toBe(false)
  })
})
