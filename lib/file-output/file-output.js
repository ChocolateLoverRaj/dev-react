// File output class, which is useful for managing file generating, writing, and using
const EventEmitter = require('eventemitter3')
const { writeFile, readFile, unlink } = require('fs/promises')

class FileOutput extends EventEmitter {
  constructor (builder, outputPath) {
    super()
    this.outputPath = outputPath
    this.readPromise = null
    this.destroyed = false;
    (this.buildPromise = builder(this))
      .then(output => {
        if (!this.destroyed) {
          writeFile(outputPath, output)
            .then(() => {
              this.buildPromise = null
            })
            .catch(e => {
              this.emit('error', new Error(`Error writing output file: ${e}`))
            })
        }
      })
      .catch(e => {
        this.emit('error', new Error(`Error building file: ${e}`))
      })
  }

  async read () {
    if (this.destroyed) {
      return false
    } else if (this.buildPromise) {
      return await this.buildPromise
    } else {
      if (!this.readPromise) {
        (this.readPromise = readFile(this.outputPath, 'utf-8'))
          .then(() => {
            this.readPromise = null
          })
          .catch(() => 'This is caught with the await below')
      }
      try {
        const output = await this.readPromise
        if (this.destroyed) {
          return false
        } else {
          return output
        }
      } catch (e) {
        throw new Error(`Error reading file: ${e}`)
      }
    }
  }

  async destroy () {
    this.destroyed = true
    if (this.buildPromise === null) {
      await unlink(this.outputPath)
    }
  }
}

module.exports = FileOutput
