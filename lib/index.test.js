/* eslint-env jest */

import DevReact from './index.js'
import { setFile, Dir, reset, NormalFile } from '../test-lib/files.js'
import normalize, { _reset as resetNormalize } from './__mocks__/normalize.js'
import OutputDir, { _reset as resetOutputDir } from './__mocks__/output-dir.js'
import Dirs, { _reset as resetDirs } from './__mocks__/dirs.js'
import DisplayTask, { _reset as resetDisplayTask } from '../test-lib/mock-display-task/display-task.js'
import chokidar, { FSWatcher, _failClose, _reset as resetChokidar } from '../__mocks__/chokidar.js'
import request from 'supertest'

afterEach(() => {
  reset()
  resetNormalize()
  resetOutputDir()
  resetDirs()
  resetDisplayTask()
  resetChokidar()
})

const getDev = () => {
  setFile('pages', new Dir())
  return new DevReact({ inputDir: 'pages', outputDir: 'dev' })
}

describe('constructor', () => {
  test('calls normalize.js', () => {
    const dev = new DevReact({ inputDir: 'dir//a', outputDir: 'dir//b' })
    expect(normalize.calledTwice).toBe(true)
    expect(normalize.firstCall.calledWith('dir//a')).toBe(true)
    expect(dev.inputDir).toBe(normalize.firstCall.returnValue)
    expect(normalize.secondCall.calledWith('dir//b')).toBe(true)
    expect(dev.outputDir).toBe(normalize.secondCall.returnValue)
  })

  test('task', () => {
    const dev = getDev()
    expect(dev.task.tasks).toStrictEqual([
      dev.emptyDir.task,
      dev.dirs.task,
      dev.closeChokidar,
      dev.warningsBadDir,
      dev.warningsUnrecognized
    ])
  })

  test('server', async () => {
    const dev = getDev()
    expect((await request(dev.server)
      .get('/')
    ).notFound).toBe(true)
  })
})

describe('start', () => {
  test('tasks', async () => {
    const dev = getDev()
    await dev.start()
    expect(dev.closeChokidar.getLines()).toStrictEqual([])
    expect(dev.warningsBadDir.getLines()).toStrictEqual([])
    expect(dev.warningsUnrecognized.getLines()).toStrictEqual([])
  })

  test('Creates DisplayTask', async () => {
    const dev = getDev()
    await dev.start()
    expect(dev.displayTask.constructorArgs[0]).toBe(dev.task)
  })

  describe('checks inputDir', () => {
    test('ENOENT', async () => {
      const dev = new DevReact({ inputDir: 'pages', outputDir: 'dev' })
      await expect(dev.start()).rejects.toMatchSnapshot()
    })

    test('EACCES', async () => {
      const dir = new Dir()
      dir.canRead = false
      setFile('pages', dir)
      const dev = new DevReact({ inputDir: 'pages', outputDir: 'dev' })
      await expect(dev.start()).rejects.toMatchSnapshot()
    })

    test('not dir', async () => {
      const file = new NormalFile()
      setFile('pages', file)
      const dev = new DevReact({ inputDir: 'pages', outputDir: 'dev' })
      await expect(dev.start()).rejects.toMatchSnapshot()
    })
  })

  test('calls empty', async () => {
    const dev = getDev()
    await dev.start()
    expect(OutputDir.prototype.empty.calledOnce).toBe(true)
  })

  describe('watches', () => {
    test('watches inputDir', async () => {
      const dev = getDev()
      await dev.start()
      expect(chokidar.watch.calledOnceWith('pages', { depth: 0 })).toBe(true)
    })

    describe('addDir', () => {
      test('top dir', async () => {
        const dev = getDev()
        await dev.start()
        dev.chokidar.emit('addDir', 'pages')
        expect(dev.dirs.size).toBe(0)
      })

      test('_common', async () => {
        const dev = getDev()
        await dev.start()
        dev.chokidar.emit('addDir', 'pages/_common')
        expect(dev.dirs.size).toBe(0)
      })

      test('bad dir', async () => {
        const dev = getDev()
        await dev.start()
        dev.chokidar.emit('addDir', 'pages/_bad')
        expect(dev.warningsBadDir.getLines()).toMatchSnapshot()
      })

      test('adds dir', async () => {
        const dev = getDev()
        await dev.start()
        dev.chokidar.emit('addDir', 'pages/_index')
        expect(Dirs.prototype.set.calledOnceWith('_index')).toBe(true)
      })
    })

    describe('unlinkDir', () => {
      test('_common', async () => {
        const dev = getDev()
        await dev.start()
        dev.chokidar.emit('unlinkDir', 'pages/_common')
      })

      test('bad dir', async () => {
        const dev = getDev()
        await dev.start()
        dev.chokidar.emit('addDir', 'pages/_bad')
        dev.chokidar.emit('unlinkDir', 'pages/_bad')
        expect(dev.warningsBadDir.getLines()).toStrictEqual([])
      })

      test('removes dir', async () => {
        const dev = getDev()
        await dev.start()
        dev.chokidar.emit('addDir', 'pages/page')
        dev.chokidar.emit('unlinkDir', 'pages/page')
        expect(Dirs.prototype.delete.calledOnceWith('page')).toBe(true)
      })
    })

    test('add', async () => {
      const dev = getDev()
      await dev.start()
      dev.chokidar.emit('add', 'pages/file')
      expect(dev.warningsUnrecognized.getLines()).toMatchSnapshot()
    })

    test('unlink', async () => {
      const dev = getDev()
      await dev.start()
      dev.chokidar.emit('add', 'pages/file')
      dev.chokidar.emit('unlink', 'pages/file')
      expect(dev.warningsUnrecognized.getLines()).toStrictEqual([])
    })
  })
})

describe('stop', () => {
  describe('close chokidar', () => {
    test('shows task', async () => {
      const dev = getDev()
      await dev.start()
      const stop = dev.stop()
      expect(dev.closeChokidar.getLines()).toMatchSnapshot()
      await stop
    })

    test('complete', async () => {
      const dev = getDev()
      await dev.start()
      await dev.stop()
      expect(FSWatcher.prototype.close.calledOnce).toBe(true)
      expect(dev.closeChokidar.getLines()).toMatchSnapshot()
    })

    test('failed', async () => {
      const dev = getDev()
      await dev.start()
      _failClose()
      await dev.stop()
      expect(FSWatcher.prototype.close.calledOnce).toBe(true)
      expect(dev.closeChokidar.getLines()).toMatchSnapshot()
    })
  })

  test('destroys Dirs', async () => {
    const dev = getDev()
    await dev.start()
    await dev.stop()
    expect(Dirs.prototype.destroy.calledOnce).toBe(true)
  })

  test('destroys OutputDir', async () => {
    const dev = getDev()
    await dev.start()
    await dev.stop()
    expect(OutputDir.prototype.destroy.calledOnce).toBe(true)
  })

  test('closes DisplayTask', async () => {
    const dev = getDev()
    await dev.start()
    await dev.stop()
    expect(DisplayTask.prototype.close.calledOnce).toBe(true)
  })
})
