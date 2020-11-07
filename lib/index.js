// The DevReact class
import normalize from './normalize.js'
import GroupTask from './tasks/group-task.js'
import displayTask from './tasks/display-task.js'
import Dir from './dir.js'
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
    this.badDirWarningsTasks = new Map()
    this.badDirWarningsTask = new GroupTask()
    this.badDirWarningsTask.styles.color = 'yellow'
    this.unrecognizedWarningsTasks = new Map()
    this.unrecognizedWarningsTask = new GroupTask()
    this.unrecognizedWarningsTask.styles.color = 'yellow'
    this.task = new GroupTask(this.dirsTasks, this.badDirWarningsTask, this.unrecognizedWarningsTask)
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
            const warning = getWarning('Unrecognized Special Dir', name)
            this.badDirWarningsTasks.set(name, warning)
            this.badDirWarningsTask.tasks.add(warning)
            this.badDirWarningsTask.update()
          }
        }
      })
      .on('add', path => {
        const filename = basename(path)
        const warning = getWarning('Unrecognized File', filename)
        this.unrecognizedWarningsTasks.set(filename, warning)
        this.unrecognizedWarningsTask.tasks.add(warning)
        this.unrecognizedWarningsTask.update()
      })
      .on('unlink', path => {
        const filename = basename(path)
        const warning = this.unrecognizedWarningsTasks.get(filename)
        this.unrecognizedWarningsTasks.delete(filename)
        this.unrecognizedWarningsTask.tasks.delete(warning)
        this.unrecognizedWarningsTask.update()
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
