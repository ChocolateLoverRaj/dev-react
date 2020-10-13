// File output class, which is useful for managing file generating, writing, and using
import WrapperError from './error.js'

import EventEmitter from 'eventemitter3'
import { writeFile, readFile } from 'fs/promises'

class FileOutput extends EventEmitter {
  constructor (builder, outputPath) {
    super()
    this.outputPath = outputPath
    this.written = false
    this.readPromise = null
    this.canceled = false
    this.buildPromise = builder(this)
      .then(output => {
        if (!this.canceled) {
          writeFile(outputPath, output)
            .then(() => {
              this.written = true
            })
            .catch(e => {
              this.emit('error', new WrapperError('Error writing output file', e))
            })
        }
      })
      .catch(e => {
        this.emit('error', new WrapperError('Error building file', e))
      })
  }

  async read() {
    if (this.canceled) {
      return false
    }
    else if (!this.written) {
      return await this.buildPromise
    }
    else {
      if (!this.readPromise) {
        this.readPromise = readFile(this.outputPath, 'utf-8')
          .then(() => {
            this.readPromise = null
          })
      }
      else {
        const output = await this.readPromise
        if (this.canceled) {
          return false
        } else {
          return output
        }
      }
    }
  }

  cancel() {
    this.canceled = true
  }
}

export default FileOutput
