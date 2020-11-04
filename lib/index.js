// The DevReact class
import normalize from './normalize.js'
import chokidar from 'chokidar'
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
  }

  async start () {
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
    this.chokidar = chokidar.watch(this.inputDir, {
      depth: 0
    })
    await once(this.chokidar, 'ready')
  }
}

export default DevReact
