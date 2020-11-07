// The DevReact class
import normalize from './normalize.js'
import GroupTask from './tasks/group-task.js'
import displayTask from './tasks/display-task.js'
import WarningsList from './warnings-list.js'
import getWarning from './warning.js'
import chokidar from 'chokidar'
import express from 'express'
import { stat } from 'fs/promises'
import { once } from 'events'
import { basename } from 'path'

class DevReact {
  constructor (inputDir) {
    try {
      inputDir = normalize(inputDir)
    } catch (e) {
      throw new Error(`Error normalizing inputDir: ${e}`)
    }
    this.inputDir = inputDir

    this.dirs = []
    this.dirsTasks = new GroupTask()
    this.warningsBadDir = new WarningsList()
    this.warningsUnrecognized = new WarningsList()
    this.task = new GroupTask(this.dirsTasks, this.warningsBadDir.task, this.warningsUnrecognized.task)
    this.server = express()
  }

  async watch () {
    displayTask(this.task)
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
      .on('addDir', dir => {
        dir = normalize(dir)
        if (dir === this.inputDir) {
          return
        }
        const name = basename(dir)
        if (name.startsWith('_')) {
          if (!['_index', '_common'].includes(name)) {
            this.warningsBadDir.set(name, getWarning('Unrecognized Special Dir', name))
          }
        }
      })
      .on('add', path => {
        const filename = basename(path)
        this.warningsUnrecognized.set(filename,getWarning('Unrecognized File', filename))
      })
      .on('unlink', path => {
        this.warningsUnrecognized.delete(basename(path))
      })
    await once(this.chokidar, 'ready')
  }

  async unwatch () {
    if (this.chokidar) {
      await this.chokidar.close()
    }
  }
}

export default DevReact
