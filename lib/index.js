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
import { readdir } from 'fs/promises'
import { basename, join } from 'path'

const devReact = options => {
  // Default options
  options = {
    watch: true,
    ...options
  }
  // Normalize input and output dirs
  const inputDir = normalize(options.inputDir)
  const outputDir = normalize(options.outputDir)
  // Add a dir
  const addDir = async path => {
    console.log(path)
  }
  if (options.watch) {
    // Return a promise like interface for managing dev
    let resolve
    let reject
    const promise = new Promise((s, j) => {
      resolve = s
      reject = j
    })
    // Express server
    promise.server = express()
    // Bad dir warnings
    const warningsBadDir = new MapTask()
    // Unrecognized file warnings
    const warningsUnrecognized = new MapTask()
    // Close chokidar
    const closeChokidarAddon = new StateAddon(new TextAddon('Close chokidar'))
    const closeChokidar = new HideTask(new CustomTask(closeChokidarAddon))
    closeChokidar.hidden = true
    // Stuff to display
    const task = new ConcatTask(
      warningsBadDir,
      warningsUnrecognized,
      closeChokidar
    )
    // Display the task
    const displayTask = new DisplayTask(task)
    // Watch the files
    const watcher = chokidar.watch(inputDir, { depth: 0 })
      .on('addDir', path => {
        path = normalize(path)
        // Chokidar emits addDir for top level dir. Ignore it.
        if (path === inputDir) {
          return
        }
        const name = basename(path)
        // Ignore the _res dir
        if (name === '_res') {
          return
        }
        // Show a warning for bad dirs
        if (isBadDir(name)) {
          warningsBadDir.set(name, getWarning('Unrecognized Special Dir', name))
          warningsBadDir.update()
          return
        }
        // Add the dir
        addDir(name)
      })
      .on('unlinkDir', path => {
        const name = basename(path)
        if (name === '_res') {
          return
        }
        if (isBadDir(name)) {
          warningsBadDir.delete(name)
          warningsBadDir.update()
          return
        }
      })
      .on('error', err => {
        displayTask.close().then(() => {
          reject(err)
        })
      })
      .on('add', path => {
        const filename = basename(path)
        warningsUnrecognized.set(filename, getWarning('Unrecognized File', filename))
        warningsUnrecognized.update()
      })
      .on('unlink', path => {
        warningsUnrecognized.delete(basename(path))
        warningsUnrecognized.update()
      })
    // Stop watching files
    promise.stop = async () => {
      // Show the close chokidar task
      closeChokidar.hidden = false
      closeChokidar.update()
      await watcher.close()
      // Update close chokidar task
      closeChokidarAddon.state = 'complete'
      closeChokidarAddon.update()
      // Stop displaying
      await displayTask.close()
      // Resolve the promise
      resolve()
    }
    return promise
  } else {
    // Convert to async function
    return (async () => {
      // Read the inputDir
      const files = await readdir(inputDir, { withFileTypes: true })
      // Loop through all files
      await Promise.all(files.map(async file => {
        // Ignore non dirs
        if (!file.isDirectory()) {
          return
        }
        // Add the dir
        await addDir(file.name)
      }))
    })()
  }
}

class DevReact {
  constructor ({ inputDir, outputDir }) {
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

export default devReact
