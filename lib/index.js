// The DevReact class
import normalize from './normalize.js'
import GroupTask from './tasks/group-task.js'
import displayTask from './tasks/display-task.js'
import Dir from './dir.js'
import warning from './warning.js'
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
    this.warningsTasks = new GroupTask()
    this.warningsTasks.styles.color = 'yellow'
    this.task = new GroupTask(this.dirsTasks, this.warningsTasks)
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
        // TODO: ignore top level addDir
        // TODO: do something
        dir = normalize(dir)
        if (dir === this.inputDir) {
          return
        }
        console.log('addDir')
      })
      .on('add', filename => {
        this.warningsTasks.tasks.push(warning(basename(filename)))
        this.warningsTasks.update()
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
