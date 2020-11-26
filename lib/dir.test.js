import Dir from './dir.js'
import normalize from './normalize.js'
import tick from '../test-lib/tick.js'
import chokidar, { _reset, _failClose } from '../__mocks__/chokidar.js'
import sinon from 'sinon'

const fakeOutputDir = (rejectCreateDir = false, rejectRemoveDir = false) => ({
  createDir: sinon.spy(() => rejectCreateDir ? Promise.reject() : Promise.resolve()),
  removeDir: sinon.spy(() => rejectRemoveDir ? Promise.reject() : Promise.resolve())
})

afterEach(_reset)

describe('constructor', () => {
  test('initial task', () => {
    const dir = new Dir(fakeOutputDir(), 'pages', 'page')
    expect(dir.task.getLines()).toMatchSnapshot()
  })

  describe('createDir', () => {
    test('success', async () => {
      const fake = fakeOutputDir()
      const dir = new Dir(fake, 'pages', 'page')
      let updateLines
      dir.task.emitter.on('update', () => {
        updateLines = dir.task.getLines()
      })
      expect(fake.createDir.calledOnceWith('page')).toBe(true)
      await fake.createDir.firstCall.returnValue
      await tick()
      const newLines = dir.task.getLines()
      expect(updateLines).toStrictEqual(newLines)
      expect(newLines).toMatchSnapshot()
    })

    test('fail', async () => {
      const fake = fakeOutputDir(true)
      const dir = new Dir(fake, 'pages', 'page')
      let updateLines
      dir.task.emitter.on('update', () => {
        updateLines = dir.task.getLines()
      })
      expect(fake.createDir.calledOnceWith('page')).toBe(true)
      await fake.createDir.firstCall.returnValue.catch(() => { })
      await tick()
      const newLines = dir.task.getLines()
      expect(updateLines).toStrictEqual(newLines)
      expect(newLines).toMatchSnapshot()
    })
  })

  test('watches chokidar', () => {
    new Dir(fakeOutputDir(), 'pages', 'page')
    expect(chokidar.watch.calledOnce).toBe(true)
    expect(normalize(chokidar.watch.firstCall.firstArg)).toBe('pages/page')
  })
})

describe('destroy', () => {
  test('initial task', async () => {
    const dir = new Dir(fakeOutputDir(), 'pages', 'page')
    const destroy = dir.destroy()
    expect(dir.task.getLines()).toMatchSnapshot()
    await destroy
  })

  test('all success', async () => {
    const fake = fakeOutputDir()
    const dir = new Dir(fake, 'pages', 'page')
    let updateLines
    dir.task.emitter.on('update', () => {
      updateLines = dir.task.getLines()
    })
    await dir.destroy()
    expect(fake.removeDir.calledOnceWith('page')).toBe(true)
    const newLines = dir.task.getLines()
    expect(updateLines).toStrictEqual(newLines)
    expect(newLines).toMatchSnapshot()
  })

  test('removeDir fail', async () => {
    const fake = fakeOutputDir(undefined, true)
    const dir = new Dir(fake, 'pages', 'page')
    let updateLines
    dir.task.emitter.on('update', () => {
      updateLines = dir.task.getLines()
    })
    await dir.destroy().catch(() => { })
    expect(fake.removeDir.calledOnceWith('page')).toBe(true)
    const newLines = dir.task.getLines()
    expect(updateLines).toStrictEqual(newLines)
    expect(newLines).toMatchSnapshot()
  })

  test('close chokidar fail', async () => {
    _failClose()
    const fake = fakeOutputDir()
    const dir = new Dir(fake, 'pages', 'page')
    let updateLines
    dir.task.emitter.on('update', () => {
      updateLines = dir.task.getLines()
    })
    await dir.destroy()
    expect(fake.removeDir.calledOnceWith('page')).toBe(true)
    const newLines = dir.task.getLines()
    expect(updateLines).toStrictEqual(newLines)
    expect(newLines).toMatchSnapshot()
  })
})
