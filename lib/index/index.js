// The DevReact class
import normalize from '../normalize/index.js'
import chokidar from 'chokidar'
import { access } from 'fs/promises'
import { constants } from 'fs'
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
    try {
      await access(this.inputDir, constants.R_OK)
    } catch (e) {
      if (e.code === 'ENOENT') {
        throw new Error('this.inputDir does not exist.')
      } else {
        throw new Error(`Error accessing this.inputDir: ${e}`)
      }
    }
    this.chokidar = chokidar.watch(this.inputDir, {
      depth: 0
    })
    await once(this.chokidar, 'ready')
  }
}

export default DevReact
