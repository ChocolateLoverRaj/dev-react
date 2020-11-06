// The DevReact class
import normalize from './normalize.js'
import chokidar from 'chokidar'
import express from 'express'
import { stat } from 'fs/promises'
import { once } from 'events'

class DevReact {
  constructor (inputDir) {
    try {
      inputDir = normalize(inputDir)
    } catch (e) {
      throw new Error(`Error normalizing inputDir: ${e}`)
    }
    this.inputDir = inputDir

    this.server = express()
  }

  async watch () {
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
      .on('addDir', () => {
        // TODO: ignore top level addDir
        // TODO: do something
        console.log('addDir')
      })
      .on('add', () => {
        // TODO: show warning
        console.log('unrecognized file.')
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
