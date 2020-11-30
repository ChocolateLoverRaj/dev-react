// The DevReact class
import normalize from './normalize.js'
import getWarning from './warning.js'
import isBadDir from './is-bad-dir.js'
import OutputDir from './output-dir.js'
import Dir from './dir.js'
import Dirs from './dirs.js'
import chokidar from 'chokidar'
import express from 'express'
import {
  ConcatTask,
  DisplayTask,
  MapTask,
  CustomTask,
  HideTask,
  TextAddon,
  StateAddon
} from 'display-task'
import { stat } from 'fs/promises'
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

    this.emptyDir = new OutputDir(outputDir)
    this.dirs = new Dirs()
    this.closeChokidarAddon = new StateAddon(new TextAddon('Close chokidar'))
    this.closeChokidar = new HideTask(new CustomTask(this.closeChokidarAddon))
    this.warningsBadDir = new MapTask()
    this.warningsUnrecognized = new MapTask()
    this.task = new ConcatTask(
      this.emptyDir.task,
      this.dirs.task,
      this.closeChokidar,
      this.warningsBadDir,
      this.warningsUnrecognized
    )
    this.server = express()
  }

  async start () {
    // Show / hide tasks specific to starting / stopping
    this.closeChokidar.hidden = true

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

    this.emptyDir.empty()

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
          this.warningsBadDir.update()
          return
        }
        this.dirs.set(name, new Dir(this.emptyDir, this.inputDir, name))
      })
      .on('unlinkDir', path => {
        const name = basename(path)
        if (name === '_common') {
          return
        }
        if (isBadDir(name)) {
          this.warningsBadDir.delete(name)
          this.warningsBadDir.update()
          return
        }
        this.dirs.delete(name)
      })
      .on('add', path => {
        const filename = basename(path)
        this.warningsUnrecognized.set(filename, getWarning('Unrecognized File', filename))
        this.warningsUnrecognized.update()
      })
      .on('unlink', path => {
        this.warningsUnrecognized.delete(basename(path))
        this.warningsUnrecognized.update()
      })
  }

  async stop () {
    this.closeChokidar.hidden = false
    this.task.update()
    await Promise.all([
      this.chokidar.close()
        .then(() => {
          this.closeChokidarAddon.state = 'complete'
        })
        .catch(() => {
          this.closeChokidarAddon.state = 'failed'
        })
        .then(() => {
          this.closeChokidarAddon.update()
        }),
      this.dirs.destroy(),
      this.emptyDir.destroy()
    ])
    await this.displayTask.close()
  }
}

export default DevReact
