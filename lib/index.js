// The DevReact class
import normalize from './normalize.js'
import GroupTask from './tasks/group-task.js'
import DisplayTask from './tasks/display-task.js'
import WarningsList from './warnings-list.js'
import getWarning from './warning.js'
import isBadDir from './is-bad-dir.js'
import Dir from './dir.js'
import Dirs from './dirs.js'
import chokidar from 'chokidar'
import express from 'express'
import { stat } from 'fs/promises'
import { once } from 'events'
import { basename } from 'path'

class DevReact {
  constructor ({ inputDir, outputDir }) {
    try {
      inputDir = normalize(inputDir)
    } catch (e) {
      throw new Error(`Error normalizing inputDir: ${e}`)
    }
    this.inputDir = inputDir

    try {
      outputDir = normalize(outputDir)
    } catch (e) {
      throw new Error(`Error normalizing inputDir: ${e}`)
    }
    this.outputDir = outputDir

    this.dirs = new Dirs()
    this.warningsBadDir = new WarningsList()
    this.warningsUnrecognized = new WarningsList()
    this.task = new GroupTask(this.dirs.task, this.warningsBadDir.task, this.warningsUnrecognized.task)
    this.server = express()
  }

  async watch () {
    this.watching = true
    this.displayTask = new DisplayTask(this.task)
    let stats
    try {
      stats = await stat(this.inputDir)
    } catch (e) {
      if (e.code === 'ENOENT') {
        throw new Error('this.inputDir does not exist.')
      } else if (e.code === 'EACCES') {
        throw new Error(`Cannot access this.inputDir: ${e}`)
      } else {
        throw new Error(`Error getting stats for this.inputDir: ${e}`)
      }
    }
    if (!stats.isDirectory()) {
      throw new Error('this.inputDir is not a directory.')
    }
    this.chokidar = chokidar
      .watch(this.inputDir, {
        depth: 0
      })
      .on('addDir', path => {
        path = normalize(path)
        if (path === this.inputDir) {
          return
        }
        const name = basename(path)
        if (name === '_common') {
          return
        }
        if (isBadDir(name)) {
          this.warningsBadDir.set(name, getWarning('Unrecognized Special Dir', name))
          return
        }
        this.dirs.set(name, new Dir(this.inputDir, name))
      })
      .on('unlinkDir', path => {
        const name = basename(path)
        if (name === '_common') {
          return
        }
        if (isBadDir(name)) {
          this.warningsBadDir.delete(name)
          return
        }
        this.dirs.delete(name)
      })
      .on('add', path => {
        const filename = basename(path)
        this.warningsUnrecognized.set(filename, getWarning('Unrecognized File', filename))
      })
      .on('unlink', path => {
        this.warningsUnrecognized.delete(basename(path))
      })
    await once(this.chokidar, 'ready')
  }

  async unwatch () {
    if (this.watching) {
      await Promise.all([
        this.displayTask.close(),
        this.chokidar.close()
      ])
    }
  }
}

export default DevReact
